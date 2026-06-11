import Database from 'better-sqlite3'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const DB_PATH = join(process.cwd(), 'server', 'hiroshige.db')
const OUTPUT_DIR = join(process.cwd(), 'public', 'artworks')
const BASE_DELAY_MS = 3000
const MAX_RETRIES = 3

interface ArtworkRow {
  id: number
  wikimedia_url: string
  title: string
}

interface ApiSearchResult {
  ns: number
  title: string
}

async function findCommonsFile(title: string): Promise<string | null> {
  const query = `"${title}" Hiroshige`
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=10&format=json`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'HiroshigePortfolio/1.0 (local dev)' },
  })

  if (!res.ok) {
    console.error(`  Search API returned ${res.status}`)
    return null
  }

  const data = await res.json() as {
    query?: { search?: ApiSearchResult[] }
  }

  const results = data.query?.search ?? []

  const jpgResults = results.filter((r) =>
    /\.(jpg|jpeg)$/i.test(r.title) &&
    !r.title.includes('Google Art Project') &&
    !r.title.endsWith('(version).jpg') &&
    !r.title.endsWith('(version-2).jpg')
  )

  const selected = jpgResults[0] ?? results.find((r) => /\.(jpg|jpeg)$/i.test(r.title))

  if (!selected) {
    console.error(`  No matching file found on Commons`)
    return null
  }

  const filePage = selected.title
  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(filePage)}&prop=imageinfo&iiprop=url&format=json`

  const infoRes = await fetch(infoUrl, {
    headers: { 'User-Agent': 'HiroshigePortfolio/1.0 (local dev)' },
  })

  if (!infoRes.ok) {
    console.error(`  File info API returned ${infoRes.status}`)
    return null
  }

  const infoData = await infoRes.json() as {
    query?: { pages?: Record<string, { imageinfo?: { url: string }[] }> }
  }

  const pages = infoData.query?.pages ?? {}
  for (const pid of Object.keys(pages)) {
    const info = pages[pid]?.imageinfo?.[0]
    if (info?.url) return info.url
  }

  return null
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HiroshigePortfolio/1.0 (local dev)',
      },
    })

    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer())
      await writeFile(destPath, buffer)
      return true
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After')
      const wait = retryAfter ? parseInt(retryAfter, 10) * 1000 : BASE_DELAY_MS * attempt * 2
      console.error(`  Rate limited. Waiting ${wait}ms before retry ${attempt}/${MAX_RETRIES}...`)
      await new Promise((r) => setTimeout(r, wait))
      continue
    }

    console.error(`  HTTP ${response.status} ${response.statusText}`)
    return false
  }

  console.error(`  Max retries exceeded`)
  return false
}

async function main() {
  const db = new Database(DB_PATH)

  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true })
    console.log(`Created directory: ${OUTPUT_DIR}\n`)
  }

  const rows = db
    .prepare('SELECT id, wikimedia_url, title FROM artworks ORDER BY id ASC')
    .all() as ArtworkRow[]

  const toDownload = rows.filter((r) => !r.wikimedia_url.startsWith('/artworks/'))

  console.log(`Total artworks: ${rows.length}`)
  console.log(`Already local:  ${rows.length - toDownload.length}`)
  console.log(`To download:    ${toDownload.length}`)

  if (toDownload.length === 0) {
    console.log('\nNothing to download.')
    db.close()
    return
  }

  let downloaded = 0
  let failed = 0

  for (const row of toDownload) {
    console.log(`\n[${row.id}] ${row.title}`)

    console.log(`  Searching Commons...`)
    const actualUrl = await findCommonsFile(row.title)

    if (!actualUrl) {
      console.error(`  ✗ Could not find URL`)
      failed++
      console.log(`  Waiting ${BASE_DELAY_MS}ms...`)
      await new Promise((r) => setTimeout(r, BASE_DELAY_MS))
      continue
    }

    const filename = decodeURIComponent(actualUrl.split('/').pop() || `${row.id}.jpg`)
    const destPath = join(OUTPUT_DIR, filename)
    const localPath = `/artworks/${filename}`

    console.log(`  URL: ${actualUrl}`)
    console.log(`  → ${localPath}`)

    const success = await downloadImage(actualUrl, destPath)

    if (success) {
      db.prepare(
        'UPDATE artworks SET wikimedia_url = ?, thumbnail_url = ? WHERE id = ?'
      ).run(localPath, localPath, row.id)
      console.log(`  ✓ Saved`)
      downloaded++
    } else {
      console.error(`  ✗ Failed`)
      failed++
    }

    console.log(`  Waiting ${BASE_DELAY_MS}ms...`)
    await new Promise((r) => setTimeout(r, BASE_DELAY_MS))
  }

  db.close()
  console.log(`\nDone! Downloaded: ${downloaded}, Failed: ${failed}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

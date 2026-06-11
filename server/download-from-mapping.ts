import Database from 'better-sqlite3'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const DB_PATH = join(process.cwd(), 'server', 'hiroshige.db')
const OUTPUT_DIR = join(process.cwd(), 'public', 'artworks')
const DELAY_MS = 3000
const MAX_RETRIES = 3

interface MappingEntry {
  id: number
  title: string
  url?: string
  filename?: string
  search?: string
}

async function downloadFile(url: string, destPath: string): Promise<boolean> {
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
      const wait = retryAfter ? parseInt(retryAfter, 10) * 1000 : DELAY_MS * attempt * 2
      console.error(`  Rate limited. Waiting ${wait}ms before retry ${attempt}/${MAX_RETRIES}...`)
      await new Promise((r) => setTimeout(r, wait))
      continue
    }

    if (response.status === 404) {
      console.error(`  HTTP 404 — file not found`)
      return false
    }

    console.error(`  HTTP ${response.status}`)
    return false
  }

  console.error(`  Max retries exceeded`)
  return false
}

async function main() {
  const mappingPath = join(process.cwd(), 'server', 'url-mapping.json')
  const { artworks } = JSON.parse(
    require('fs').readFileSync(mappingPath, 'utf-8')
  ) as { artworks: MappingEntry[] }

  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true })
  }

  const db = new Database(DB_PATH)
  const updateStmt = db.prepare(
    'UPDATE artworks SET wikimedia_url = ?, thumbnail_url = ? WHERE id = ?'
  )

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const entry of artworks) {
    if (!entry.url || !entry.filename) {
      console.log(`\n[${entry.id}] ${entry.title} — no URL yet (search: ${entry.search})`)
      skipped++
      continue
    }

    const destPath = join(OUTPUT_DIR, entry.filename)
    const localPath = `/artworks/${entry.filename}`

    if (existsSync(destPath)) {
      console.log(`\n[${entry.id}] ${entry.title} — already exists, updating DB`)
      updateStmt.run(localPath, localPath, entry.id)
      skipped++
      continue
    }

    console.log(`\n[${entry.id}] ${entry.title}`)
    console.log(`  URL: ${entry.url}`)
    console.log(`  → ${localPath}`)

    const success = await downloadFile(entry.url, destPath)

    if (success) {
      updateStmt.run(localPath, localPath, entry.id)
      console.log(`  ✓ Saved (${Math.round((await require('fs').statSync(destPath)).size / 1024)} KB)`)
      downloaded++
    } else {
      console.error(`  ✗ Failed`)
      failed++
    }

    console.log(`  Waiting ${DELAY_MS}ms...`)
    await new Promise((r) => setTimeout(r, DELAY_MS))
  }

  db.close()
  console.log(`\nDone! Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

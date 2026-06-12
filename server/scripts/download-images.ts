import { readFileSync, existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { execSync } from 'child_process'

const URLS_PATH = join(process.cwd(), 'server', 'scripts', 'image-urls.json')
const FULL_DIR = join(process.cwd(), 'public', 'images', 'artworks', 'full')
const THUMB_DIR = join(process.cwd(), 'public', 'images', 'artworks', 'thumb')
const FAILED_LOG = join(process.cwd(), 'server', 'scripts', 'failed-downloads.txt')
const USER_AGENT = 'hiroshige-portfolio-local/1.0 (personal project)'

interface ArtworkEntry {
  artworkId: string
  title: string
  fullUrl: string
  thumbUrl: string
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/ō/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function downloadFile(
  url: string,
  destPath: string,
  label: string,
): Promise<boolean> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    })

    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer())
      await writeFile(destPath, buffer)
      return true
    }

    console.error(`  ${label}: HTTP ${response.status}`)
    return false
  } catch (err) {
    console.error(`  ${label}: Network error — ${err}`)
    return false
  }
}

async function main() {
  const entries: ArtworkEntry[] = JSON.parse(
    readFileSync(URLS_PATH, 'utf-8'),
  )

  console.log(`\n  Downloading ${entries.length} artworks...\n`)

  if (!existsSync(FULL_DIR)) {
    await mkdir(FULL_DIR, { recursive: true })
  }
  if (!existsSync(THUMB_DIR)) {
    await mkdir(THUMB_DIR, { recursive: true })
  }

  const total = entries.length
  let alreadyHad = 0
  let newlyDownloaded = 0
  let failed = 0
  const failedList: string[] = []

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const slug = slugify(entry.title)
    const ext = '.jpg'
    const fullDest = join(FULL_DIR, `${slug}${ext}`)
    const thumbDest = join(THUMB_DIR, `${slug}${ext}`)
    const progress = `${i + 1}/${total}`

    const fullExists = existsSync(fullDest)
    const thumbExists = existsSync(thumbDest)

    if (fullExists && thumbExists) {
      alreadyHad++
      console.log(`  [${progress}] [skip] ${entry.title} — already downloaded`)
      continue
    }

    process.stdout.write(`  [${progress}] Downloading: ${entry.title}...`)

    let fullOk = fullExists
    let thumbOk = thumbExists
    let didSomething = false

    if (!fullExists) {
      fullOk = await downloadFile(entry.fullUrl, fullDest, `${entry.title} (full)`)
      didSomething = true
    }

    if (!thumbExists) {
      if (fullOk) {
        const data = readFileSync(fullDest)
        await writeFile(thumbDest, data)
        thumbOk = true
      } else {
        thumbOk = await downloadFile(entry.thumbUrl, thumbDest, `${entry.title} (thumb)`)
        didSomething = true
        if (thumbOk && !fullOk) {
          const data = readFileSync(thumbDest)
          await writeFile(fullDest, data)
          fullOk = true
        }
      }
    }

    if (fullOk && thumbOk) {
      newlyDownloaded++
      console.log(` ✓`)
    } else {
      failed++
      failedList.push(`${entry.artworkId}: ${entry.title}`)
      console.log(` ✗`)
    }

    if (didSomething && i < entries.length - 1) {
      await sleep(300)
    }
  }

  if (failedList.length > 0) {
    await writeFile(FAILED_LOG, failedList.join('\n') + '\n')
    console.log(`\n  Failed downloads logged to: ${FAILED_LOG}\n`)
  }

  const diskUsage = execSync(
    'du -sh ' + join(process.cwd(), 'public', 'images', 'artworks'),
    { encoding: 'utf-8' },
  ).trim()

  console.log(`\n  ─────────────────────────────────────────────`)
  console.log(`    Total:    ${total}`)
  console.log(`    Already:  ${alreadyHad}`)
  console.log(`    New:      ${newlyDownloaded}`)
  console.log(`    Failed:   ${failed}`)
  console.log(`    Disk:     ${diskUsage}`)
  console.log(`  ─────────────────────────────────────────────\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

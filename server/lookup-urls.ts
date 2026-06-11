import Database from 'better-sqlite3'

const db = new Database('server/hiroshige.db')

interface SearchResult {
  title: string
  pageid: number
}

async function findCommonsUrl(
  searchQuery: string,
  retries = 2
): Promise<string | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Search for the file
      const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&srnamespace=6&srlimit=10&format=json`
      const searchRes = await fetch(searchUrl, {
        headers: { 'User-Agent': 'HiroshigePortfolio/1.0 (lookup)' },
      })

      if (searchRes.status === 429) {
        const wait = 10000 * (attempt + 1)
        console.error(`  Rate limited on search, waiting ${wait}ms...`)
        await new Promise((r) => setTimeout(r, wait))
        continue
      }

      if (!searchRes.ok) {
        return null
      }

      const searchData = (await searchRes.json()) as {
        query?: { search?: SearchResult[] }
      }
      const results = searchData.query?.search ?? []

      if (results.length === 0) return null

      // Prefer files matching the artwork title, avoid Google Art Project / versions
      const jpgResults = results.filter(
        (r) =>
          /\.(jpg|jpeg)$/i.test(r.title) &&
          !r.title.includes('Google Art Project') &&
          !r.title.includes('(version)')
      )

      const selected = jpgResults[0] ?? results.find((r) => /\.(jpg|jpeg)$/i.test(r.title))
      if (!selected) return null

      // Get the URL
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(selected.title)}&prop=imageinfo&iiprop=url&format=json`
      const infoRes = await fetch(infoUrl, {
        headers: { 'User-Agent': 'HiroshigePortfolio/1.0 (lookup)' },
      })

      if (!infoRes.ok) return null

      const infoData = (await infoRes.json()) as {
        query?: { pages?: Record<string, { imageinfo?: { url: string }[] }> }
      }
      const pages = infoData.query?.pages ?? {}
      for (const pid of Object.keys(pages)) {
        const info = pages[pid]?.imageinfo?.[0]
        if (info?.url) return info.url
      }
      return null
    } catch {
      return null
    }
  }
  return null
}

async function main() {
  const rows = db
    .prepare('SELECT id, title, wikimedia_url FROM artworks ORDER BY id ASC')
    .all() as { id: number; title: string; wikimedia_url: string }[]

  console.log('Finding correct Commons URLs for all artworks...\n')

  for (const row of rows) {
    process.stdout.write(`[${row.id}] "${row.title}" → `)

    // Try various search queries
    const queries = [
      `"${row.title}" Hiroshige filetype:jpg`,
      `"${row.title}" Hiroshige`,
      row.title,
    ]

    let url: string | null = null
    for (const query of queries) {
      url = await findCommonsUrl(query)
      if (url) break
    }

    if (url) {
      console.log(url)
    } else {
      console.log('(NOT FOUND)')
    }

    // 1s delay between API calls
    await new Promise((r) => setTimeout(r, 1000))
  }

  db.close()
}

main().catch(console.error)

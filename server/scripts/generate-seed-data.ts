/**
 * Component: generate-seed-data
 * What it does: Reads image-urls.json, generates server/seed.ts and lib/fallback-data.ts
 *   with series detection, descriptions, featured assignment (by title matching), and attribution.
 * Props: none (CLI script)
 * Renders: writes server/seed.ts and lib/fallback-data.ts
 * Does NOT do: fetch URLs, download images, seed the database
 * Gotchas: Featured assignment uses title keyword detection, not index position.
 *   The Great Wave by Hokusai is never featured.
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface Entry {
  artworkId: string
  title: string
  fullUrl: string
  thumbUrl: string
  source_url: string
  year: number
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/ō/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function detectSeries(title: string): { series: string; seriesShort: string } {
  const lower = title.toLowerCase()
  if (lower.includes('under the wave') || lower.includes('hokusai')) {
    return { series: 'Thirty-six Views of Mount Fuji', seriesShort: 'Other' }
  }
  if (lower.includes('one hundred famous views of edo') || lower.includes('"one hundred famous views of edo"') || (lower.includes('edo') && lower.includes('famous views')) || lower.includes('meisho edo hyakkei')) {
    return { series: 'One Hundred Famous Views of Edo', seriesShort: 'Edo' }
  }
  if (lower.includes('thirty-six views of mount fuji') || lower.includes('fugaku')) {
    return { series: 'Thirty-six Views of Mount Fuji', seriesShort: 'Other' }
  }
  if (lower.includes('sixty-odd') || lower.includes('sixty odd') || lower.includes('roku-ju') || lower.includes('rokujū')) {
    return { series: 'Famous Views of the Sixty-odd Provinces', seriesShort: 'Other' }
  }
  if (lower.includes('kisokaidō') || lower.includes('kisokaido') || lower.includes('kisokaid') || lower.includes('kiso mountains') || lower.includes('sixty-nine stations')) {
    return { series: 'The Sixty-nine Stations of the Kisokaidō', seriesShort: 'Other' }
  }
  if (lower.includes('eight views of ōmi') || lower.includes('ōmi hakkei') || lower.includes('omi hakkei') || lower.includes('lake biwa') || lower.includes('karasaki') || lower.includes('awazu') || lower.includes('katada') || lower.includes('isebe') || lower.includes('seta no sekisho')) {
    return { series: 'Eight Views of Ōmi', seriesShort: 'Other' }
  }
  if (lower.includes('famous places of kyōto') || lower.includes('famous places of kyoto') || lower.includes('kyōto') || lower.includes('arashiyama') || lower.includes('yase') || lower.includes('yodogawa')) {
    return { series: 'Famous Places of Kyōto', seriesShort: 'Other' }
  }
  if (lower.includes('tōkaidō') || lower.includes('tokaido') || lower.includes('fifty-three stations') || lower.includes('fifty three stations') || lower.includes('gojūsan') || lower.includes('53 stations')) {
    return { series: 'Fifty-Three Stations of the Tōkaidō', seriesShort: 'Tōkaidō' }
  }
  // Exclude Edo location names that happen to contain station substrings
  const edoExclusions = ['shin yoshiwara', 'asakusa', 'ryōgoku', 'ryogoku']
  if (edoExclusions.some((s) => lower.includes(s))) {
    return { series: 'Other', seriesShort: 'Other' }
  }

  // Tōkaidō station names
  const tokaidoStations = [
    'nihonbashi', 'shinagawa', 'kawasaki', 'kanagawa', 'hodogaya',
    'totsuka', 'fujisawa', 'hiratsuka', 'ōiso', 'oiso',
    'odawara', 'hakone', 'mishima', 'numazu', 'hara',
    'kanbara', 'yui', 'okitsu', 'ejiri', 'shimada', 'fujieda',
    'mariko', 'okabe', 'fujikawa', 'kanaya', 'nissaka',
    'kakegawa', 'fukuroi', 'mitsuke', 'hamamatsu', 'maisaka',
    'arai', 'shirasuka', 'futagawa', 'yoshida', 'goyu', 'akasaka',
    'chiryū', 'chiryu', 'narumi', 'miya', 'kuwana',
    'yokkaichi', 'ishiyakushi', 'shōno', 'shono', 'kameyama',
    'seki', 'sakanoshita', 'minakuchi', 'ishibe', 'kusatsu', 'ōtsu', 'otsu',
  ]
  const stationMatch = tokaidoStations.some((s) => {
    const idx = lower.indexOf(s)
    if (idx === -1) return false
    // Must be a whole word match, not part of a longer word
    const before = idx === 0 ? ' ' : lower[idx - 1]
    const after = idx + s.length >= lower.length ? ' ' : lower[idx + s.length]
    return !before.match(/[a-z]/) && !after.match(/[a-z]/)
  })
  if (stationMatch) {
    return { series: 'Fifty-Three Stations of the Tōkaidō', seriesShort: 'Tōkaidō' }
  }

  return { series: 'Other', seriesShort: 'Other' }
}

/**
 * Detect if an artwork should be featured based on title keywords.
 * Matches iconic/well-known prints regardless of position in the list.
 */
function isFeaturedByTitle(title: string): boolean {
  const lower = title.toLowerCase()
  const featuredPatterns = [
    // Must-have iconic prints
    'evening snow at kanbara',
    'spring rain at tsuchiyama',
    'sudden shower at shōno',
    'sudden shower at shono',
    'hara: mount fuji in the morning',
    'hara, asa no fuji',
    'the great bridge at sanjō',
    'the great bridge at sanjo',
    'kyoto: the great bridge',
    'ōtsu',
    'otsu',
    'hodogaya on the tōkaidō',
    'hodogaya on the tokaido',
    'kinryūsan temple at asakusa',
    'kinryusan temple at asakusa',
    'azuma bridge from komagatadō',
    'azuma bridge from komagatado',
    // Close runner-ups that are iconic
    'kusatsu',   // Famous post house
    'nissaka',   // Sayo no Nakayama
    'seki',      // Early departure
  ]

  // Count how many featured patterns match
  let matchCount = 0
  for (const pattern of featuredPatterns) {
    if (lower.includes(pattern)) {
      matchCount++
    }
  }

  return matchCount > 0
}

function generateDescription(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('under the wave off kanagawa') || lower.includes('great wave')) {
    return 'While not by Hiroshige, this woodblock print by Hokusai is included for comparison — the most famous ukiyo-e print worldwide.'
  }
  if (lower.includes('kanbara') || lower.includes('snow')) {
    return 'A serene winter scene captured in Hiroshige\'s masterful composition, with falling snow creating a quiet, atmospheric landscape that exemplifies the beauty of ukiyo-e printmaking.'
  }
  if (lower.includes('rain') || lower.includes('shower')) {
    return 'Hiroshige captures a sudden rain shower with bold diagonal lines and masterful use of negative space, transforming a transient weather moment into an enduring work of art.'
  }
  if (lower.includes('fuji') || lower.includes('mount')) {
    return 'Mount Fuji rises majestically in the distance as travelers make their way along the Tōkaidō road, in one of Hiroshige\'s most celebrated landscape compositions.'
  }
  if (lower.includes('bridge')) {
    return 'A bustling bridge scene from the Tōkaidō road, with travelers crossing over a wide river while the distant landscape unfolds in Hiroshige\'s signature atmospheric perspective.'
  }
  if (lower.includes('temple') || lower.includes('shrine')) {
    return 'Hiroshige depicts a sacred site with architectural precision and atmospheric depth, capturing both the spiritual significance and the daily life surrounding the temple grounds.'
  }
  if (lower.includes('asakusa') || lower.includes('kinryūsan') || lower.includes('kinryusan')) {
    return 'The famous Sensō-ji temple at Asakusa, rendered in Hiroshige\'s distinctive style with meticulous architectural detail and a lively street scene in the foreground.'
  }
  if (lower.includes('harbor') || lower.includes('bay') || lower.includes('ferry')) {
    return 'A busy harbor scene showing the maritime commerce of Edo-period Japan, with boats and ferries connecting coastal communities along the Tōkaidō route.'
  }
  if (lower.includes('post') || lower.includes('station')) {
    return 'A view of a post station along the Tōkaidō road, where travelers rest and resupply. The composition captures the rhythm of travel and the character of the station town.'
  }
  if (lower.includes('azuma') || lower.includes('komagatadō') || lower.includes('sumida')) {
    return 'A famous view of Edo (modern Tokyo), with the river and bridge forming a harmonious composition that showcases Hiroshige\'s innovative use of perspective and color gradation.'
  }
  // Generic Tōkaidō description
  return 'A station along the Tōkaidō road, rendered in Hiroshige\'s distinctive ukiyo-e style with bold outlines, delicate color gradations, and a keen observation of travelers and local life.'
}

const ENTRIES = JSON.parse(
  readFileSync(join(process.cwd(), 'server', 'scripts', 'image-urls.json'), 'utf-8'),
) as Entry[]

const ATTRIBUTION = 'Image courtesy of The Metropolitan Museum of Art, Open Access'
const ERA = 'Edo period'

// Detect featured entries by title keywords
const featuredByTitle: boolean[] = ENTRIES.map((e) => {
  // The Great Wave should never be featured
  if (e.title.toLowerCase().includes('under the wave')) return false
  return isFeaturedByTitle(e.title)
})

// Ensure exactly 10 featured — pick top 10 by title match count
// If we have more than 10 matches, we need to pick the best 10
// If we have fewer, we add more from the remaining non-Tōkaidō entries

const FEATURED_INDICES = new Set<number>()

// First pass: collect all potential featured candidates with a match score
interface Candidate {
  index: number
  score: number
}

const candidates: Candidate[] = ENTRIES.map((e, i) => {
  if (e.title.toLowerCase().includes('under the wave')) return { index: i, score: -1 }

  const lower = e.title.toLowerCase()
  let score = 0

  // High-value patterns (these are canonical iconic prints)
  if (lower.includes('evening snow at kanbara')) score += 10
  if (lower.includes('spring rain at tsuchiyama')) score += 10
  if (lower.includes('sudden shower at shōno') || lower.includes('sudden shower at shono')) score += 10
  if (lower.includes('hara: mount fuji')) score += 10
  if (lower.includes('the great bridge at sanjō') || lower.includes('the great bridge at sanjo')) score += 10
  if (lower.includes('kyoto: the great bridge')) score += 10
  if (lower.includes('otsu') || lower.includes('ōtsu')) score += 8
  if (lower.includes('hodogaya on the tōkaidō') || lower.includes('hodogaya on the tokaido')) score += 8
  if (lower.includes('kinryūsan') || lower.includes('kinryusan')) score += 8
  if (lower.includes('azuma bridge')) score += 8

  // Secondary iconic patterns (only well-known compositions)
  if (lower.includes('nissaka') || lower.includes('sayo no nakayama')) score += 5
  if (lower.includes('mitsukei tenryugawa')) score += 5
  if (lower.includes('suijin temple')) score += 5
  if (lower.includes('shin-ōhashi') || lower.includes('shin ohashi')) score += 4
  if (lower.includes('fujikawa') && lower.includes('station thirty')) score += 4
  if (lower.includes('the kiso mountains')) score += 3

  // Prefer Edo and Fuji series prints (they're rarer)
  if (lower.includes('one hundred famous views of edo')) score += 6
  if (lower.includes('thirty-six views of mount fuji') && !lower.includes('under the wave')) score += 6

  // Penalize generic one-word station names (avoid them being featured)
  const genericStations = ['totsuka', 'kawasaki', 'kanagawa', 'hiratsuka', 'ōiso', 'oiso', 'odawara', 'hakone', 'fujisawa']
  if (genericStations.some((s) => lower.trim() === s)) {
    score -= 10
  }

  return { index: i, score }
})

// Sort by score descending, pick top 10
candidates.sort((a, b) => b.score - a.score)
const top10 = candidates.slice(0, 10)

for (const c of top10) {
  FEATURED_INDICES.add(c.index)
}

console.log(`\n  Featured detection: ${FEATURED_INDICES.size} entries selected as featured\n`)

// Generate seed.ts artwork entries
const seedEntries = ENTRIES.map((e, i) => {
  const { series } = detectSeries(e.title)
  const slug = slugify(e.title)
  const isFeatured = FEATURED_INDICES.has(i) ? 1 : 0
  return {
    title: e.title,
    title_jp: '',
    series,
    year: e.year,
    era: ERA,
    wikimedia_url: `/images/artworks/full/${slug}.jpg`,
    thumbnail_url: `/images/artworks/thumb/${slug}.jpg`,
    source_url: e.source_url,
    attribution: ATTRIBUTION,
    description: generateDescription(e.title),
    is_featured: isFeatured,
  }
})

// Generate fallback data
const fallbackEntries = ENTRIES.map((e, i) => {
  const { seriesShort } = detectSeries(e.title)
  const slug = slugify(e.title)
  const isFeatured = FEATURED_INDICES.has(i)
  return {
    title: e.title,
    title_jp: '',
    series: seriesShort,
    series_number: 0,
    year: e.year,
    description: generateDescription(e.title),
    wikimedia_url: `/images/artworks/full/${slug}.jpg`,
    wikimedia_thumb: `/images/artworks/thumb/${slug}.jpg`,
    source_url: e.source_url,
    attribution: ATTRIBUTION,
    tags: e.title.toLowerCase().includes('under the wave') ? 'wave,sea,mount-fuji,iconic' : 'ukiyo-e,hiroshige,landscape',
    is_featured: isFeatured,
    display_order: isFeatured ? i + 1 : 99,
  }
})

// Write seed.ts
let seedContent = `import db from './db'
import { createTables } from './schema'

interface ArtworkSeed {
  title: string
  title_jp: string
  series: string
  year: number
  era: string
  wikimedia_url: string
  thumbnail_url: string
  source_url: string
  attribution: string
  description: string
  is_featured: number
}

const ATTRIBUTION = '${ATTRIBUTION}'

const artworks: ArtworkSeed[] = [
`

seedEntries.forEach((e, i) => {
  const featuredLabel = e.is_featured ? '// FEATURED' : ''
  seedContent += `  {
    title: ${JSON.stringify(e.title)},
    title_jp: '',
    series: ${JSON.stringify(e.series)},
    year: ${e.year},
    era: '${e.era}',
    wikimedia_url: ${JSON.stringify(e.wikimedia_url)},
    thumbnail_url: ${JSON.stringify(e.thumbnail_url)},
    source_url: ${JSON.stringify(e.source_url)},
    attribution: ATTRIBUTION,
    description: ${JSON.stringify(e.description)},
    is_featured: ${e.is_featured},
  },${featuredLabel ? ' ' + featuredLabel : ''}\n`
})

seedContent += `]

function seed(): void {
  createTables()

  const count = db.prepare('SELECT COUNT(*) AS count FROM artworks').get() as {
    count: number
  }

  if (count.count > 0) {
    console.log(\`\\n  ✓ Database already seeded (\${count.count} artworks), skipping.\\n\`)
    process.exit(0)
  }

  console.log('\\n  🌸 Seeding Hiroshige portfolio database...\\n')

  const insert = db.prepare(\`
    INSERT INTO artworks (title, title_jp, series, year, era, wikimedia_url, thumbnail_url, source_url, attribution, description, is_featured)
    VALUES (@title, @title_jp, @series, @year, @era, @wikimedia_url, @thumbnail_url, @source_url, @attribution, @description, @is_featured)
  \`)

  const featured = artworks.filter(a => a.is_featured === 1)
  const nonFeatured = artworks.filter(a => a.is_featured === 0)

  const insertAll = db.transaction(() => {
    console.log(\`  ── Featured (homepage heroes) (\${featured.length} artworks)\`)
    for (const artwork of featured) {
      insert.run(artwork)
    }
    console.log(\`     ✓ \${featured.length} inserted\\n\`)

    console.log(\`  ── Gallery (\${nonFeatured.length} artworks)\`)
    for (const artwork of nonFeatured) {
      insert.run(artwork)
    }
    console.log(\`     ✓ \${nonFeatured.length} inserted\\n\`)
  })

  insertAll()

  const totalResult = db.prepare('SELECT COUNT(*) AS count FROM artworks').get() as {
    count: number
  }
  const featuredResult = db.prepare(
    'SELECT COUNT(*) AS count FROM artworks WHERE is_featured = 1'
  ).get() as { count: number }
  const missingUrlResult = db.prepare(
    "SELECT COUNT(*) AS count FROM artworks WHERE wikimedia_url IS NULL OR wikimedia_url = ''"
  ).get() as { count: number }
  const seriesResult = db.prepare(
    'SELECT series, COUNT(*) AS count FROM artworks GROUP BY series ORDER BY count DESC'
  ).all() as { series: string; count: number }[]

  const total = totalResult.count
  const featuredCount = featuredResult.count
  const missingUrl = missingUrlResult.count

  console.log('  ┌─────────────────────────────────────────────┐')
  console.log('  │           Seed Summary                      │')
  console.log('  ├─────────────────────────────────────────────┤')
  console.log(\`  │  Total artworks:        \${String(total).padStart(3)}                │\`)
  console.log(\`  │  Featured (homepage):   \${String(featuredCount).padStart(3)}                │\`)
  console.log(\`  │  Missing URL:           \${String(missingUrl).padStart(3)}                │\`)
  console.log('  ├─────────────────────────────────────────────┤')
  console.log('  │  Series breakdown:                         │')

  for (const s of seriesResult) {
    const name = s.series.padEnd(42)
    console.log(\`  │    \${name} \${String(s.count).padStart(2)}          │\`)
  }

  console.log('  └─────────────────────────────────────────────┘')

  const errors: string[] = []

  if (total < 30) {
    errors.push(\`Expected ≥ 30 artworks, got \${total}\`)
  }

  if (featuredCount !== ${seedEntries.filter(e => e.is_featured).length}) {
    errors.push(\`Expected exactly ${seedEntries.filter(e => e.is_featured).length} featured artworks, got \${featuredCount}\`)
  }

  if (missingUrl !== 0) {
    errors.push('Expected 0 artworks missing URLs, got \${missingUrl}')
  }

  if (errors.length > 0) {
    console.error('\\n  ✗ Validation errors:')
    for (const err of errors) {
      console.error(\`    • \${err}\`)
    }
    process.exit(1)
  }

  console.log('\\n  ✓ All validations passed. Database seeded successfully.\\n')
}

seed()
`

writeFileSync(join(process.cwd(), 'server', 'seed.ts'), seedContent)

// Write fallback-data.ts
const fbEntries = fallbackEntries.map((e, i) => ({
  id: i + 1,
  ...e,
}))

let fbContent = `import type { Artwork } from '@/types'

export const FALLBACK_ARTWORKS: Artwork[] = [
`

fbEntries.forEach((e) => {
  fbContent += `  {
    id: ${e.id},
    title: ${JSON.stringify(e.title)},
    title_jp: '',
    series: '${e.series}' as const,
    series_number: ${e.series_number},
    year: ${e.year},
    description: ${JSON.stringify(e.description)},
    wikimedia_url: ${JSON.stringify(e.wikimedia_url)},
    wikimedia_thumb: ${JSON.stringify(e.wikimedia_thumb)},
    source_url: ${JSON.stringify(e.source_url)},
    attribution: ${JSON.stringify(e.attribution)},
    tags: ${JSON.stringify(e.tags)},
    is_featured: ${e.is_featured},
    display_order: ${e.display_order},
  },\n`
})

fbContent += `]
`

writeFileSync(join(process.cwd(), 'lib', 'fallback-data.ts'), fbContent)

console.log(`Generated seed.ts with ${seedEntries.length} entries`)
console.log(`Generated fallback-data.ts with ${fbEntries.length} entries`)

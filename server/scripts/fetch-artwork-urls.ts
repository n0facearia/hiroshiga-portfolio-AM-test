/**
 * Component: fetch-artwork-urls
 * What it does: Fetches Hiroshige artworks from Met Museum API using concurrent fetching,
 *   caches all candidates, then selects 36 entries with balanced series distribution:
 *   - Max 18 from Tōkaidō series
 *   - At least 9 from "One Hundred Famous Views of Edo" (or "Famous Places of Edo")
 *   - At least 9 from "Thirty-six Views of Mount Fuji" (Hiroshige + Hokusai)
 *     fallback to "Famous Views of the Sixty-odd Provinces" or "Eight Views of Ōmi"
 * Props: none (CLI script)
 * Renders: writes image-urls.json
 * Does NOT do: download images, seed database
 * Gotchas: Uses concurrent batches (5 at a time). Results cached to met-cache.json.
 *   Runs TWO searches: Hiroshige + "Thirty-six Views of Mount Fuji" (any artist)
 *   to fill Fuji quota. Pass --force to bypass cache.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1'
const OBJECT_URL = (id: number) => `${API_BASE}/objects/${id}`
const USER_AGENT = 'hiroshige-portfolio/1.0'
const OUT_PATH = join(process.cwd(), 'server', 'scripts', 'image-urls.json')
const CACHE_PATH = join(process.cwd(), 'server', 'scripts', 'met-cache.json')

const CONCURRENCY = 5
const TOTAL_TARGET = 36
const TOKAIDO_MAX = 18
const EDO_MIN = 9
const FUJI_MIN = 9

interface MetObject {
  objectID: number
  title: string
  primaryImage: string
  primaryImageSmall: string
  objectDate: string
  objectURL: string
  isPublicDomain: boolean
  classification: string
  department: string
}

interface OutputEntry {
  artworkId: string
  title: string
  fullUrl: string
  thumbUrl: string
  source_url: string
  year: number
}

type SeriesBucket =
  | 'tokaidō'
  | 'edo'
  | 'fuji'
  | 'sixty-provinces'
  | 'kisokaidō'
  | 'omi'
  | 'kyoto'
  | 'other'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/ō/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const KNOWN_YEARS: Record<number, number> = {
  // Gyōsho edition Tōkaidō (Met dates as "19th century", actually c. 1840)
  55685: 1840, 55679: 1840, 55680: 1840, 55681: 1840, 55682: 1840,
  55683: 1840, 55684: 1840, 55686: 1840, 55690: 1840, 55691: 1840,
  55692: 1840, 55693: 1840, 55694: 1840, 55695: 1840, 55696: 1840,
  55697: 1840, 55698: 1840, 55699: 1840, 55700: 1840, 55701: 1840,
  55702: 1840,
  // Original Hoeidō edition
  55995: 1834,
  55989: 1847, 55993: 1833,
  // Great Wave
  45434: 1831,
}

function extractYear(dateStr: string, objectID: number): number {
  if (KNOWN_YEARS[objectID]) return KNOWN_YEARS[objectID]

  const patterns = [
    /(\d{4})/,
    /(\d{4})–\d{2}/,
    /ca\.?\s*(\d{4})/i,
    /c\.?\s*(\d{4})/i,
    /(\d{4})\s*–/,
  ]

  for (const pattern of patterns) {
    const match = dateStr.match(pattern)
    if (match) {
      const year = parseInt(match[1], 10)
      if (year >= 1800 && year <= 1870) return year
    }
  }
  return 0
}

const EXCLUDE_TITLES = [
  'peacock', 'oriole', 'eagle', 'hawk', 'crane',
  'taira no', 'kiyomori', 'handaka', 'rakan',
  'otomo', 'kihan', 'kingfisher', 'pheasant',
  'mynah', 'parrot', 'sparrow', 'warbler',
  'chrysanthemum', 'peony', 'iris',
  'portrait of', 'kakemono',
  'mallard', 'reeds',
]

function classifySeries(title: string): SeriesBucket {
  const lower = title.toLowerCase()

  // Exclude non-landscape subjects
  if (EXCLUDE_TITLES.some((kw) => lower.includes(kw))) return 'other'

  // --- "One Hundred Famous Views of Edo" ---
  // Require explicit series name in the title
  if (
    lower.includes('one hundred famous views of edo') ||
    lower.includes('hundred famous views of edo') ||
    lower.includes('meisho edo hyakkei') ||
    lower.includes('famous views of edo')
  ) {
    return 'edo'
  }

  // --- "Thirty-six Views of Mount Fuji" ---
  if (
    lower.includes('thirty-six views of mount fuji') ||
    lower.includes('fugaku sanjūrokkei') ||
    lower.includes('fugaku sanju') ||
    lower.includes('36 views of mount fuji') ||
    (lower.includes('under the wave') && lower.includes('mount fuji'))
  ) {
    return 'fuji'
  }

  // --- "Famous Views of the Sixty-odd Provinces" ---
  if (
    lower.includes('sixty-odd provinces') ||
    lower.includes('sixty odd provinces') ||
    lower.includes('rokujū') ||
    lower.includes('roku-ju') ||
    lower.includes('roku ju') ||
    lower.includes('sixty-odd')
  ) {
    return 'sixty-provinces'
  }

  // --- Tōkaidō ---
  if (
    lower.includes('tōkaidō') ||
    lower.includes('tokaido') ||
    lower.includes('fifty-three stations') ||
    lower.includes('fifty three stations') ||
    lower.includes('gojūsan tsugi') ||
    lower.includes('gojusan tsugi') ||
    lower.includes('53 stations')
  ) {
    return 'tokaidō'
  }
  // Tōkaidō station names (common ones) — match whole words only
  const tokaidoStations = [
    'nihonbashi', 'shinagawa', 'kawasaki', 'kanagawa', 'hodogaya',
    'totsuka', 'fujisawa', 'hiratsuka', 'ōiso', 'oiso',
    'odawara', 'hakone', 'mishima', 'numazu', 'hara',
    'kanbara', 'yui', 'okitsu', 'ejiri', 'shimada', 'fujieda',
    'mariko', 'okabe', 'fujikawa', 'kanaya', 'nissaka',
    'kakegawa', 'fukuroi', 'mitsuke', 'hamamatsu', 'maisaka',
    'arai', 'shirasuka', 'futagawa', 'yoshida', 'goyu', 'akasaka',
    'okazaki', 'chiryū', 'chiryu', 'narumi', 'miya',
    'kuwana', 'yokkaichi', 'ishiyakushi', 'shōno', 'shono',
    'kameyama', 'seki', 'sakanoshita', 'tsuchiyama', 'minakuchi',
    'ishibe', 'kusatsu', 'ōtsu', 'otsu',
  ]
  
  // Exclude Edo location names that happen to contain station substrings
  const edoExclusions = ['shin yoshiwara', 'asakusa', 'ryōgoku', 'ryogoku']
  if (edoExclusions.some((s) => lower.includes(s))) {
    // Don't classify as Tōkaidō — these are Edo views
    return 'other'
  }
  
  const stationMatch = tokaidoStations.some((s) => {
    const idx = lower.indexOf(s)
    if (idx === -1) return false
    // Check word boundary: not preceded or followed by a letter
    const before = idx === 0 ? ' ' : lower[idx - 1]
    const after = idx + s.length >= lower.length ? ' ' : lower[idx + s.length]
    return !before.match(/[a-z\u00f4]/) && !after.match(/[a-z\u00f4]/)
  })
  if (stationMatch) {
    return 'tokaidō'
  }

  // --- "The Sixty-nine Stations of the Kisokaidō" ---
  if (
    lower.includes('kisokaidō') || lower.includes('kisokaido') ||
    lower.includes('kiso mountains') || lower.includes('kiso road') ||
    lower.includes('ki so') || lower.includes('sixty-nine stations')
  ) {
    return 'kisokaidō'
  }

  // --- "Eight Views of Ōmi" (Lake Biwa) ---
  if (
    lower.includes('lake biwa') || lower.includes('biwa') ||
    lower.includes('eight views of ōmi') || lower.includes('ōmi hakkei') ||
    lower.includes('omi hakkei') ||
    lower.includes('karasaki') || lower.includes('awazu') ||
    lower.includes('katada') || lower.includes('isebe') || lower.includes('sakamoto')
  ) {
    return 'omi'
  }

  // --- "Famous Places of Kyōto" ---
  if (
    lower.includes('famous places of kyōto') || lower.includes('famous places of kyoto') ||
    lower.includes('kyōto') || lower.includes('kyoto') || lower.includes('kiyomizu') ||
    lower.includes('arashiyama') || lower.includes('yase') || lower.includes('yodogawa')
  ) {
    return 'kyoto'
  }

  return 'other'
}

function classifySeriesLabel(bucket: SeriesBucket): string {
  switch (bucket) {
    case 'tokaidō': return 'Fifty-Three Stations of the Tōkaidō'
    case 'edo': return 'One Hundred Famous Views of Edo'
    case 'fuji': return 'Thirty-six Views of Mount Fuji'
    case 'sixty-provinces': return 'Famous Views of the Sixty-odd Provinces'
    case 'kisokaidō': return 'The Sixty-nine Stations of the Kisokaidō'
    case 'omi': return 'Eight Views of Ōmi'
    case 'kyoto': return 'Famous Places of Kyōto'
    case 'other': return 'Other'
  }
}

function cleanTitle(raw: string): string {
  let t = raw.replace(/\r/g, '').trim()
  t = t.replace(/\s*\([^)]{50,}\)\s*/g, '')
  t = t.replace(/\s+/g, ' ').trim()
  t = t.replace(/,\s*$/, '')
  return t.trim()
}

function dedupKey(title: string): string {
  let t = title.toLowerCase()
  t = t.replace(/\(.*?\)/g, '')
  t = t.replace(/from the\s+(series|set).*$/, '')
  t = t.replace(/\d{1,2}(st|nd|rd|th)\s+(station|view)/, '')
  t = t.replace(/number\s+\d+/, '')
  t = t.replace(/[^a-z0-9\s]/g, '')
  t = t.replace(/\s+/g, ' ').trim()
  return t
}

async function fetchObject(id: number, timeoutMs = 10000): Promise<MetObject | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const res = await fetch(OBJECT_URL(id), {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    if (!res.ok) return null

    const obj = (await res.json()) as MetObject

    if (!obj.isPublicDomain) return null
    if (!obj.primaryImage) return null

    const classification = (obj.classification || '').toLowerCase()
    const printKeywords = ['print', 'woodcut', 'woodblock', 'ukiyo-e', 'ukiyoe']
    const isPrint = printKeywords.some((kw) => classification.includes(kw))
    if (!isPrint) return null

    // Exclude non-landscape subjects at the object level
    const lower = obj.title.toLowerCase()
    if (EXCLUDE_TITLES.some((kw) => lower.includes(kw))) return null

    return obj
  } catch {
    return null
  }
}

async function runSearch(query: string): Promise<number[]> {
  const url = `${API_BASE}/search?q=${encodeURIComponent(query)}&hasImages=true`
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  })
  if (!res.ok) {
    console.error(`  Search failed for "${query}": ${res.status}`)
    return []
  }
  const data = (await res.json()) as { total: number; objectIDs: number[] }
  return data.objectIDs ?? []
}

async function fetchObjectsConcurrent(ids: number[], label: string): Promise<MetObject[]> {
  const results: MetObject[] = []

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const batch = ids.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.allSettled(
      batch.map((id) => fetchObject(id)),
    )

    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value)
      }
    }

    const pct = Math.round(((i + CONCURRENCY) / ids.length) * 100)
    process.stdout.write(`\r  [${label}] ${Math.min(i + CONCURRENCY, ids.length)}/${ids.length} (${Math.min(pct, 100)}%) — ${results.length} valid`)
  }

  process.stdout.write('\n')
  return results
}

/**
 * Select entries respecting series quotas.
 * Fills from fallback series if primary quotas aren't met.
 */
function selectByQuota(
  buckets: Record<SeriesBucket, MetObject[]>,
): MetObject[] {
  const selected: MetObject[] = []
  const targetSeries = ['edo', 'fuji', 'sixty-provinces', 'tokaidō'] as SeriesBucket[]

  // 1. Edo: pick up to EDO_MIN, but at least what we have
  const edoAvailable = buckets['edo'].length
  const edoTake = Math.min(edoAvailable, EDO_MIN)
  selected.push(...buckets['edo'].slice(0, edoTake))
  console.log(`    Edo: ${edoTake}/${edoAvailable} available`)

  // 2. Fuji: pick up to FUJI_MIN
  let fujiAvailable = buckets['fuji'].length
  let fujiTake = Math.min(fujiAvailable, FUJI_MIN)
  selected.push(...buckets['fuji'].slice(0, fujiTake))
  console.log(`    Fuji: ${fujiTake}/${fujiAvailable} available`)

  // 3. If Fuji shortfall, try Sixty-Provinces
  const fujiShortfall = FUJI_MIN - fujiTake
  if (fujiShortfall > 0) {
    const provTake = Math.min(buckets['sixty-provinces'].length, fujiShortfall)
    selected.push(...buckets['sixty-provinces'].slice(0, provTake))
    console.log(`    Sixty-Provinces: ${provTake} (filling Fuji quota)`)
    fujiTake += provTake
  }

  // 4. If still short, try Kisokaidō and Ōmi as supplementary
  if (fujiTake < FUJI_MIN) {
    const remaining = FUJI_MIN - fujiTake
    const supplement = [
      ...buckets['kisokaidō'].map((o) => ({ obj: o, src: 'Kisokaidō' as const })),
      ...buckets['omi'].map((o) => ({ obj: o, src: 'Ōmi' as const })),
    ]
    const fill = supplement.slice(0, remaining)
    for (const f of fill) {
      selected.push(f.obj)
      console.log(`    ${f.src}: 1 (filling Fuji quota)`)
    }
    fujiTake += fill.length
  }

  // If STILL short (somehow), just note it
  if (fujiTake < FUJI_MIN) {
    console.log(`    (Fuji quota: only got ${fujiTake}, max available)`)
  }

  // 5. Tōkaidō: pick up to TOKAIDO_MAX, limited by remaining slots
  const remainingAfterSeries = TOTAL_TARGET - selected.length
  const tokaidōTake = Math.min(buckets['tokaidō'].length, TOKAIDO_MAX, remainingAfterSeries)
  selected.push(...buckets['tokaidō'].slice(0, tokaidōTake))
  console.log(`    Tōkaidō: ${tokaidōTake}/${buckets['tokaidō'].length} available`)

  // 6. Fill remaining slots from Kyōto, Ōmi, Kisokaidō, Other (in that order)
  const fillOrder: SeriesBucket[] = ['kyoto', 'omi', 'kisokaidō', 'other']
  let filled = selected.length
  for (const bucket of fillOrder) {
    const needed = TOTAL_TARGET - filled
    if (needed <= 0) break
    const take = Math.min(buckets[bucket].length, needed)
    selected.push(...buckets[bucket].slice(0, take))
    filled += take
    if (take > 0) {
      console.log(`    ${classifySeriesLabel(bucket)}: ${take} (filler)`)
    }
  }

  return selected
}

async function main() {
  const forceFetch = process.argv.includes('--force')

  console.log()
  console.log('  ┌─────────────────────────────────────────────┐')
  console.log('  │  Met Museum Hiroshige Artwork Fetcher       │')
  console.log('  │  Concurrent batches (5x) for speed          │')
  console.log('  │  Quotas: 18 Tōkaidō, 9 Edo, 9 Fuji         │')
  console.log('  │  Fallback: Ōmi, Kyōto, Kisokaidō            │')
  console.log('  └─────────────────────────────────────────────┘\n')

  // ── Step 1: Gather candidates ─────────────────────────

  let allCandidates: MetObject[] = []

  if (!forceFetch && existsSync(CACHE_PATH)) {
    console.log('  ℹ  Using cached data (met-cache.json). Pass --force to re-fetch.\n')
    allCandidates = JSON.parse(readFileSync(CACHE_PATH, 'utf-8')) as MetObject[]
  } else {
    if (forceFetch) console.log('  --force: bypassing cache.\n')

    // Run two searches in parallel
    console.log('  Searching Met Museum...')
    const [hiroshigeIds, fujiIds] = await Promise.all([
      runSearch('Hiroshige'),
      runSearch('"Thirty-six Views of Mount Fuji"'),
    ])

    const allIds = Array.from(new Set([...hiroshigeIds, ...fujiIds]))
    console.log(`  Hiroshige search: ${hiroshigeIds.length} results`)
    console.log(`  Fuji search: ${fujiIds.length} results`)
    console.log(`  Combined unique: ${allIds.length}\n`)

    if (allIds.length === 0) {
      throw new Error('No search results returned from Met API')
    }

    console.log(`  Fetching objects concurrently (${CONCURRENCY} at a time)...\n`)
    const hiroshigeResults = await fetchObjectsConcurrent(hiroshigeIds, 'Hiroshige')

    // Only fetch Fuji-specific IDs that weren't in the Hiroshige results
    const fujiOnlyIds = fujiIds.filter(
      (id) => !hiroshigeIds.includes(id),
    )
    let fujiResults: MetObject[] = []
    if (fujiOnlyIds.length > 0) {
      console.log('')
      fujiResults = await fetchObjectsConcurrent(fujiOnlyIds, 'Fuji series')
    }

    allCandidates = [...hiroshigeResults, ...fujiResults]

    // Save to cache
    writeFileSync(CACHE_PATH, JSON.stringify(allCandidates, null, 2) + '\n')
    console.log(`\n  ✓ Cached ${allCandidates.length} candidates to met-cache.json\n`)
  }

  console.log(`  Total valid candidates: ${allCandidates.length}\n`)

  // ── Step 2: Deduplicate ─────────────────────────────

  const seen = new Set<string>()
  const deduped: MetObject[] = []
  for (const c of allCandidates) {
    const key = dedupKey(c.title)
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(c)
  }
  console.log(`  Unique titles after dedup: ${deduped.length}\n`)

  // ── Step 3: Classify into series buckets ─────────────

  const buckets: Record<SeriesBucket, MetObject[]> = {
    'tokaidō': [],
    'edo': [],
    'fuji': [],
    'sixty-provinces': [],
    'kisokaidō': [],
    'omi': [],
    'kyoto': [],
    'other': [],
  }

  for (const c of deduped) {
    const bucket = classifySeries(c.title)
    buckets[bucket].push(c)
  }

  // Sort within each bucket: prefer known years
  const sortByYear = (a: MetObject, b: MetObject): number => {
    const ya = extractYear(a.objectDate, a.objectID)
    const yb = extractYear(b.objectDate, b.objectID)
    if (ya && !yb) return -1
    if (!ya && yb) return 1
    return (ya || 9999) - (yb || 9999)
  }

  console.log('  Series classification:')
  for (const key of Object.keys(buckets) as SeriesBucket[]) {
    const label = classifySeriesLabel(key)
    buckets[key].sort(sortByYear)
    console.log(`    ${label.padEnd(45)} ${String(buckets[key].length).padStart(3)}`)
  }
  console.log('')

  // ── Step 4: Select by quota ─────────────────────────

  console.log('  Selecting by quota:\n')
  const selected = selectByQuota(buckets)

  const finalSelection = selected.slice(0, TOTAL_TARGET)
  console.log(`\n  Final selection: ${finalSelection.length} artworks\n`)

  // ── Step 5: Build output ────────────────────────────

  const output: OutputEntry[] = finalSelection.map((obj) => ({
    artworkId: slugify(obj.title),
    title: cleanTitle(obj.title),
    fullUrl: obj.primaryImage,
    thumbUrl: obj.primaryImageSmall || obj.primaryImage,
    source_url: obj.objectURL,
    year: extractYear(obj.objectDate, obj.objectID),
  }))

  writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + '\n')

  console.log(`  ─────────────────────────────────────────────`)
  console.log(`    Total candidates:  ${allCandidates.length}`)
  console.log(`    After dedup:       ${deduped.length}`)
  console.log(`    Selected:          ${output.length}`)
  console.log(`    Written to:        image-urls.json`)
  console.log(`  ─────────────────────────────────────────────\n`)

  // ── Step 6: Print series breakdown ──────────────────

  const seriesCounts: Record<string, number> = {}
  for (const o of output) {
    const bucket = classifySeries(o.title)
    const label = classifySeriesLabel(bucket)
    seriesCounts[label] = (seriesCounts[label] || 0) + 1
  }

  console.log('  Series breakdown:')
  for (const [label, count] of Object.entries(seriesCounts)) {
    console.log(`    ${count.toString().padStart(2)}  ${label}`)
  }
  console.log('')

  console.log('  Selected titles:\n')
  output.forEach((o, i) => {
    const yearStr = o.year > 0 ? String(o.year) : 'unknown'
    const bucket = classifySeries(o.title)
    const tag = bucket.slice(0, 3).toUpperCase()
    console.log(`    ${String(i + 1).padStart(2)}. [${tag}] ${o.title} (${yearStr})`)
  })
  console.log('')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

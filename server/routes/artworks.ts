import { Router } from 'express'
import db from '../db'

interface DbArtworkRow {
  id: number
  title: string
  title_jp: string | null
  series: string
  year: number | null
  era: string | null
  wikimedia_url: string
  thumbnail_url: string
  description: string | null
  source_url: string | null
  attribution: string | null
  is_featured: number
  created_at: string
}

// Maps a lowercase, normalized series string to the exact DB value.
// Used by both ?series= and /series/:seriesName lookups.
const SERIES_NORMALIZE: Record<string, string> = {
  'fifty-three stations of the tōkaidō': 'Fifty-Three Stations of the Tōkaidō',
  'one hundred famous views of edo': 'One Hundred Famous Views of Edo',
  'eight views of ōmi': 'Eight Views of Ōmi',
  'famous places of kyōto': 'Famous Places of Kyōto',
  'thirty-six views of mount fuji': 'Thirty-six Views of Mount Fuji',
  'the sixty-nine stations of the kisokaidō': 'The Sixty-nine Stations of the Kisokaidō',
}

// Also accept ASCII-only versions of series names for convenience
const ASCII_ALIASES: Record<string, string> = {
  'fifty-three stations of the tokaido': 'Fifty-Three Stations of the Tōkaidō',
  'one hundred famous views of edo': 'One Hundred Famous Views of Edo',
  'eight views of omi': 'Eight Views of Ōmi',
  'famous places of kyoto': 'Famous Places of Kyōto',
  'thirty-six views of mount fuji': 'Thirty-six Views of Mount Fuji',
  'the sixty-nine stations of the kisokaido': 'The Sixty-nine Stations of the Kisokaidō',
}

function normalizeSeries(input: string): string | undefined {
  const lower = input.toLowerCase().trim()
  return SERIES_NORMALIZE[lower] ?? ASCII_ALIASES[lower]
}

function toArtworkResponse(row: DbArtworkRow) {
  return {
    id: row.id,
    title: row.title,
    title_jp: row.title_jp ?? undefined,
    series: row.series,
    series_number: 0,
    year: row.year ?? 0,
    description: row.description ?? '',
    wikimedia_url: row.wikimedia_url,
    wikimedia_thumb: row.thumbnail_url,
    source_url: row.source_url ?? undefined,
    attribution: row.attribution ?? undefined,
    tags: '',
    is_featured: row.is_featured === 1,
    display_order: row.is_featured === 1 ? row.id : 99,
  }
}

const router = Router()

// GET /api/artworks — list all artworks, with optional filtering
//   ?featured=true  — only featured artworks
//   ?series=<name>  — filter by series (lowercase, ASCII, or exact DB name)
router.get('/', (_req, res) => {
  try {
    const { featured, series } = _req.query as {
      featured?: string
      series?: string
    }

    let sql = 'SELECT * FROM artworks'
    const params: unknown[] = []
    const conditions: string[] = []

    if (featured === 'true') {
      conditions.push('is_featured = 1')
    }

    if (series && typeof series === 'string') {
      const fullSeries = normalizeSeries(series)
      // If the series name doesn't match any known series, still try exact-match
      // so that ?series=Thirty-six+Views+of+Mount+Fuji works too
      if (fullSeries) {
        conditions.push('series = ?')
        params.push(fullSeries)
      } else {
        // Accept the raw value as a direct series filter
        conditions.push('series = ?')
        params.push(series.trim())
      }
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    sql += ' ORDER BY id ASC'

    const rows = db.prepare(sql).all(...params) as DbArtworkRow[]
    const artworks = rows.map(toArtworkResponse)

    res.set('Cache-Control', 'public, max-age=3600')
    res.json({ artworks })
  } catch (err) {
    console.error('Error fetching artworks:', err)
    res.status(500).json({ error: 'Failed to fetch artworks' })
  }
})

// GET /api/artworks/series — list all distinct series
router.get('/series', (_req, res) => {
  try {
    const rows = db.prepare(
      'SELECT DISTINCT series FROM artworks ORDER BY series ASC'
    ).all() as { series: string }[]

    const seriesList = rows.map((r) => r.series)

    res.set('Cache-Control', 'public, max-age=3600')
    res.json({ series: seriesList })
  } catch (err) {
    console.error('Error fetching series list:', err)
    res.status(500).json({ error: 'Failed to fetch series' })
  }
})

// GET /api/artworks/series/:seriesName — filter artworks by series
router.get('/series/:seriesName', (req, res) => {
  try {
    const seriesName = decodeURIComponent(req.params.seriesName)
    const fullSeries = normalizeSeries(seriesName) ?? seriesName

    const rows = db.prepare(
      'SELECT * FROM artworks WHERE series = ? ORDER BY id ASC'
    ).all(fullSeries) as DbArtworkRow[]

    const artworks = rows.map(toArtworkResponse)

    res.set('Cache-Control', 'public, max-age=3600')
    res.json({ artworks })
  } catch (err) {
    console.error('Error fetching artworks by series:', err)
    res.status(500).json({ error: 'Failed to fetch artworks by series' })
  }
})

// GET /api/artworks/:id — single artwork by ID
// NOTE: This must be defined LAST so it doesn't intercept /series
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid artwork ID' })
      return
    }

    const row = db.prepare('SELECT * FROM artworks WHERE id = ?').get(id) as
      | DbArtworkRow
      | undefined

    if (!row) {
      res.status(404).json({ error: 'Artwork not found' })
      return
    }

    res.set('Cache-Control', 'public, max-age=3600')
    res.json(toArtworkResponse(row))
  } catch (err) {
    console.error('Error fetching artwork:', err)
    res.status(500).json({ error: 'Failed to fetch artwork' })
  }
})

export default router

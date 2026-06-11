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
  is_featured: number
  created_at: string
}

const SERIES_MAP: Record<string, string> = {
  'One Hundred Famous Views of Edo': 'Edo',
  'Fifty-Three Stations of the Tōkaidō': 'Tōkaidō',
  'Famous Views of the Sixty-odd Provinces': 'Other',
}

function mapSeries(series: string): string {
  return SERIES_MAP[series] ?? 'Other'
}

function toArtworkResponse(row: DbArtworkRow) {
  const isLocal = row.wikimedia_url.startsWith('/artworks/')
  return {
    id: row.id,
    title: row.title,
    title_jp: row.title_jp ?? undefined,
    series: mapSeries(row.series),
    series_number: 0,
    year: row.year ?? 0,
    description: row.description ?? '',
    wikimedia_url: row.wikimedia_url,
    wikimedia_thumb: isLocal ? row.wikimedia_url : row.thumbnail_url,
    tags: '',
    is_featured: row.is_featured === 1,
    display_order: row.is_featured === 1 ? row.id : 99,
  }
}

const router = Router()

// GET /api/artworks — list all artworks, with optional filtering
//   ?featured=true  — only featured artworks
//   ?series=Tōkaidō — filter by series short code
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
      const reverseMap: Record<string, string> = {
        'edo': 'One Hundred Famous Views of Edo',
        'tōkaidō': 'Fifty-Three Stations of the Tōkaidō',
        'tokaidō': 'Fifty-Three Stations of the Tōkaidō',
        'other': 'Famous Views of the Sixty-odd Provinces',
      }
      const fullSeries = reverseMap[series.toLowerCase()]
      if (fullSeries) {
        conditions.push('series = ?')
        params.push(fullSeries)
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

// GET /api/artworks/:id — single artwork by ID
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

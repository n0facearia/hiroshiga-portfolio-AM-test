import { describe, it, expect, beforeAll, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'

// ─── Mock the db module BEFORE any imports that use it ─────────────
// Vitest hoists vi.mock() to the top. The factory uses require() for
// test-helpers.js (plain JS) and better-sqlite3 (native module) — both
// resolve correctly without TypeScript transform.

vi.mock('../db', () => {
  const { createInMemoryDb, seedArtworks } = require('./test-helpers')

  const testDb = createInMemoryDb()
  seedArtworks(testDb)

  return { default: testDb }
})

// Now import modules that depend on the mock
const { default: artworksRouter } = await import('../routes/artworks')

// ─── Build a test app with the artwork routes ──────────────────────

const app = express()
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())
app.use('/api/artworks', artworksRouter)

// ─── Tests ─────────────────────────────────────────────────────────

describe('GET /api/artworks', () => {
  it('returns 200 with { artworks: [] } shape', async () => {
    const res = await request(app).get('/api/artworks')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('artworks')
    expect(Array.isArray(res.body.artworks)).toBe(true)
  })

  it('returns artwork objects with correct type shape', async () => {
    const res = await request(app).get('/api/artworks')

    const artwork = res.body.artworks[0]
    expect(artwork).toHaveProperty('id')
    expect(artwork).toHaveProperty('title')
    expect(artwork).toHaveProperty('series')
    expect(artwork).toHaveProperty('year')
    expect(artwork).toHaveProperty('wikimedia_url')
    expect(artwork).toHaveProperty('wikimedia_thumb')
    expect(artwork).toHaveProperty('is_featured')
    expect(artwork).toHaveProperty('display_order')
  })

  it('returns series names from the database unchanged', async () => {
    const res = await request(app).get('/api/artworks')

    const seriesSet = new Set(res.body.artworks.map((a: { series: string }) => a.series))
    // All returned series should be one of the known DB values
    const knownSeries = [
      'One Hundred Famous Views of Edo',
      'Fifty-Three Stations of the Tōkaidō',
      'Famous Views of the Sixty-odd Provinces',
    ]
    for (const s of seriesSet) {
      expect(knownSeries).toContain(s)
    }
  })

  it('converts is_featured from integer to boolean', async () => {
    const res = await request(app).get('/api/artworks')

    for (const artwork of res.body.artworks) {
      expect(typeof artwork.is_featured).toBe('boolean')
    }
  })

  it('includes Cache-Control header', async () => {
    const res = await request(app).get('/api/artworks')

    expect(res.headers['cache-control']).toBe('public, max-age=3600')
  })
})

describe('GET /api/artworks?featured=true', () => {
  it('returns exactly 10 artworks', async () => {
    const res = await request(app).get('/api/artworks?featured=true')

    expect(res.status).toBe(200)
    expect(res.body.artworks).toHaveLength(10)
  })

  it('all returned artworks have is_featured = true', async () => {
    const res = await request(app).get('/api/artworks?featured=true')

    for (const artwork of res.body.artworks) {
      expect(artwork.is_featured).toBe(true)
    }
  })
})

describe('GET /api/artworks?series=', () => {
  it('filters by full series name (Fifty-Three Stations of the Tōkaidō)', async () => {
    const res = await request(app).get(
      '/api/artworks?series=Fifty-Three Stations of the Tōkaidō'
    )

    expect(res.status).toBe(200)
    for (const artwork of res.body.artworks) {
      expect(artwork.series).toBe('Fifty-Three Stations of the Tōkaidō')
    }
  })

  it('filters by full series name (One Hundred Famous Views of Edo)', async () => {
    const res = await request(app).get(
      '/api/artworks?series=One Hundred Famous Views of Edo'
    )

    expect(res.status).toBe(200)
    for (const artwork of res.body.artworks) {
      expect(artwork.series).toBe('One Hundred Famous Views of Edo')
    }
  })

  it('handles URL-encoded Unicode characters in series filter (Tōkaidō)', async () => {
    const res = await request(app).get(
      '/api/artworks?series=Fifty-Three+Stations+of+the+T%C5%8Dkaid%C5%8D'
    )

    expect(res.status).toBe(200)
    expect(res.body.artworks.length).toBeGreaterThan(0)
    for (const artwork of res.body.artworks) {
      expect(artwork.series).toBe('Fifty-Three Stations of the Tōkaidō')
    }
  })

  it('returns empty array when series filter matches no known series', async () => {
    const res = await request(app).get('/api/artworks?series=Unknown')

    expect(res.status).toBe(200)
    expect(res.body.artworks).toEqual([])
  })
})

describe('GET /api/artworks/series', () => {
  it('returns distinct series list', async () => {
    const res = await request(app).get('/api/artworks/series')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('series')
    expect(Array.isArray(res.body.series)).toBe(true)
    expect(res.body.series.length).toBeGreaterThanOrEqual(3)
  })
})

describe('GET /api/artworks/series/:seriesName', () => {
  it('filters by series name in path param', async () => {
    const res = await request(app).get(
      '/api/artworks/series/Fifty-Three Stations of the Tōkaidō'
    )

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('artworks')
    expect(res.body.artworks.length).toBeGreaterThan(0)
    for (const artwork of res.body.artworks) {
      expect(artwork.series).toBe('Fifty-Three Stations of the Tōkaidō')
    }
  })

  it('filters by URL-encoded series name with Unicode (Tōkaidō)', async () => {
    const res = await request(app).get(
      '/api/artworks/series/Fifty-Three%20Stations%20of%20the%20T%C5%8Dkaid%C5%8D'
    )

    expect(res.status).toBe(200)
    expect(res.body.artworks.length).toBeGreaterThan(0)
    for (const artwork of res.body.artworks) {
      expect(artwork.series).toBe('Fifty-Three Stations of the Tōkaidō')
    }
  })
})

describe('GET /api/artworks/:id', () => {
  it('returns 200 for a valid existing id', async () => {
    const res = await request(app).get('/api/artworks/1')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', 1)
    expect(res.body).toHaveProperty('title')
  })

  it('returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/api/artworks/9999')

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error', 'Artwork not found')
  })

  it('returns 400 for a non-integer id', async () => {
    const res = await request(app).get('/api/artworks/banana')

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'Invalid artwork ID')
  })

  it('includes Cache-Control header', async () => {
    const res = await request(app).get('/api/artworks/1')

    expect(res.headers['cache-control']).toBe('public, max-age=3600')
  })
})

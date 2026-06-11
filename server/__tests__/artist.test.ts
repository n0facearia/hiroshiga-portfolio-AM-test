import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'

import artistRouter from '../routes/artist'

const app = express()
app.use(cors({ origin: 'http://localhost:3000' }))
app.use('/api/artist', artistRouter)

describe('GET /api/artist', () => {
  it('returns 200 with artist info shape', async () => {
    const res = await request(app).get('/api/artist')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('name')
    expect(res.body).toHaveProperty('bio')
    expect(res.body).toHaveProperty('birth_year')
    expect(res.body).toHaveProperty('death_year')
    expect(res.body).toHaveProperty('timeline')
  })

  it('returns correct name and birth/death years', async () => {
    const res = await request(app).get('/api/artist')

    expect(res.body.name).toBe('Utagawa Hiroshige')
    expect(res.body.birth_year).toBe(1797)
    expect(res.body.death_year).toBe(1858)
  })

  it('returns timeline as an array of events', async () => {
    const res = await request(app).get('/api/artist')

    expect(Array.isArray(res.body.timeline)).toBe(true)
    expect(res.body.timeline.length).toBeGreaterThan(0)

    for (const event of res.body.timeline) {
      expect(event).toHaveProperty('year')
      expect(event).toHaveProperty('event')
    }
  })

  it('includes Cache-Control header', async () => {
    const res = await request(app).get('/api/artist')

    expect(res.headers['cache-control']).toBe('public, max-age=3600')
  })
})

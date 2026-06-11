import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import type Database from 'better-sqlite3'

// ─── Mock the db module BEFORE any imports that use it ─────────────
// The factory uses require() for test-helpers.js (plain JS) to avoid
// TypeScript module resolution issues inside vi.mock callbacks.

vi.mock('../db', () => {
  const { createInMemoryDb } = require('./test-helpers')

  const testDb = createInMemoryDb()

  return { default: testDb }
})

// Now import modules that depend on the mock
const { default: contactRouter } = await import('../routes/contact')

let testApp: express.Express
let db: Database.Database

beforeAll(async () => {
  testApp = express()
  testApp.use(cors({ origin: 'http://localhost:3000' }))
  testApp.use(express.json())
  testApp.use('/api/contact', contactRouter)

  // Get a reference to the test database from the mocked module
  const dbModule = (await import('../db')) as { default: Database.Database }
  db = dbModule.default
})

afterAll(() => {
  if (db) db.close()
})

describe('POST /api/contact', () => {
  it('returns 200 with valid name, email, message', async () => {
    const res = await request(testApp)
      .post('/api/contact')
      .send({ name: 'Test User', email: 'test@example.com', message: 'This is a valid test message' })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ success: true })
  })

  it('saves the message to the database', async () => {
    const beforeCount = (
      db.prepare('SELECT COUNT(*) AS count FROM contact_messages').get() as { count: number }
    ).count

    await request(testApp)
      .post('/api/contact')
      .send({
        name: 'DB Check',
        email: 'dbcheck@example.com',
        message: 'Verify this message was saved in the database',
      })

    const afterCount = (
      db.prepare('SELECT COUNT(*) AS count FROM contact_messages').get() as { count: number }
    ).count
    expect(afterCount).toBe(beforeCount + 1)

    // Verify the actual row content
    const row = db
      .prepare('SELECT name, email, message FROM contact_messages WHERE email = ?')
      .get('dbcheck@example.com') as { name: string; email: string; message: string }

    expect(row.name).toBe('DB Check')
    expect(row.message).toContain('Verify this message')
  })

  it('returns 400 when name is missing', async () => {
    const res = await request(testApp)
      .post('/api/contact')
      .send({ email: 'test@example.com', message: 'This is a valid message' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toContain('Name')
  })

  it('returns 400 when email is missing', async () => {
    const res = await request(testApp)
      .post('/api/contact')
      .send({ name: 'Test User', message: 'This is a valid message' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toContain('email')
  })

  it('returns 400 when email has invalid format', async () => {
    const res = await request(testApp)
      .post('/api/contact')
      .send({ name: 'Test User', email: 'not-an-email', message: 'This is a valid message' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toContain('email')
  })

  it('returns 400 when message is missing', async () => {
    const res = await request(testApp)
      .post('/api/contact')
      .send({ name: 'Test User', email: 'test@example.com' })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toContain('Message')
  })

  it('returns 400 when name is empty string', async () => {
    const res = await request(testApp)
      .post('/api/contact')
      .send({ name: '', email: 'test@example.com', message: 'This is a valid message' })

    expect(res.status).toBe(400)
    expect(res.body.error).toContain('Name')
  })

  it('returns 400 when message is empty string', async () => {
    const res = await request(testApp)
      .post('/api/contact')
      .send({ name: 'Test User', email: 'test@example.com', message: '' })

    expect(res.status).toBe(400)
    expect(res.body.error).toContain('Message')
  })

  it('accepts a very long message', async () => {
    const longMessage = 'A'.repeat(5000)
    const res = await request(testApp)
      .post('/api/contact')
      .send({ name: 'Test User', email: 'test@example.com', message: longMessage })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ success: true })
  })
})

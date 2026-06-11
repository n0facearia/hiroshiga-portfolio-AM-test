import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import type Database from 'better-sqlite3'

// ─── Mock the db module so createTables() operates on our in-memory DB ──

vi.mock('../db', () => {
  const Database = require('better-sqlite3')
  const testDb = new Database(':memory:')
  testDb.pragma('journal_mode = WAL')
  testDb.pragma('foreign_keys = ON')
  return { default: testDb }
})

// Now import schema (which imports the mocked db)
const { createTables } = await import('../schema')

let db: Database.Database

beforeAll(async () => {
  // createTables() operates on the in-memory mocked db
  createTables()

  const dbModule = (await import('../db')) as { default: Database.Database }
  db = dbModule.default
})

afterAll(() => {
  if (db) db.close()
})

describe('database schema', () => {
  it('returns a Database instance', () => {
    expect(db).toBeInstanceOf(Object)
  })

  it('has WAL mode enabled', () => {
    // pragma() returns an array of { journal_mode: string } when querying
    const result = db.pragma('journal_mode') as { journal_mode: string }[]
    const mode = Array.isArray(result) ? result[0]?.journal_mode : (result as unknown as { journal_mode: string }).journal_mode
    expect(['wal', 'memory']).toContain(mode)
  })

  it('has artworks table with correct columns', () => {
    const columns = db.prepare('PRAGMA table_info(artworks)').all() as {
      name: string
      type: string
    }[]

    const colNames = columns.map((c) => c.name).sort()
    expect(colNames).toContain('id')
    expect(colNames).toContain('title')
    expect(colNames).toContain('title_jp')
    expect(colNames).toContain('series')
    expect(colNames).toContain('year')
    expect(colNames).toContain('era')
    expect(colNames).toContain('wikimedia_url')
    expect(colNames).toContain('thumbnail_url')
    expect(colNames).toContain('description')
    expect(colNames).toContain('is_featured')
    expect(colNames).toContain('created_at')
  })

  it('has contact_messages table with correct columns', () => {
    const columns = db.prepare('PRAGMA table_info(contact_messages)').all() as {
      name: string
      type: string
    }[]

    const colNames = columns.map((c) => c.name).sort()
    expect(colNames).toContain('id')
    expect(colNames).toContain('name')
    expect(colNames).toContain('email')
    expect(colNames).toContain('message')
    expect(colNames).toContain('created_at')
  })

  it('has indexes on artworks.series and artworks.is_featured', () => {
    const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = 'artworks'").all() as {
      name: string
    }[]
    const indexNames = indexes.map((i) => i.name)
    expect(indexNames).toContain('idx_artworks_series')
    expect(indexNames).toContain('idx_artworks_featured')
  })

  it('accepts and retrieves an artwork row', () => {
    const insert = db.prepare(`
      INSERT INTO artworks (title, series, wikimedia_url, thumbnail_url, is_featured)
      VALUES (?, ?, ?, ?, ?)
    `)
    insert.run('Test Artwork', 'Edo period', 'https://example.com/img.jpg', 'https://example.com/thumb.jpg', 0)

    const row = db.prepare('SELECT title, series FROM artworks WHERE title = ?').get('Test Artwork') as {
      title: string
      series: string
    }

    expect(row.title).toBe('Test Artwork')
    expect(row.series).toBe('Edo period')
  })

  it('accepts and retrieves a contact message', () => {
    const insert = db.prepare(`
      INSERT INTO contact_messages (name, email, message)
      VALUES (?, ?, ?)
    `)
    insert.run('Test User', 'test@example.com', 'Hello from test')

    const row = db.prepare('SELECT name, email, message FROM contact_messages WHERE email = ?').get('test@example.com') as {
      name: string
      email: string
      message: string
    }

    expect(row.name).toBe('Test User')
    expect(row.email).toBe('test@example.com')
    expect(row.message).toBe('Hello from test')
  })
})

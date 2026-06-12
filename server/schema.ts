import db from './db'

/**
 * Creates all database tables if they don't exist.
 * Called once on server startup before routes are registered.
 * Idempotent — safe to call multiple times (uses IF NOT EXISTS).
 */
export function createTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS artworks (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      title           TEXT NOT NULL,
      title_jp        TEXT,
      series          TEXT NOT NULL,
      year            INTEGER,
      era             TEXT,
      wikimedia_url   TEXT NOT NULL,
      thumbnail_url   TEXT NOT NULL,
      description     TEXT,
      source_url      TEXT,
      attribution     TEXT,
      is_featured     INTEGER NOT NULL DEFAULT 0,
      created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Index for filtering gallery by series (e.g. ?series=Edo)
    CREATE INDEX IF NOT EXISTS idx_artworks_series ON artworks(series);

    -- Partial index for the 10 featured homepage artworks — only indexes rows WHERE is_featured = 1
    -- This keeps the index small and the homepage query fast
    CREATE INDEX IF NOT EXISTS idx_artworks_featured ON artworks(is_featured)
      WHERE is_featured = 1;

    -- contact_messages: stores form submissions from the portfolio contact page
    -- No foreign keys — these are standalone submissions, not linked to user accounts
    CREATE TABLE IF NOT EXISTS contact_messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      -- name: sender's name, required by the contact form validation
      name        TEXT NOT NULL,
      -- email: sender's email, required and validated with regex before insert
      email       TEXT NOT NULL,
      -- message: the contact message body, required with minimum length validation
      message     TEXT NOT NULL,
      -- created_at: ISO-8601 timestamp, indexed below for chronological sorting in admin view
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Index for sorting contact messages by date (newest first)
    CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
      ON contact_messages(created_at);
  `)

  // Migrations for columns added after initial schema
  for (const col of ['source_url', 'attribution']) {
    try {
      db.exec(`ALTER TABLE artworks ADD COLUMN ${col} TEXT`)
    } catch {
      // Column already exists
    }
  }
}

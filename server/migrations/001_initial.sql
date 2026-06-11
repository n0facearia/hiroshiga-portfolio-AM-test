-- Migration 001: Create artworks and contact_messages tables
-- Why: Core domain entities for the Hiroshige woodblock print portfolio.
--       artworks stores the catalog of 30+ prints with Wikimedia Commons image URLs.
--       contact_messages stores form submissions from the contact page.
-- Down migration:
--   DROP TABLE IF EXISTS contact_messages;
--   DROP TABLE IF EXISTS artworks;

BEGIN TRANSACTION;

-- ─── artworks ──────────────────────────────────────────────────────
-- Stores each woodblock print by Utagawa Hiroshige.
-- Images served from Wikimedia Commons URLs (public domain, no API key).
CREATE TABLE IF NOT EXISTS artworks (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  -- English title of the print, used for display and SEO
  title            TEXT NOT NULL,
  -- Japanese kanji/kana title; nullable because not all prints have verified JP titles
  title_jp         TEXT,
  -- Exact series name for gallery filtering and grouping
  series           TEXT NOT NULL,
  -- Publication year, used for chronology and timeline display
  year             INTEGER,
  -- Japanese historical era (e.g. 'Edo period'), provides historical context
  era              TEXT,
  -- Full-resolution image URL from Wikimedia Commons, used in lightbox/detail views
  wikimedia_url    TEXT NOT NULL,
  -- 400px-wide thumbnail URL from Wikimedia Commons, used in gallery grid cards
  thumbnail_url    TEXT NOT NULL,
  -- 2-3 sentence description of scene, artistic technique, and historical context
  description      TEXT,
  -- 1 = featured on homepage hero; 0 = gallery only. Partial index below optimizes homepage query.
  is_featured      INTEGER NOT NULL DEFAULT 0,
  -- ISO-8601 timestamp of row insertion, used for ordering and admin views
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index for filtering gallery by series (e.g. filtering by 'One Hundred Famous Views of Edo')
CREATE INDEX IF NOT EXISTS idx_artworks_series ON artworks(series);

-- Partial index for the 10 featured homepage artworks
-- Indexes only rows WHERE is_featured = 1, keeping the index small and the SELECT fast
CREATE INDEX IF NOT EXISTS idx_artworks_featured ON artworks(is_featured)
  WHERE is_featured = 1;

-- ─── contact_messages ─────────────────────────────────────────────
-- Stores messages submitted through the portfolio contact form.
-- Standalone table — no foreign keys, messages are not linked to user accounts.
CREATE TABLE IF NOT EXISTS contact_messages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Sender's name, required and validated server-side
  name         TEXT NOT NULL,
  -- Sender's email, validated via regex before insert
  email        TEXT NOT NULL,
  -- Message body, required with minimum length validation
  message      TEXT NOT NULL,
  -- ISO-8601 timestamp, indexed below for chronological sort in admin view
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index for sorting contact messages by date (newest first in admin UI)
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON contact_messages(created_at);

COMMIT;

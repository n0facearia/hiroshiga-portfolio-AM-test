# Hiroshige Portfolio — Database Architecture

> Database mode specification. Defines schema, migrations, indexing, and seed strategy for the SQLite data layer.

---

## 1. Entity List

| Entity | Table | Description |
|---|---|---|
| Artwork | `artworks` | A single woodblock print by Utagawa Hiroshige. Belongs to a series. Has a Wikimedia Commons URL for the image. |
| Contact Message | `contact_messages` | A message submitted through the contact form. Stored for portfolio owner to read. |

---

## 2. Entity Relationship Diagram

```
┌─────────────────────────────────────┐
│             artworks                │
├─────────────────────────────────────┤
│ id              INTEGER PRIMARY KEY │  PK, autoincrement
│ title           TEXT NOT NULL       │  English title of the print
│ title_jp        TEXT                │  Japanese title (kanji/kana)
│ series          TEXT NOT NULL       │  Series name: 'Fifty-Three Stations...' / 'One Hundred...' / 'Sixty-odd...'
│ year            INTEGER             │  Publication year
│ era             TEXT                │  Historical period (e.g. 'Edo period')
│ wikimedia_url   TEXT NOT NULL       │  Full-resolution Wikimedia Commons URL
│ thumbnail_url   TEXT NOT NULL       │  Thumbnail URL (width ~400px)
│ description     TEXT                │  2-3 sentence curatorial description
│ is_featured     INTEGER DEFAULT 0   │  1 = featured on homepage, 0 = not featured
│ created_at      TEXT DEFAULT NOW    │  ISO 8601 timestamp
└─────────────────────────────────────┘
         │
         │ (no foreign key — standalone table)
         │

┌───────────────────────────────────────┐
│          contact_messages             │
├───────────────────────────────────────┤
│ id              INTEGER PRIMARY KEY   │  PK, autoincrement
│ name            TEXT NOT NULL         │  Sender's name
│ email           TEXT NOT NULL         │  Sender's email address
│ message         TEXT NOT NULL         │  Message body
│ created_at      TEXT DEFAULT NOW      │  ISO 8601 timestamp
└───────────────────────────────────────┘
```

**Cardinality notes:**
- `artworks` has no foreign keys — it's a standalone catalog table
- `contact_messages` has no foreign keys — it's a standalone message log
- No many-to-many relationships needed at this scale

---

## 3. Indexing Strategy

Given the expected data volume (~50-100 artworks, ~100-1000 contact messages), indexing is minimal but intentional:

### `idx_artworks_series`
- **Type**: B-tree
- **Columns**: `(series)`
- **Purpose**: Filter gallery by series (Tōkaidō, Edo, Sixty-odd Provinces)
- **Why B-tree**: Equality lookup on a low-cardinality TEXT column. SQLite's default B-tree handles this efficiently even without the index at this scale, but it costs nothing and future-proofs.

### `idx_artworks_featured`
- **Type**: B-tree (partial / conditional)
- **Columns**: `(is_featured)` WHERE `is_featured = 1`
- **Purpose**: Homepage query `SELECT * FROM artworks WHERE is_featured = 1 ORDER BY id`
- **Why partial**: Only 10 out of ~50 rows are featured. A partial index keeps the index tiny.

### `idx_contact_messages_created_at`
- **Type**: B-tree
- **Columns**: `(created_at)`
- **Purpose**: Sort contact messages by date (newest first)
- **Why**: Display messages in reverse chronological order in a hypothetical admin view.

---

## 4. Migration Plan

| # | File | Description |
|---|---|---|
| 001 | `server/migrations/001_initial.sql` | Create `artworks` and `contact_messages` tables |

**Migration philosophy**: At this scale (2 tables, single developer, SQLite), migrations are applied on app startup via `CREATE TABLE IF NOT EXISTS`. The SQL files serve as documentation and a foundation for future migration tool adoption if needed.

**Future migrations would follow this naming convention:**
```
002_add_visit_counter.sql
003_add_artwork_indexes.sql
```

---

## 5. ORM Justification

**Decision**: No ORM — raw `better-sqlite3` with prepared statements.

**Rationale:**
- SQLite schema is 2 tables with no relationships — an ORM adds complexity without benefit
- `better-sqlite3` synchronous API means no async overhead — simpler code
- Prepared statements prevent SQL injection with zero abstraction
- The entire data layer is < 50 lines of SQL across both tables
- Adding Prisma/Drizzle for this would add ~15MB to node_modules and a generation step

**Trade-offs considered:**
- *Drizzle ORM*: Excellent type safety, but overkill for 2 flat tables
- *Prisma*: Schema-first approach aligns with our design-system-first philosophy, but the migration tooling is heavy for SQLite
- *Knex.js*: Query builder with migration support — considered but deferred (can add later if queries grow complex)

---

## 6. Seed Strategy

- **Idempotent**: Check if `artworks` table has rows; if count > 0, skip seeding
- **Transactional**: All inserts wrapped in `db.transaction()` for atomicity
- **Real URLs**: All Wikimedia Commons URLs are real, verified public-domain images
- **Count**: 30+ artworks total (10 featured + 20+ non-featured)
- **Validation**: After seeding, script asserts: total > 0, featured === 10, all have wikimedia_url, logs series breakdown

---

## 7. Performance Notes

- SQLite WAL mode enabled for concurrent read performance during gallery browsing
- Synchronous reads are fine for single-user/small-team portfolio scale
- No connection pooling needed — `better-sqlite3` uses a single connection synchronously
- Expected data volume: < 1000 rows across both tables — no partitioning or archival needed
- Database file `server/hiroshige.db` is not in `.gitignore` — no `.gitignore` file exists in the project root. The seed script recreates it on demand. A `.gitignore` should be added before committing to version control.

---

*This document is updated as database decisions are made. Last updated: 2026-06-11.*

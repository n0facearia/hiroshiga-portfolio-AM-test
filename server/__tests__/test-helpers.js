// @ts-check
// Plain JS helper for route tests — avoids require() of .ts files inside
// vi.mock factories (which can't resolve TypeScript modules natively).

const Database = require('better-sqlite3')

/**
 * Creates an in-memory SQLite database with all tables created.
 * Schema mirrors server/schema.ts but inlined here so mock factories
 * can use require() without needing TypeScript resolution.
 */
function createInMemoryDb() {
  const db = new Database(':memory:')
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

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
      is_featured     INTEGER NOT NULL DEFAULT 0,
      created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_artworks_series ON artworks(series);
    CREATE INDEX IF NOT EXISTS idx_artworks_featured ON artworks(is_featured) WHERE is_featured = 1;

    CREATE TABLE IF NOT EXISTS contact_messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      message     TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
      ON contact_messages(created_at);
  `)

  return db
}

/**
 * Seed data: 17 artworks (10 featured, 7 non-featured across 3 series)
 *
 * Matches the test data in test-db.ts, duplicated here because
 * vi.mock factories cannot require() .ts files.
 */
const ARTWORK_SEEDS = [
  // ── Featured (10) ──
  { title: 'Sudden Shower over Shin-Ōhashi Bridge and Atake', title_jp: '大はしあたけの夕立', series: 'One Hundred Famous Views of Edo', year: 1857, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test1.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test1.jpg', description: 'A sudden rainstorm over the Ōhashi bridge.', is_featured: 1 },
  { title: 'Plum Park in Kameido', title_jp: '亀戸梅屋舗', series: 'One Hundred Famous Views of Edo', year: 1857, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test2.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test2.jpg', description: 'A plum tree in full bloom at Kameido Shrine.', is_featured: 1 },
  { title: 'Night Snow at Kambara', title_jp: '蒲原夜之雪', series: 'Fifty-Three Stations of the Tōkaidō', year: 1833, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test3.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test3.jpg', description: 'A serene night scene under heavy snowfall.', is_featured: 1 },
  { title: 'Naruto Whirlpool in Awa Province', title_jp: '阿波鳴門の渦潮', series: 'Famous Views of the Sixty-odd Provinces', year: 1853, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test4.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test4.jpg', description: 'Dramatic whirlpools in the Naruto Strait.', is_featured: 1 },
  { title: 'Fireworks at Ryōgoku', title_jp: '両国花火', series: 'One Hundred Famous Views of Edo', year: 1858, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test5.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test5.jpg', description: 'Fireworks over the Sumida River at Ryōgoku.', is_featured: 1 },
  { title: 'Kinryūzan Temple at Asakusa', title_jp: '浅草金龍山', series: 'One Hundred Famous Views of Edo', year: 1856, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test6.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test6.jpg', description: 'The famous Sensō-ji temple at Asakusa.', is_featured: 1 },
  { title: 'Spiral Hall at Five Hundred Rakan Temple', title_jp: '五百羅漢の螺旋堂', series: 'One Hundred Famous Views of Edo', year: 1857, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test7.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test7.jpg', description: 'An architectural view of the spiral hall.', is_featured: 1 },
  { title: 'Tsukudajima in Musashi Province', title_jp: '武蔵佃島', series: 'One Hundred Famous Views of Edo', year: 1857, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test8.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test8.jpg', description: 'Fishing boats off Tsukudajima island.', is_featured: 1 },
  { title: 'Moon Pine at Ueno', title_jp: '上野の月の松', series: 'One Hundred Famous Views of Edo', year: 1857, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test9.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test9.jpg', description: 'A moonlit pine tree at Ueno.', is_featured: 1 },
  { title: 'Kyu-Togekura Pass in Kiso District', title_jp: '木曽路の九十九折', series: 'Fifty-Three Stations of the Tōkaidō', year: 1855, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test10.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test10.jpg', description: 'A winding mountain pass through dense forest.', is_featured: 1 },
  // ── Non-featured Tōkaidō (3) ──
  { title: 'Nihonbashi: Morning View', title_jp: '日本橋朝之景', series: 'Fifty-Three Stations of the Tōkaidō', year: 1833, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test11.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test11.jpg', description: 'The starting point of the Tōkaidō road.', is_featured: 0 },
  { title: 'Hodogaya: View of the Distant Mountain', title_jp: '程ヶ谷之図', series: 'Fifty-Three Stations of the Tōkaidō', year: 1833, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test12.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test12.jpg', description: 'Travellers passing through Hodogaya with Mount Fuji.', is_featured: 0 },
  { title: 'Fujisawa: Yugyō-ji Temple', title_jp: '藤沢遊行寺', series: 'Fifty-Three Stations of the Tōkaidō', year: 1833, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test13.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test13.jpg', description: 'A view of the large Yugyō-ji temple.', is_featured: 0 },
  // ── Non-featured Edo (2) ──
  { title: 'Mannen Bridge at Fukagawa', title_jp: '深川万年橋', series: 'One Hundred Famous Views of Edo', year: 1856, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test14.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test14.jpg', description: 'A view of the Mannen Bridge with Mount Fuji.', is_featured: 0 },
  { title: 'Evening View of Saruwaka Street', title_jp: '猿若町夜景', series: 'One Hundred Famous Views of Edo', year: 1856, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test15.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test15.jpg', description: 'The theater district of Edo at night.', is_featured: 0 },
  // ── Non-featured Provinces (2) ──
  { title: 'Sarushima: The Island Temple in Sagami Province', title_jp: '相模猿島', series: 'Famous Views of the Sixty-odd Provinces', year: 1853, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test16.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test16.jpg', description: 'A small island with a temple in Sagami Province.', is_featured: 0 },
  { title: 'Mount Fuji from Ikeda in Izumi Province', title_jp: '和泉池田富士', series: 'Famous Views of the Sixty-odd Provinces', year: 1853, era: 'Edo period', wikimedia_url: 'https://commons.wikimedia.org/wiki/test17.jpg', thumbnail_url: 'https://commons.wikimedia.org/wiki/thumb/test17.jpg', description: 'Mount Fuji from Ikeda in Izumi Province.', is_featured: 0 },
]

function seedArtworks(db) {
  const insert = db.prepare(`
    INSERT INTO artworks (title, title_jp, series, year, era, wikimedia_url, thumbnail_url, description, is_featured)
    VALUES (@title, @title_jp, @series, @year, @era, @wikimedia_url, @thumbnail_url, @description, @is_featured)
  `)

  const tx = db.transaction(() => {
    for (const artwork of ARTWORK_SEEDS) {
      insert.run(artwork)
    }
  })

  tx()
}

module.exports = { createInMemoryDb, seedArtworks, ARTWORK_SEEDS }

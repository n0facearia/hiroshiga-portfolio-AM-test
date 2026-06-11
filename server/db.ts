import Database from 'better-sqlite3'
import { join } from 'path'

// Database file lives in server/ — never exposed via Next.js public/ or any served path
const DB_PATH = join(process.cwd(), 'server', 'hiroshige.db')

const db = new Database(DB_PATH)

// WAL mode for better concurrent read performance during gallery browsing
db.pragma('journal_mode = WAL')

// Enforce foreign key constraints (future-proofing for relational queries)
db.pragma('foreign_keys = ON')

export default db

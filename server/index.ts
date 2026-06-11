import express from 'express'
import cors from 'cors'
import { createTables } from './schema'
import artworksRouter from './routes/artworks'
import artistRouter from './routes/artist'
import contactRouter from './routes/contact'

const app = express()
const PORT = 3001

// CORS — allow Next.js dev server on localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }))

app.use(express.json())

// Initialize database tables on startup
createTables()

// ─── Routes ────────────────────────────────────────────────────────

app.use('/api/artworks', artworksRouter)
app.use('/api/artist', artistRouter)
app.use('/api/contact', contactRouter)

// ─── Start server ──────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  �?  Hiroshige API server running at http://localhost:${PORT}\n`)
})

export default app

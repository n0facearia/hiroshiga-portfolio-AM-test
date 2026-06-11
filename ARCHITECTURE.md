# Hiroshige Portfolio — Architecture

> System architecture, data flow, component trees, animation patterns, and operational notes.

---

## 1. System Overview

The project uses a **two-server architecture** with a decoupled frontend and backend:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        User's Browser                               │
│  http://localhost:3000                                               │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  Next.js 14 (SSR + Client)      ────────►  Express 5 (API)     │ │
│  │  Port 3000                       fetch()    Port 3001           │ │
│  │                                                    │            │ │
│  │  Server Components fetch data at request time ─────┤            │ │
│  │  Client Components call API for interactions        │            │ │
│  │  (contact form POST, lightbox artwork detail)       │            │ │
│  │                                                     ▼            │ │
│  │                                              better-sqlite3      │ │
│  │                                              (hiroshige.db)      │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Image CDN: upload.wikimedia.org (public domain)                      │
│  Font CDN: Google Fonts via next/font                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Key architectural decisions

| Decision | Rationale |
|---|---|
| No Next.js API route proxy | Frontend calls `http://localhost:3001/api/*` directly. Keeps Express and Next.js fully decoupled. |
| No ORM | 2 flat tables with no joins — raw better-sqlite3 is simpler and faster. |
| SQLite WAL mode | Enables concurrent reads during gallery browsing without locks. |
| Server Components for data | Home, Gallery, and About pages fetch data server-side at request time. Client Components only for interactivity/animations. |
| CSS masonry (no JS library) | Zero-dependency gallery layout. CSS `columns` property handles responsive reflow natively. |
| Dynamic import for Lightbox | Removed from initial `/work` bundle — loads on demand via `next/dynamic({ ssr: false })`. |
| Fallback data embedded | `lib/fallback-data.ts` provides 13 artwork records with real URLs so the site renders without the Express server. |

---

## 2. Subsystems

### 2.1 Design System (`design-system.md`)

Produced by **design mode**. Defines every visual and motion token:

- 14 color tokens with light/dark variants (sumi, washi, vermillion, gold, mist)
- 4-font typography: EB Garamond (display), Noto Serif JP (Japanese), Noto Sans JP (UI body), Yuji Syuku (kanji accents)
- Spacing system (4px base), grid/breakpoints, border radius & shadow tokens
- Motion system: 5 durations (100ms–1200ms), 5 easing curves including `ink-bleed` (overshoot), 4 stagger timings
- 14 component design specs (KakejikuCard, BrushstrokeDivider, HeroParallax, GalleryMasonry, etc.)
- DaisyUI theme overrides mapping all semantic tokens to sumi-e palette
- 8 animation patterns with Framer Motion implementation details
- Dark mode strategy (night-scene inspired, not simple inversion)
- Accessibility: WCAG AA contrast table, focus states, keyboard nav, ARIA

Consumed by: frontend mode (component implementation), cleanup mode (consistency checks).

### 2.2 Frontend (`FRONTEND.md`)

Produced by **frontend mode**. Defines the component architecture:

- 3 pages: Home (`/`), Gallery (`/work`), About (`/about`)
- 16 Client Components: Navigation, Footer, CustomCursor, PageTransition, InkBackground, BrushstrokeDivider, FloatingPetals, ScrollProgress, HeroParallax, KakejikuCard, GalleryMasonry, FilterBar, Lightbox, BioSection, Timeline, ContactForm
- 2 custom hooks: `useReducedMotion`, `useMediaQuery` (useParallax and useScrollProgress were removed in cleanup)
- Typed API client with fallback data
- State management: Server Components for data, URL searchParams for gallery filter, local `useState` for lightbox and contact form
- All accessibility requirements documented

Consumed by: cleanup mode (dead code removal, refactoring), testing mode (test targets).

### 2.3 Database (`DATABASE.md`)

Produced by **database mode**. Defines the data layer:

- 2 tables: `artworks` (catalog) and `contact_messages` (form log)
- No foreign keys — standalone tables
- 3 indexes: `idx_artworks_series` (B-tree on series), `idx_artworks_featured` (partial WHERE is_featured=1), `idx_contact_messages_created_at` (B-tree on created_at)
- Single migration (`001_initial.sql`) — applied via `CREATE TABLE IF NOT EXISTS` on server startup
- Seed script (`server/seed.ts`): 35 artworks with real Wikimedia Commons URLs, idempotent, transactional, validated
- WAL mode enabled for read concurrency

Consumed by: backend mode (route implementation), testing mode (mock DB setup).

### 2.4 Backend / API (`server/API.md`)

Produced by **backend mode** (combined with cleanup refactoring). Defines the HTTP API:

- 4 endpoints: `GET /api/artworks`, `GET /api/artworks/:id`, `GET /api/artist`, `POST /api/contact`
- Type mapping layer: DB full series names → short codes, INTEGER is_featured → boolean, column renames
- Cache-Control: `public, max-age=3600` on all GET routes
- Express v5 with `express.Router()` — routes split into `routes/artworks.ts`, `routes/artist.ts`, `routes/contact.ts`
- Validation on POST /api/contact (name, email with regex, message — all required)
- CORS configured for `http://localhost:3000`
- No rate limiting, no authentication

Consumed by: frontend mode (API client implementation), testing mode (supertest integration tests).

### 2.5 Testing

Produced by **testing mode**. No dedicated `TESTING.md` exists — test configuration is in `vitest.config.ts` and `.am/state/testing.json`:

- Framework: Vitest 4.1.8 with V8 coverage provider
- 7 test files: 3 server route tests (artworks, artist, contact), 1 DB schema test, 3 lib utility tests (api, artworks, contact)
- 57 tests total with 93.93% statement coverage
- Route tests use isolated in-memory SQLite via `vi.mock('../db')` with a plain JS helper
- Lib tests mock the `./api` module boundary instead of `global.fetch`
- Coverage exclusions: `animations.ts` (static variants), `fallback-data.ts` (static data), `db.ts` (connection singleton)

---

## 3. Mode Relationships

```
Design mode ───────────► design-system.md ──────────► Frontend mode, Cleanup mode
                                                              │
Database mode ─────────► DATABASE.md ────────────────────────►│
                                                              │
Frontend mode ─────────► FRONTEND.md, all components ────────►│
                                                              ▼
                                                    Backend mode
                                                         │
                                                    server/API.md
                                                         │
                                                         ▼
                                                   Testing mode
                                                         │
                                                    (7 test files, 57 tests)
                                                         │
                                                         ▼
                                                 Documentation mode ◄── (current)
                                                         │
                                            README.md, ARCHITECTURE.md,
                                            CONTRIBUTING.md
```

Modes excluded:
- **Security**: No authentication, no user data, no file uploads — no attack surface worth auditing.
- **DevOps**: Local-only deployment. No CI/CD pipeline needed.

---

## 4. Data Flow

### 4.1 Page Load (Server-Side)

```
Browser requests / (Home page)
        │
        ▼
Next.js Server Component (app/page.tsx)
        │
        ├── getFeaturedArtworks() ──► fetchApi('artworks?featured=true')
        │                                   │
        │                                   ▼
        │                           Express GET /api/artworks?featured=true
        │                                   │
        │                                   ▼
        │                           SQLite: SELECT * FROM artworks
        │                                   WHERE is_featured = 1
        │                                   ORDER BY id
        │                                   │
        │                                   ▼
        │                           Type mapping: INTEGER → boolean,
        │                           series full name → short code
        │                                   │
        │                                   ▼
        │                           Response: { artworks: Artwork[] }
        │
        ├── getArtistInfo() ──► fetchApi('artist')
        │                           │
        │                           ▼
        │                   Express GET /api/artist
        │                           │
        │                           ▼
        │                   Response: { name, bio, timeline } (static)
        │
        ▼
Server renders:
  - Layout (Navigation, Footer, PageTransition wrapper)
  - HeroParallax (Client Component — hydrates in browser)
  - Featured artwork grid (KakejikuCard × 10)
  - SeriesOverview
        │
        ▼
HTML + JS sent to browser
```

### 4.2 Gallery Filter Interaction (Client-Side)

```
User clicks "Tōkaidō" filter tab
        │
        ▼
FilterBar: useRouter.push('/work?series=tokaido')
        │
        ▼
Next.js re-fetches GalleryPage Server Component
        │
        ▼
getAllArtworks('tokaido') ──► fetchApi('artworks?series=tokaido')
        │
        ▼
Express: SELECT * FROM artworks WHERE series = 'Fifty-Three Stations...'
        │
        ▼
GalleryMasonry re-renders with filtered results
```

### 4.3 Contact Form Submission (Client-Side)

```
User fills contact form, clicks submit
        │
        ▼
ContactForm: client-side validation (all fields required, email regex)
        │
        ├── Invalid ──► Show inline errors (vermillion text), stop
        │
        ▼
submitContactMessage({ name, email, message })
        │
        ▼
fetchApi POST /api/contact (fetch to localhost:3001)
        │
        ▼
Express: validates server-side
        │
        ├── Invalid ──► 400 { success: false, error: "..." }
        │                   │
        │                   ▼
        │               ContactForm shows error message
        │
        ▼
        Valid ──► SQLite: INSERT INTO contact_messages
                    │
                    ▼
            Response: { success: true }
                    │
                    ▼
            ContactForm hides form, shows 承 (ink stamp)
```

### 4.4 Artwork Detail (Client-Side)

```
User clicks artwork card in gallery
        │
        ▼
Lightbox opens (dynamic import loads component)
        │
        ▼
fetchApi(`artworks/${id}`) ──► GET /api/artworks/:id
        │
        ▼
Express: SELECT * FROM artworks WHERE id = ?
        │
        ▼
Response: single Artwork object (without { artworks } wrapper)
        │
        ▼
Lightbox displays: full image, title (EN + JP), description, year, series
```

---

## 5. Database Schema

```
┌──────────────────────────────────────────────────┐
│                   artworks                        │
├──────────────────────────────────────────────────┤
│ id              INTEGER PRIMARY KEY AUTOINCREMENT │
│ title           TEXT NOT NULL    -- English title  │
│ title_jp        TEXT             -- Japanese title │
│ series          TEXT NOT NULL    -- Full name      │
│ year            INTEGER          -- Publication yr │
│ era             TEXT             -- Edo period, etc│
│ wikimedia_url   TEXT NOT NULL    -- Full-res URL   │
│ thumbnail_url   TEXT NOT NULL    -- 400px thumb    │
│ description     TEXT             -- Curatorial     │
│ is_featured     INTEGER DEFAULT 0                  │
│ created_at      TEXT DEFAULT (datetime('now'))     │
├──────────────────────────────────────────────────┤
│ Indexes:                                          │
│  idx_artworks_series      (series)                │
│  idx_artworks_featured    (is_featured) WHERE 1   │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│              contact_messages                     │
├──────────────────────────────────────────────────┤
│ id              INTEGER PRIMARY KEY AUTOINCREMENT │
│ name            TEXT NOT NULL                     │
│ email           TEXT NOT NULL                     │
│ message         TEXT NOT NULL                     │
│ created_at      TEXT DEFAULT (datetime('now'))     │
├──────────────────────────────────────────────────┤
│ Indexes:                                          │
│  idx_contact_messages_created_at (created_at)     │
└──────────────────────────────────────────────────┘
```

**Series mapping** (handled in API layer, not DB):

| DB stored value | API short code | Count |
|---|---|---|
| `One Hundred Famous Views of Edo` | `Edo` | 14 |
| `Fifty-Three Stations of the Tōkaidō` | `Tōkaidō` | 16 |
| `Famous Views of the Sixty-odd Provinces` | `Other` | 5 |

**Data type transformations** (API layer):

| DB column | API field | Transformation |
|---|---|---|
| `series` (full name) | `series` (short code) | String mapping |
| `is_featured` (INTEGER) | `is_featured` (boolean) | `1` → `true`, `0` → `false` |
| `thumbnail_url` | `wikimedia_thumb` | Renamed |
| `title_jp` (nullable TEXT) | `title_jp` (optional) | `null` → `undefined` |
| `year` (nullable INTEGER) | `year` (number) | `null` → `0` |
| `description` (nullable TEXT) | `description` (string) | `null` → `''` |

---

## 6. Component Tree (ASCII)

### Root Layout

```
RootLayout (Server Component)
├── <html> with 4 Google Fonts (EB Garamond, Noto Serif JP, Noto Sans JP, Yuji Syuku)
│   ├── <body className="min-h-screen bg-washi text-sumi">
│   │   ├── Navigation (Client)
│   │   │   ├── Desktop: horizontal links, uppercase, letter-spacing
│   │   │   └── Mobile: single kanji 道 → haiku → nav links
│   │   ├── CustomCursor (Client, Canvas)
│   │   ├── <AnimatePresence mode="wait">
│   │   │   └── PageTransition (Client, ink-wipe overlay)
│   │   │       └── {children} (page content)
│   │   ├── Footer (Server, ink stamp style)
│   │   └── ScrollProgress (Client, right edge ink drip)
```

### Home Page (`/`)

```
HomePage (Server Component)
├── getFeaturedArtworks() → fetch API
├── getArtistInfo() → fetch API
├── InkBackground (Client) — fixed CSS gradient layers with scroll parallax
├── HeroParallax (Client) — 4-layer 3D depth
│   ├── Layer 0: InkBackground (z-index: 0, scroll speed: 0.1x)
│   ├── Layer 1: Distant mountain silhouettes (z-index: 1, speed: 0.25x)
│   ├── Layer 2: Midground floating artwork shapes (z-index: 2, speed: 0.5x)
│   ├── Layer 3: FloatingPetals — 15 cherry blossom particles (speed: 0.4x)
│   └── Layer 4: Foreground title text + subtitle (z-index: 4, speed: 0.8x)
│       └── Brushstroke SVG reveal over hero text
├── FeaturedArtworksSection
│   └── KakejikuCard × 10 (Client, scroll-reveal variants)
│       ├── Hanging cord (thin line)
│       ├── Top rod (sumi-deep, 6px)
│       ├── Mounting (washi border, 4px)
│       ├── Artwork image (next/image)
│       ├── Bottom rod (sumi-deep, 6px)
│       └── Caption: title, series, vermillion seal
└── SeriesOverviewSection
```

### Gallery Page (`/work`)

```
GalleryPage (Server Component)
├── getAllArtworks(searchParams.series) → fetch API
├── PageHeader (title + artwork count)
├── FilterBar (Client) — URL searchParams sync
│   ├── "All" tab
│   ├── "Tōkaidō" tab
│   ├── "Edo" tab
│   └── "Other" tab
├── GalleryMasonry (Client)
│   └── KakejikuCard × N (CSS columns layout)
│       └── onClick → open Lightbox
└── Lightbox (Client, dynamic import, SSR disabled)
    ├── role="dialog", aria-modal
    ├── Full-resolution artwork image
    ├── Title (EN + JP)
    ├── Description + year + series
    ├── Previous / Next navigation (← → arrows)
    └── Esc to close
```

### About Page (`/about`)

```
AboutPage (Server Component)
├── getArtistInfo() → fetch API
├── BioSection (biography text)
├── BrushstrokeDivider: Mountain (山)
├── Timeline (Client, scroll-reveal entries)
│   └── TimelineEvent × 6 (year + event)
├── BrushstrokeDivider: Wave (波)
├── ContactForm (Client)
│   ├── Name input (bottom-border style)
│   ├── Email input (bottom-border style)
│   ├── Message textarea (bottom-border style)
│   ├── Inline validation on blur
│   ├── Submit button (vermillion border)
│   └── Success: 承 ink stamp animation
└── BrushstrokeDivider: Bamboo (竹)
```

---

## 7. Animation Architecture

### 7.1 Token System (`lib/animations.ts`)

Shared easing curves, durations, and Framer Motion variants used across all animated components:

```typescript
// Easing curves
inkBleed:    [0.34, 1.56, 0.64, 1]   // slight overshoot — ink settling
softEase:    [0.16, 1, 0.3, 1]       // natural deceleration
brushStroke: [0.25, 0.1, 0.25, 1]   // deliberate line drawing
scrollEase:  [0.22, 1, 0.36, 1]      // scroll-driven reveals

// Duration tokens
instant:   0.2   // hover states
reveal:    0.8   // scroll-triggered entrances
deliberate: 1.2  // brushstroke path animations
```

### 7.2 Pattern Inventory

| Pattern | Component | Technique | Trigger |
|---|---|---|---|
| Ink-wipe page transition | `PageTransition` | CSS pseudo-element overlay, scale from top-left | Route change (AnimatePresence) |
| 3D parallax | `HeroParallax` | CSS perspective + translateZ, onMouseMove | Scroll position, mouse movement |
| Scroll reveal | `KakejikuCard`, `Timeline` | Framer Motion `whileInView`, y + opacity | Element enters viewport |
| SVG brushstroke draw | `BrushstrokeDivider` | `pathLength` animation | Scroll into view |
| Floating particles | `FloatingPetals` | Sinusoidal keyframe loop, randomized period | On mount, infinite |
| Ink drip scrollbar | `ScrollProgress` | `useScroll` + `useTransform` mapping | Window scroll |
| Canvas cursor | `CustomCursor` | requestAnimationFrame, ink droplet behind cursor | Mouse move (desktop only) |
| Staggered entrances | Multiple | `staggerChildren: 0.1` on parent variants | Scroll reveal |
| Card hover tilt | `KakejikuCard` | onMouseMove → rotateX/rotateY mapping | Mouse hover |
| Ink stamp success | `ContactForm` | Scale + fade of 承 character | Form submission success |

### 7.3 Reduced Motion

When `prefers-reduced-motion: reduce` is detected:
- All CSS animations/transitions set to `0.01ms` via global CSS
- Parallax layers receive `transform: none!important`
- Particles hidden via `display: none`
- Framer Motion `useReducedMotion()` hook adjusts: duration halved, stagger delays zeroed, variants changed to opacity-only
- `PageTransition` uses its own `matchMedia` check to skip ink-wipe animation

---

## 8. Project File Tree (Annotated)

```
hiroshige-portfolio/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout — 4 Google Fonts, Navigation, Footer,
│   │                                   PageTransition, CustomCursor, ScrollProgress,
│   │                                   AnimatePresence wrapping page content
│   ├── page.tsx                      # Home page — Server Component, fetches featured
│   │                                   artworks + artist info
│   ├── not-found.tsx                 # Custom 404 page
│   ├── globals.css                   # CSS custom properties for sumi-e palette, DaisyUI
│   │                                   overrides, Tailwind @layers, animation keyframes,
│   │                                   reduced motion media query
│   ├── fonts.ts                      # next/font/google wrapper — exports all 4 font configs
│   ├── about/
│   │   └── page.tsx                  # About page — Server Component, fetches artist info
│   └── work/
│       └── page.tsx                  # Gallery page — Server Component, fetches artworks
│                                      with optional ?series= filter
│
├── components/                       # 16 Client Components (when they need interactivity)
│   ├── BioSection.tsx                # Artist biography text section
│   ├── BrushstrokeDivider.tsx        # 3 SVG variants: mountain, wave, bamboo
│   ├── ContactForm.tsx               # Validated form + 承 success stamp
│   ├── CustomCursor.tsx              # Canvas ink-droplet trailing effect
│   ├── FilterBar.tsx                 # Series filter tabs synced to URL searchParams
│   ├── FloatingPetals.tsx            # 15 cherry blossom particles, sinusoidal drift
│   ├── Footer.tsx                    # Ink stamp footer
│   ├── GalleryMasonry.tsx            # CSS columns masonry grid
│   ├── HeroParallax.tsx              # 4-layer 3D parallax with mouse tracking
│   ├── InkBackground.tsx             # Fixed CSS gradient layers
│   ├── KakejikuCard.tsx              # Hanging scroll artwork card
│   ├── Lightbox.tsx                  # Full-screen artwork viewer (dynamic import)
│   ├── Navigation.tsx                # Responsive nav + haiku mobile menu
│   ├── PageTransition.tsx            # Ink-wipe page transition overlay
│   ├── ScrollProgress.tsx            # Ink drip scroll progress indicator
│   └── Timeline.tsx                  # Scroll-reveal biography timeline
│
├── hooks/                            # Custom React hooks (2 files)
│   ├── useMediaQuery.ts              # Generic CSS media query hook
│   └── useReducedMotion.ts           # prefers-reduced-motion detection
│
├── lib/                              # Utility modules
│   ├── animations.ts                 # Shared Framer Motion tokens (curves, durations,
│   │                                   variants: fadeInUp, scaleIn, brushstrokeReveal, inkWipe)
│   ├── api.ts                        # fetchApi<T>(endpoint, options?) — typed fetch wrapper,
│   │                                   builds http://localhost:3001/api/{endpoint},
│   │                                   throws on !res.ok
│   ├── artworks.ts                   # Data functions: getFeaturedArtworks(),
│   │                                   getAllArtworks(series?), getArtworkById(id),
│   │                                   getArtistInfo() — each has try/catch with fallback
│   ├── contact.ts                    # submitContactMessage({name, email, message}) —
│   │                                   calls POST /api/contact, returns { success: true }
│   │                                   fallback on network error
│   ├── fallback-data.ts              # 13 Artwork[] with real Wikimedia URLs — renders
│   │                                   site fully without Express backend
│   ├── api.test.ts                   # fetchApi tests with mocked fetch
│   ├── artworks.test.ts              # Data function tests with mocked api module
│   └── contact.test.ts               # Contact submission tests with mocked api module
│
├── server/                           # Express backend
│   ├── index.ts                      # Server entry: CORS, JSON parser, createTables(),
│   │                                   mounts routes on /api, listens on port 3001
│   ├── db.ts                         # better-sqlite3 singleton, WAL mode, foreign_keys ON
│   ├── schema.ts                     # CREATE TABLE IF NOT EXISTS for artworks +
│   │                                   contact_messages with indexes
│   ├── seed.ts                       # Idempotent seed: 35 artworks with real URLs,
│   │                                   transactional, validated (count >= 30, featured == 10)
│   ├── routes/
│   │   ├── artworks.ts               # GET /api/artworks (+ ?featured, ?series filters)
│   │   │                                + GET /api/artworks/:id
│   │   ├── artist.ts                 # GET /api/artist (static JSON)
│   │   └── contact.ts               # POST /api/contact (validated)
│   ├── migrations/
│   │   └── 001_initial.sql           # Reference SQL migration
│   └── __tests__/
│       ├── test-helpers.js           # Plain JS helper for isolated in-memory SQLite
│       ├── artworks.test.ts          # Route integration tests (supertest)
│       ├── artist.test.ts            # Route integration tests
│       ├── contact.test.ts           # Route integration tests
│       ├── db.test.ts                # Schema + CRUD tests
│       └── test-db.ts               # Test database utilities
│
├── types/
│   └── index.ts                      # TypeScript interfaces: Artwork, ContactMessage,
│                                      Series, TimelineEvent, ArtistInfo, BrushstrokeVariant
│
├── tailwind.config.ts                # Custom sumi-e theme: 14 color tokens, custom fonts,
│                                       DaisyUI plugin, animation keyframes, extended spacing
├── next.config.mjs                   # remotePatterns for upload.wikimedia.org
├── vitest.config.ts                  # Node environment, V8 coverage (93%+ threshold),
│                                       file include patterns, alias config
├── package.json                      # All dependencies + 8 scripts
├── tsconfig.json                     # Strict TypeScript config
├── postcss.config.mjs                # PostCSS with Tailwind + autoprefixer
├── .eslintrc.json                    # ESLint with Next.js config
│
├── design-system.md                  # Complete sumi-e design specification
├── FRONTEND.md                       # Frontend architecture document
├── DATABASE.md                       # Database architecture document
├── server/API.md                     # API endpoint reference
├── ARCHITECTURE.md                   # This file — system architecture
├── README.md                         # Project overview and quickstart
└── CONTRIBUTING.md                   # How to extend the project
```

---

## 9. How to Add an Artwork

Adding a new artwork to the seed data:

1. **Find a Wikimedia Commons URL.** Navigate to Wikimedia Commons and find a public-domain Hiroshige print. Copy the file page URL (e.g., `https://commons.wikimedia.org/wiki/File:Example.jpg`). The full-resolution image URL is: `https://upload.wikimedia.org/wikipedia/commons/X/Xx/File.jpg`. The thumbnail (400px) URL is: `https://upload.wikimedia.org/wikipedia/commons/thumb/X/Xx/File.jpg/400px-File.jpg`.

2. **Edit `server/seed.ts`.** Add a new object to the `artworks` array:
   ```typescript
   {
     title: 'English Title',
     title_jp: '漢字タイトル',   // optional
     series: 'Fifty-Three Stations of the Tōkaidō', // or 'One Hundred Famous Views of Edo'
     year: 1850,
     era: 'Edo period',
     wikimedia_url: 'https://upload.wikimedia.org/wikipedia/commons/...',
     thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/.../400px-...',
     description: '2-3 sentence curatorial description.',
     is_featured: 0   // 1 for homepage featured, 0 otherwise
   }
   ```

3. **Re-seed the database** (this clears existing data and re-inserts all 35+ artworks):
   ```bash
   npm run db:seed
   ```

4. **Validate.** Check that the artwork appears at `http://localhost:3001/api/artworks` and renders correctly in the frontend gallery at `http://localhost:3000/work`.

> **Note:** To add the artwork to the fallback data (so it renders without the backend), also add a corresponding entry to `lib/fallback-data.ts` with the same data shape.

---

## 10. How to Add an Endpoint

Adding a new API endpoint:

1. **Create the route file** in `server/routes/`:
   ```typescript
   // server/routes/new-feature.ts
   import { Router } from 'express'
   import { db } from '../db'

   const router = Router()

   router.get('/', (req, res) => {
     try {
       const rows = db.prepare('SELECT * FROM new_table').all()
       res.json({ data: rows })
     } catch (err) {
       res.status(500).json({ error: 'Failed to fetch data' })
     }
   })

   export default router
   ```

2. **Mount the route** in `server/index.ts`:
   ```typescript
   import newFeatureRoutes from './routes/new-feature'
   // ...
   app.use('/api/new-feature', newFeatureRoutes)
   ```

3. **Add a frontend data function** in `lib/`:
   ```typescript
   // lib/new-feature.ts
   import { fetchApi } from './api'

   export async function getNewFeatureData(): Promise<SomeType[]> {
     try {
       return await fetchApi<{ data: SomeType[] }>('new-feature').then(r => r.data)
     } catch {
       return FALLBACK_DATA
     }
   }
   ```

4. **Add TypeScript types** in `types/index.ts` if needed.

5. **Document** in `server/API.md` following the existing endpoint format.

6. **Add tests** in `server/__tests__/` and/or `lib/` following the existing patterns.

---

## 11. Known Limitations

1. **No rate limiting on contact form.** The `POST /api/contact` endpoint accepts unlimited requests. If deploying publicly, add `express-rate-limit` middleware.

2. **CustomCursor ignores reduced motion.** The Canvas `requestAnimationFrame` loop runs even when `prefers-reduced-motion: reduce` is active. The CSS reduced-motion rule does not affect JS rAF loops. Low priority since the cursor effect is subtle.

3. **KakejikuCard hover on touch devices.** Framer Motion's `whileHover` (scale + rotate) activates briefly on tap before the lightbox opens. This is a known Framer Motion behavior on mobile.

4. **`series_number` and `tags` fields are unused.** These fields exist in the `Artwork` type and API response but always return `0` and `''` respectively. They were included for future extensibility but no component currently consumes them.

5. **No auto-seed on server startup.** The database must be seeded manually via `npm run db:seed`. The server calls `CREATE TABLE IF NOT EXISTS` on startup but does not seed data. This is intentional (seed is a one-time operation).

6. **`HeroParallax` blur animation may jank on low-end devices.** The `filter: blur()` animation via Framer Motion is GPU-composited but may cause frame drops on integrated graphics. A CSS-based alternative would be smoother but less controllable.

7. **Database file not gitignored.** The SQLite database file (`server/hiroshige.db`) and its WAL files (`.db-shm`, `.db-wal`) are not listed in a `.gitignore` — no `.gitignore` file exists in the project root.

8. **Test coverage gap: 500 error branches.** Three catch blocks in route files (server errors on database failure) are intentionally uncovered by tests because the in-memory mock database cannot throw. These branches would only trigger on actual filesystem-level DB corruption.

9. **TypeScript strict mode — computed fields.** The `Artwork` type's `series_number` and `tags` fields have default values of `0` and `''` in the API response but are not stored in the database. If a future schema change adds these columns, the type mapping layer would need updating.

---

*This document is generated by the documentation mode and should be updated whenever the architecture changes.*

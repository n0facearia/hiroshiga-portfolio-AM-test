# Hiroshige Portfolio — Frontend Architecture

> Frontend mode document. Defines the component tree, routing table, state management, and conventions.

---

## 1. Routing Table

| Path | Page Component | File | Type | Auth |
|---|---|---|---|---|
| `/` | HomePage | `app/page.tsx` | Server + Client Islands | Public |
| `/work` | GalleryPage | `app/work/page.tsx` | Server + Client Islands | Public |
| `/about` | AboutPage | `app/about/page.tsx` | Server + Client Islands | Public |
| `/*` | NotFoundPage | `app/not-found.tsx` | Server | Public |

**Strategy**: File-based (Next.js App Router). Each page is a Server Component that fetches data. Animation-heavy sections are isolated as Client Components.

---

## 2. Component Tree

```
                    RootLayout (Server)
                    ├── ThemeProvider (Client Context)
                    ├── CustomCursor (Client Canvas)
                    ├── Navigation (Client — responsive, haiku nav on mobile)
                    ├── <AnimatePresence mode="wait">
                    │   └── PageTransition (Client — ink wipe)
                    │       └── Page Content (Server + Client Islands)
                    └── Footer (Server — ink stamp style)
```

### Page Compositions

**HomePage (`/`)**
```
HomePage (Server)
├── InkBackground (Client — fixed, CSS gradients, scroll parallax)
├── HeroParallax (Client — 3D layered hero)
│   ├── ParallaxLayer × 4 (Client — z-depth layers)
│   ├── FloatingPetals (Client — cherry blossoms)
│   ├── BrushstrokeReveal (Client — SVG pathLength)
│   ├── HeroTitle (Client — character-by-character entrance)
│   └── ScrollProgress (Client — ink drip indicator)
├── FeaturedArtworksSection (Server + Client)
│   ├── SectionTitle (Server)
│   └── KakejikuCard × 10 (Client — scroll reveal variants)
└── SeriesPreviewSection (Server)
```

**GalleryPage (`/work`)**
```
GalleryPage (Server — fetches artworks)
├── PageHeader (Server)
├── FilterBar (Client — series tabs, URL searchParams)
├── GalleryMasonry (Client — responsive grid)
│   └── KakejikuCard × N (Client — hover tilt, click to open)
└── Lightbox (Client — dynamic import, lazy)
```

**AboutPage (`/about`)**
```
AboutPage (Server — fetches bio)
├── BioSection (Server)
├── BrushstrokeDivider × 3 (Client — mountain, wave, bamboo)
├── Timeline (Client — scroll reveal)
├── ContactForm (Client — form state, POST, validation)
└── SuccessStamp (Client — 承 animation)
```

---

## 3. Component Inventory & Status

| Component | Status | Notes |
|---|---|---|
| `Navigation` | ✅ Built | Responsive, haiku nav on mobile |
| `Footer` | ✅ Built | Ink stamp style |
| `CustomCursor` | ✅ Built | Canvas API ink drops |
| `PageTransition` | ✅ Built | Ink wipe with Framer Motion |
| `InkBackground` | ✅ Built | CSS gradient parallax layers |
| `BrushstrokeDivider` | ✅ Built | 3 SVG variants (mountain, wave, bamboo) |
| `FloatingPetals` | ✅ Built | 15 cherry blossom particles |
| `ScrollProgress` | ✅ Built | Ink drip indicator |
| `HeroParallax` | ✅ Built | 4-layer 3D hero with mouse parallax |
| `KakejikuCard` | ✅ Built | Hanging scroll frame |
| `GalleryMasonry` | ✅ Built | CSS columns (zero-dependency) |
| `FilterBar` | ✅ Built | URL searchParam-synced tabs |
| `Lightbox` | ✅ Built | Keyboard-navigable modal |
| `BioSection` | ✅ Built | Artist bio section |
| `Timeline` | ✅ Built | Scroll-reveal timeline |
| `ContactForm` | ✅ Built | Validation + ink stamp success |

### Pages

| Page | Status | Dependencies |
|---|---|---|
| `HomePage` | ✅ Built | HeroParallax, KakejikuCard, FloatingPetals, InkBackground |
| `GalleryPage` | ✅ Built | GalleryMasonry, FilterBar, Lightbox, lib/artworks |
| `AboutPage` | ✅ Built | BioSection, Timeline, BrushstrokeDivider, ContactForm |

---

## 4. State Management

| Data | Source | Strategy |
|---|---|---|
| Featured artworks | `GET /api/artworks?featured=true` | Server Component fetch → pass to client |
| All artworks | `GET /api/artworks` | Server Component fetch |
| Single artwork | `GET /api/artworks/:id` | Client fetch in Lightbox |
| Artist bio | `GET /api/artist` | Server Component fetch |
| Gallery filter | URL search params | `useSearchParams` + `useRouter` |
| Lightbox state | Client `useState` | Local to GalleryPage |
| Theme (dark/light) | `localStorage` + Context | `ThemeProvider` in `lib/theme-context.tsx` |
| Contact form | Client `useState` | Local to ContactForm |

**No global client state library needed.** Server Components handle data fetching. Client state is local. Theme is managed via React Context with `localStorage` persistence and system preference detection on first visit.

### Theme Implementation

- **Provider**: `ThemeProvider` in `lib/theme-context.tsx` wraps the root layout
- **Toggle**: `ThemeToggle` component in `components/ThemeToggle.tsx` — sun/moon icon button
- **Anti-flash**: Inline `<script>` in `layout.tsx` applies the correct class before React hydrates
- **CSS variables**: All color tokens use `rgb(var(--color-rgb))` format for Tailwind opacity support
- **DaisyUI**: Two themes (`sumi-light` / `sumi-dark`) toggled via `data-theme` attribute
- **Default**: Respects `prefers-color-scheme` on first visit; persists choice to `localStorage`

---

## 5. API Contract

All endpoints are built (Express server at localhost:3001). Typed fetch helpers with fallback data are available for development.

### `GET /api/artworks?featured=true`
```typescript
type Artwork = {
  id: number
  title: string
  title_jp?: string
  series: 'Tōkaidō' | 'Edo' | 'Other'
  series_number: number
  year: number
  description: string
  wikimedia_url: string
  wikimedia_thumb?: string
  tags: string
  is_featured: boolean
  display_order: number
}
// Returns: { artworks: Artwork[] }
```

### `GET /api/artworks?series=tokaido`
Returns filtered array.

### `GET /api/artworks/:id`
Returns single artwork.

### `POST /api/contact`
```typescript
type ContactPayload = { name: string; email: string; message: string }
type ContactResponse = { success: boolean; error?: string }
```

### `GET /api/artist`
```typescript
type ArtistInfo = {
  name: string
  bio: string
  birth_year: number
  death_year: number
  timeline: { year: number; event: string }[]
}
```

---

## 6. Coding Conventions

- **Single quotes**, no semicolons, 2-space indent, trailing commas
- **`const` over `let`**, early returns over else
- **Named exports** everywhere except `page.tsx` files (default export required by Next.js)
- **TypeScript strict mode** — no `any`
- **No inline comments** unless genuinely non-obvious
- **Each component in its own directory** with single `index.tsx` file (simplified for this project)
- **File structure:**
  ```
  components/
    ComponentName/
      index.tsx    — implementation
  ```

---

## 7. Framework Conventions

- `next/image` with `remotePatterns` for `upload.wikimedia.org`
- `next/font` for Google Fonts (Noto Serif JP, EB Garamond)
- `use client` directive only on files that need browser APIs (Framer Motion, event handlers, state)
- Server Components by default
- Page transitions via `AnimatePresence` in root layout, not in page files
- `generateMetadata` in each page for SEO

---

## 8. Accessibility Checklist

- [x] All `<img>` have descriptive `alt` text (title + series + artist)
- [x] Focus visible: ink-ring outline (2px vermillion, offset 2px)
- [x] Lightbox: `role="dialog"`, `aria-modal`, focus trap, keyboard nav
- [x] Navigation: semantic `<nav>` with `aria-label`
- [x] Contact form: `<label>` associations, `aria-describedby` for errors
- [x] Reduced motion: `useReducedMotion()` fallback to opacity fades
- [ ] Skip-to-content link as first tabbable element *(not yet implemented — should be added to RootLayout)*
- [x] Color contrast: all pairs verified in design-system.md (WCAG AA)

---

*This document is updated as components are implemented. Last updated: 2026-06-11.*

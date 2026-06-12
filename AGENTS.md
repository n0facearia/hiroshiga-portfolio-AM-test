# Hiroshige Portfolio — Agent Guide

## Stack
- **Frontend**: Next.js 14 (Pages Router style via App Router), React 18, Tailwind CSS 3, DaisyUI 4, Framer Motion 11
- **Backend**: Express 5 on port **3001**
- **DB**: SQLite via better-sqlite3 (no ORM)
- **Dev**: `concurrently` runs Next.js (3000) + API server (3001)
- **Testing**: Vitest 4 (node environment, no jsdom), supertest for routes

## Commands
```sh
npm run dev           # Next.js + API server concurrently
npm run dev:server    # API server only (tsx watch)
npm run build         # next build
npm run lint          # next lint (only JS/TS, not CSS)
npm test              # vitest run
npm run test:watch    # vitest (watch mode)
npm run db:seed       # tsx server/seed.ts — idempotent, must restart server after
```

## Key Architecture
- `app/page.tsx` — Server Component (async, fetches data). Uses `HomeGalleryClient` (client) for interactive lightbox.
- `components/` — 23 components across 3 tiers: primitives, compositions, pages.
- `lib/` — data fetching (`artworks.ts`, `api.ts`), animations, theme context, fallback data.
- `server/` — Express routes (`/api/artworks`, `/api/artist`, `/api/contact`), schema, seed data.
- `types/index.ts` — Shared `Artwork`, `ArtistInfo`, `ContactMessage` types.
- **Styles**: `app/globals.css` defines CSS custom properties for the sumi-e palette with light & dark mode via `.dark` class. DaisyUI theme is `class` strategy.
- **Lightbox**: Dynamically imported (`ssr: false`). Gallery uses `GalleryMasonry` → `Lightbox`, homepage uses `HomeGalleryClient` → `Lightbox`.

## Testing Quirks
- Tests use `vi.mock('../db')` with synchronous factories (no async `vi.mock` — causes deadlock in Vitest 4).
- `server/__tests__/test-helpers.js` is plain JS (required by vi.mock factory, can't import TS).
- Coverage excludes `lib/animations.ts`, `lib/fallback-data.ts`, `server/db.ts`.
- No component tests (no jsdom environment configured). Server/lib tests only.

## Style Conventions
- Strict TS (`strict: true`), no `any`.
- Single quotes, no semicolons, 2-space indent, trailing commas.
- `const` over `let`, early returns over `else`.
- Named exports everywhere; `export default` only for Next.js pages.
- No inline comments unless genuinely non-obvious.

## Design System (& Gotchas)
- Text colors use opacity classes (`text-sumi/80`, `text-mist/60`) — these reduce contrast significantly. For body text, prefer full opacity `text-sumi`. Only `text-mist` passes WCAG AA at 4.8:1 but can still look washed out — when readability matters, use `text-sumi`.
- The HeroParallax title backdrop needs ≥85% washi opacity to shield text from the 2.5D scene layers.
- All color CSS variables in `globals.css` adapt for dark mode via `.dark` class — use `rgba(var(--sumi-rgb), X)` etc. for automatic dark mode support.
- Vermillion is text/border only (never background fill). Gold is decorative-only (not for text).

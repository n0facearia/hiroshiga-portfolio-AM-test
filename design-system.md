# Hiroshige Portfolio — Sumi-e Design System

> *"Not the literal, but the essence. Not the object, but the feeling."*
> — Zen aesthetic principle guiding this system

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border Radius & Shadows](#5-border-radius--shadows)
6. [Motion Tokens](#6-motion-tokens)
7. [DaisyUI Theme Overrides](#7-daisyui-theme-overrides)
8. [Component Architecture](#8-component-architecture)
9. [Iconography & Imagery](#9-iconography--imagery)
10. [Accessibility](#10-accessibility)
11. [Animation Patterns](#11-animation-patterns)
12. [Dark Mode](#12-dark-mode)

---

## 1. Design Philosophy

This design system is built on four principles drawn from Japanese ink painting (sumi-e) and classical Japanese aesthetics:

| Principle | Japanese | Design Implication |
|---|---|---|
| **Emptiness** | 間 (Ma) | Generous negative space is a compositional element, not a void. White space has weight. |
| **Impermanence** | 無常 (Mujō) | Subtle animations, organic transitions, nothing feels mechanical or rigid. |
| **Asymmetry** | 不均整 (Fukinsei) | Intentional imbalance in layouts. Avoid symmetrical grids where possible. |
| **Subtlety** | 幽玄 (Yūgen) | Profound, mysterious grace. Effects should be felt before they're seen. No gratuitous motion. |

**Every design decision in this system answers the question:** *Does this reinforce the feeling of standing before a Hiroshige woodblock print?*

---

## 2. Color Tokens

### 2.1 Light Mode (Default — Washi Paper)

Inspired by the four materials of traditional Japanese painting: sumi ink (墨), washi paper (和紙), vermillion seal (朱), and gold leaf (金).

| Token | CSS Variable | Light Hex | Dark Hex | Usage | WCAG Light | WCAG Dark |
|---|---|---|---|---|---|---|---|
| **Sumi Black** | `--sumi` | `#1A1A1A` | `#E8E3DA` | Primary text, headings, heavy structural lines | AA ✓ (15.3:1) | AA ✓ (13.7:1) |
| **Deep Ink** | `--sumi-deep` | `#2C2C28` | `#D4CFC4` | Secondary surfaces, hover states, overlays | AA ✓ (13.2:1) | AA ✓ (11.3:1) |
| **Washi Cream** | `--washi` | `#F5F0E8` | `#1A1A14` | Page background, card surfaces, negative space (ma) | — (base) | — (base) |
| **Wash Light** | `--washi-light` | `#E8E3DA` | `#2C2824` | Subtle section backgrounds, secondary card surfaces | — | — |
| **Wash Medium** | `--washi-medium` | `#D4CFC4` | `#3D3832` | Borders, dividers, disabled states | — | — |
| **Vermillion** | `--vermillion` | `#C0392B` | `#E85A4A` | Primary actions, accent marks, signature seals, CTAs | AA ✓ (4.8:1) | AA ✓ (5.4:1) |
| **Muted Gold** | `--gold` | `#C9A84C` | `#D4B85C` | Highlights, decorative accents, star indicators (text use not recommended) | — decorative | — decorative |
| **Mist Grey** | `--mist` | `#766C62` | `#8A8278` | Secondary text, metadata, subtitles, placeholders | AA ✓ (4.5:1) | AA ✓ (4.6:1) |
| **Ink Wash** | `--ink-wash` | `rgba(26,26,26,0.06)` | `rgba(245,240,232,0.06)` | Hover overlays, subtle tinting | — | — |
| **Error** | `--error` | `#B73229` | `#E05541` | Validation errors, destructive actions | AA ✓ (5.3:1) | AA ✓ (4.6:1) |
| **Success** | `--success` | `#2D6B3E` | `#4A9E5E` | Success states, confirmation — moss green | AA ✓ (5.6:1) | AA ✓ (5.3:1) |
| **Info** | `--info` | `#4A6E8C` | `#7BA0C7` | Information — muted indigo blue | AA ✓ (4.8:1) | AA ✓ (6.4:1) |

**Correction note:** Earlier versions of this design system claimed incorrect WCAG ratios. The `--mist` token was #B0A898 (actual contrast 2.08:1 on washi — FAILS AA). It has been corrected to #766C62 (4.52:1 — PASSES AA). The `--success` and `--info` tokens were also darkened to meet 4.5:1 minimum. Dark mode `--vermillion` was brightened to #E85A4A to maintain 4.5:1 on dark backgrounds. All color pairs are verified via computed relative luminance.

**Rationale:** Sumi black (#1A1A1A) is slightly warm, matching hand-ground ink stick rather than pure #000 which feels digital and cold. Washi cream (#F5F0E8) has a subtle yellow undertone simulating aged Japanese paper. Vermillion is the traditional seal color — used sparingly for emphasis, never as a background. Gold is muted to avoid gaudiness; it should whisper, not shout.

### 2.2 Usage Rules

```
Primary text      → --sumi on --washi
Secondary text    → --mist on --washi (verified 4.5:1 AA)
Background        → --washi
Accent/CTA        → --vermillion (text or border only, never as bg fill)
Hover states      → --ink-wash overlay or --sumi-deep
Borders/separators → --washi-medium, 1px
Success           → --success borders + text
Error             → --error borders + text
Disabled          → --washi-medium text on --washi-light bg
```

**Anti-patterns:**
- Do NOT use vermillion as a background fill — it only appears as text, border, or small accent (seal mark)
- Do NOT use gold for text — reserved for decorative elements and icons
- Do NOT use pure white (#FFF) — always use washi cream as "white"
- Do NOT use pure black (#000) — always use sumi black
- Do NOT use the old `#B0A898` mist value — it fails WCAG AA at 2.08:1 on washi

### 2.3 Dark Mode Tokens

When dark mode is active, the palette inverts like a night scene from *One Hundred Famous Views of Edo*.

| Token | Light | Dark | Rationale |
|---|---|---|---|
| `--sumi` | `#1A1A1A` | `#E8E3DA` | Text becomes warm light on dark background |
| `--sumi-deep` | `#2C2C28` | `#D4CFC4` | Surface color inverts |
| `--washi` | `#F5F0E8` | `#1A1A14` | Background becomes deep charcoal with warm undertone |
| `--washi-light` | `#E8E3DA` | `#2C2824` | Lighter dark surface |
| `--washi-medium` | `#D4CFC4` | `#3D3832` | Dark mode border |
| `--vermillion` | `#C0392B` | `#E85A4A` | Brighter to maintain 4.5:1 AA contrast on dark bg |
| `--gold` | `#C9A84C` | `#D4B85C` | Slightly brighter on dark bg |
| `--mist` | `#766C62` | `#8A8278` | Darkened in light mode to fix contrast; warm grey in dark mode |
| `--ink-wash` | `rgba(26,26,26,0.06)` | `rgba(245,240,232,0.06)` | Hover overlay inverts |
| `--error` | `#B73229` | `#E05541` | Brighter error for 4.5:1 AA on dark bg |
| `--success` | `#2D6B3E` | `#4A9E5E` | Darkened in light mode to fix contrast |
| `--info` | `#4A6E8C` | `#7BA0C7` | Darkened in light mode to fix contrast |

**Dark mode is not a simple inversion** — it has its own character inspired by Hiroshige's night prints (e.g., *Night Snow at Kambara*, *Sudden Shower*). The charcoal background has a slight warmth (`#1A1A14` mixes a touch of green into the black) to feel like aged indigo-dyed paper.

---

## 3. Typography

### 3.1 Font Families

| Role | Font | Fallback | Weight Usage | Rationale |
|---|---|---|---|---|
| **Display / English headings** | EB Garamond | `Georgia, serif` | 400, 500, 600, 700 | Elegant old-style serif with calligraphic swashes. Pairs with Japanese serif naturally. |
| **Japanese headings & body** | Noto Serif JP | `serif` | 400, 500, 600, 700 | Official Google Font with comprehensive kanji/kana coverage. Designed for screen readability. |
| **UI / English body** | Noto Sans JP | `sans-serif` | 300, 400, 500 | Clean, humanist sans-serif. Light weight (300) for body text to let headings dominate. |
| **Kanji accent** | Yuji Syuku | `serif` | 400 | Brush-style font for single-kanji decorative elements (e.g., series title stamps). Use sparingly — one character per instance. |

**Rationale:** EB Garamond and Noto Serif JP share similar x-heights and stroke contrast, creating harmony when English and Japanese appear on the same page. Noto Sans JP Light provides a deliberate contrast — traditional ink-painting aesthetic for headings, clean modern readability for body.

### 3.2 Type Scale

```
text-xs:   0.75rem  (12px)  — metadata, captions, dates
text-sm:   0.875rem (14px)  — secondary text, nav links
text-base: 1rem     (16px)  — body text, paragraph content
text-lg:   1.125rem (18px)  — emphasized body, subtitles
text-xl:   1.25rem  (20px)  — small section headings
text-2xl:  1.5rem   (24px)  — medium headings, artwork titles
text-3xl:  2rem     (32px)  — large headings, section titles
text-4xl:  2.5rem   (40px)  — page headings, hero subtitles
text-5xl:  3.5rem   (56px)  — hero main titles
text-6xl:  4.5rem   (72px)  — display / impact (rare)
```

### 3.3 Line Heights & Letter Spacing

```
Headings (display):  line-height 1.1,  letter-spacing -0.02em
Headings (JP):       line-height 1.3,  letter-spacing 0.04em
Body:                line-height 1.7,  letter-spacing 0.01em
Small text:          line-height 1.4,  letter-spacing 0.02em
```

**Rationale:** Generous line height on body text (1.7) creates breathing room — the whitespace between lines is part of the composition. Japanese text needs slightly wider letter-spacing for kanji legibility. Headings tighten up for a more authoritative, carved feel.

### 3.4 Usage Rules

```
Page title (h1)            → EB Garamond 600 + Noto Serif JP 600, text-5xl or text-6xl
Section heading (h2)       → EB Garamond 500, text-3xl or text-4xl
Card title                 → Noto Serif JP 600, text-2xl
Artwork title              → Noto Serif JP 500 + English title in EB Garamond 400
Body text                  → Noto Sans JP 300, text-base
Nav links                  → Noto Sans JP 400, text-sm, uppercase, letter-spacing 0.08em
Metadata                   → Noto Sans JP 300, text-xs, --mist color
Japanese accent (single)   → Yuji Syuku 400, used as decorative stamp
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Base unit: **4px**. Every spacing value is a multiple of 4 to ensure rhythm.

```
space-0:   0px
space-1:   4px    — micro spacing, icon padding
space-2:   8px    — tight inner padding
space-3:   12px   — compact spacing
space-4:   16px   — base padding, card padding
space-5:   20px   — comfortable padding
space-6:   24px   — section padding, grid gap (small)
space-8:   32px   — grid gap (large), card margins
space-10:  40px   — section margins
space-12:  48px   — between major sections
space-16:  64px   — between page sections
space-20:  80px   — hero bottom margin
space-24:  96px   — page section dividers
```

**Rationale:** The 4px base creates a subtle order beneath the organic ink aesthetic. Spacing is generous — the gaps between elements are as important as the elements themselves (ma principle).

### 4.2 Grid & Breakpoints

```
Breakpoints:
  sm:   640px   — mobile landscape
  md:   768px   — tablet
  lg:   1024px  — desktop
  xl:   1280px  — wide desktop
  2xl:  1536px  — ultra-wide

Container:
  max-width: 1280px center-aligned
  padding: space-6 (24px) on mobile, space-12 (48px) on desktop

Columns:
  Mobile:  1 column (full width)
  Tablet:  2 columns (gallery), 1 column (content pages)
  Desktop: 3 columns (gallery), 2 columns (content pages)

Grid gap: space-6 (24px) default
```

**Rationale:** The grid is intentionally not rigid — Masonry layout on the gallery page and asymmetric hero composition intentionally break grid constraints. The container max-width of 1280px keeps line lengths readable on wide screens.

---

## 5. Border Radius & Shadows

### 5.1 Border Radius

Ink painting has no perfect circles. All radii are subtle — just enough to soften, never enough to look "modern UI."

```
radius-none: 0px        — straight cuts, structural edges
radius-sm:   2px        — subtle softening, buttons
radius-md:   4px        — card corners, input fields
radius-lg:   8px        — modals, lightbox, larger containers
radius-full: 9999px     — only for the ink drip scroll indicator
```

**Rationale:** A sumi-e brushstroke has soft edges but never perfect curves. Radii are understated — 2-4px feels organic without looking like a "pill button." No component should have large rounded corners unless it serves the ink aesthetic (e.g., the ink-drip scroll indicator).

### 5.2 Shadows

Shadows simulate ink bleeding into paper — wider, softer, with warm undertones.

```
shadow-none:   none
shadow-sm:     0 1px 2px rgba(26,26,26,0.06)          — subtle depth
shadow-md:     0 4px 12px rgba(26,26,26,0.08)          — cards, elevated elements
shadow-lg:     0 8px 24px rgba(26,26,26,0.10)          — modals, dropdowns
shadow-xl:     0 16px 32px rgba(26,26,26,0.12)         — lightbox, overlays
shadow-ink:    0 2px 8px rgba(26,26,26,0.15),          — "ink bleed" — wider spread
               0 0 0 1px rgba(26,26,26,0.04)              simulating feathering
```

Dark mode shadows use the inverse:
```
dark:shadow-*: rgba(245,240,232,0.06–0.12)
```

**Rationale:** Shadows use `--sumi` black with low opacity instead of generic `#000` — this keeps the shadow color consistent with the ink palette. The `shadow-ink` variant has a wider spread to mimic ink feathering on paper.

---

## 6. Motion Tokens

Inspired by the deliberate, unhurried pace of brush calligraphy.

### 6.1 Durations

```
duration-instant:    100ms    — micro-interactions, color changes
duration-fast:       200ms    — hover states, small transitions
duration-normal:     400ms    — standard transitions, modal opens
duration-slow:       800ms    — page transitions, reveals
duration-deliberate: 1200ms   — brushstroke animations, ceremonial transitions
```

**Rationale:** 400ms is the "heartbeat" duration — unhurried but not slow. 1200ms for brushstrokes matches the pace of an actual brush on paper. No animation should feel rushed; every transition reads as intentional.

### 6.2 Easing Curves

```
ease-out-soft:     cubic-bezier(0.16, 1, 0.3, 1)       — standard exit, natural deceleration
ease-in-out-soft:  cubic-bezier(0.65, 0, 0.35, 1)      — fades, smooth entrances and exits
ink-bleed:         cubic-bezier(0.34, 1.56, 0.64, 1)   — slight overshoot mimics ink settling
scroll-ease:       cubic-bezier(0.22, 1, 0.36, 1)       — parallax, scroll-driven reveals
brush-stroke:      cubic-bezier(0.25, 0.1, 0.25, 1)    — SVG path drawing, deliberate line
```

**Rationale:** `ink-bleed` has a subtle overshoot (the spring-like curve) that simulates how ink spreads slightly beyond the brush after a stroke. `brush-stroke` is a slightly slowed linear-ease — it makes SVG path animations feel hand-drawn.

### 6.3 Stagger Timings

```
stagger-fast:    50ms     — micro details within a group
stagger-normal:  100ms    — standard stagger between sibling elements
stagger-slow:    200ms    — deliberate, poetic reveals
stagger-brush:   300ms    — between individual brushstrokes in a sequence
```

### 6.4 Reduced Motion

When `prefers-reduced-motion: reduce` is detected:
- All `duration-*` tokens halve in value (max 200ms)
- Parallax is disabled (no scroll-driven transforms)
- Particles are removed (zero count)
- `pathLength` animations snap to end state immediately
- Stagger delays are set to 0
- Page transitions become instant (oppacity 0→1, no move)

---

## 7. DaisyUI Theme Overrides

DaisyUI is the component library. These overrides transform its default modern look into the sumi-e ink aesthetic.

### 7.1 Theme Configuration

```css
/* tailwind.config.js overrides for daisyUI themes */

:root {
  /* daisyUI semantic tokens mapped to sumi-e palette */
  --p:           #C0392B;     /* primary → vermillion */
  --pf:          #A83228;     /* primary focus → dark vermillion */
  --pc:          #F5F0E8;     /* primary content → washi cream text on primary */
  --s:           #C9A84C;     /* secondary → muted gold */
  --sf:          #B8973B;     /* secondary focus → darker gold */
  --sc:          #1A1A1A;     /* secondary content → sumi text on gold */
  --a:           #C9A84C;     /* accent → gold */
  --af:          #B8973B;     /* accent focus */
  --ac:          #1A1A1A;     /* accent content */
  --n:           #1A1A1A;     /* neutral → sumi black */
  --nf:          #2C2C28;     /* neutral focus */
  --nc:          #F5F0E8;     /* neutral content → washi on sumi */
  --b1:          #F5F0E8;     /* base-100 → washi cream (page bg) */
  --b2:          #E8E3DA;     /* base-200 → wash light (section bg) */
  --b3:          #D4CFC4;     /* base-300 → wash medium (border) */
  --bc:          #1A1A1A;     /* base content → sumi text */
  --in:          #5B7FA5;     /* info */
  --inc:         #F5F0E8;     /* info content */
  --su:          #3A7D4C;     /* success */
  --suc:         #F5F0E8;     /* success content */
  --wa:          #C9A84C;     /* warning → gold */
  --wac:         #1A1A1A;     /* warning content */
  --er:          #B73229;     /* error */
  --erc:         #F5F0E8;     /* error content */

  /* Component overrides */
  --rounded-box:       4px;           /* cards, modals */
  --rounded-btn:       2px;           /* buttons */
  --rounded-badge:     2px;           /* badges */
  --animation-btn:     0.2s;          /* button feedback */
  --animation-input:   0.2s;          /* input focus */
  --btn-focus-scale:   0.97;          /* press effect */
  --tab-border:        1px;
  --tab-radius:        2px;
}
```

### 7.2 Component Override Rules

| DaisyUI Component | Override |
|---|---|
| `btn` | Square corners (radius-sm), sumi border, vermillion for primary only |
| `card` | No shadow by default (use shadow-sm for depth), washi bg, radius-sm |
| `input` | Bottom-border only (like Japanese forms), sumi 1px underline, focus: vermillion |
| `modal` | No rounded top, subtle ink-wash backdrop blur |
| `badge` | Flat, border-only style (outline), no filled backgrounds |
| `menu` | Minimal, no icons, active state = left vermillion border |
| `divider` | Thin sumi line, optional SVG brushstroke replacement |
| `tab` | Underline style only (no box tabs), active = vermillion line |
| `tooltip` | Sumi bg, washi text, no arrow tail |
| `dropdown` | Sumi border only, no shadow, minimal padding |
| `range` | Thin track, vermillion thumb (circle removed — small vertical line) |

**Anti-patterns:**
- No filled buttons with large padding — buttons are minimal, border-only unless primary
- No glassmorphism (blur effects break the ink-on-paper illusion)
- No large badges or pills — sumi-e is not playful
- No gradient backgrounds (pure CSS gradients for ink washes are acceptable — radial, low-opacity)

---

## 8. Component Architecture

### 8.1 Three-Tier Naming

```
┌────────────────────────────────────────────────┐
│                   PAGES                         │
│  DashboardPage, SettingsPage, ...               │
│  (route-level compositions, no reuse)           │
├────────────────────────────────────────────────┤
│                COMPOSITIONS                     │
│  Card, Modal, Table, FormField, Navigation,     │
│  Lightbox, Gallery, Timeline, ...               │
│  (reusable feature assemblies)                  │
├────────────────────────────────────────────────┤
│                PRIMITIVES                       │
│  Button, Input, Select, Checkbox, Radio,        │
│  Badge, Tooltip, Icon, ...                      │
│  (atomic, single-purpose, highly reusable)      │
└────────────────────────────────────────────────┘
```

### 8.2 Naming Conventions

- **Noun-based**: `Button`, `ArtworkCard`, `BrushstrokeDivider`
- **Adjective variants**: `Button.Primary`, `Button.Ghost`, `Button.Danger`
- **No abbreviations**: `Nav` → `Navigation`, `Msg` → `Message`
- **Composition over props**: `Button.Danger` not `<Button variant="danger" />`
- **File = Component**: One component per file, PascalCase filename

### 8.3 Component Design Specifications

#### KakejikuCard (Artwork Card)
```
Purpose: Display an artwork in the style of a Japanese hanging scroll (kakejiku)
Structure:
  ┌─ hanging cord (thin line, --sumi) ───────────┐
  │                                               │
  │  ┌─ top rod (--sumi-deep, 6px height) ────┐  │
  │  │                                         │  │
  │  │  ┌─ mounting (--washi, 4px border) ─┐  │  │
  │  │  │                                   │  │  │
  │  │  │         ARTWORK IMAGE             │  │  │
  │  │  │                                   │  │  │
  │  │  └───────────────────────────────────┘  │  │
  │  │                                         │  │
  │  └── bottom rod (--sumi-deep, 6px) ───────┘  │
  │                                               │
  │  ┌── caption area ────────────────────────┐   │
  │  │  Title (Noto Serif JP 600, text-xl)    │   │
  │  │  Series (Noto Sans JP 300, text-sm)    │   │
  │  │  Vermillion seal (small █ mark)        │   │
  │  └────────────────────────────────────────┘   │
  └───────────────────────────────────────────────┘

Behavior:
  Default:  Flat, like a scroll hanging on a wall
  Hover:    Subtle rotation (-1deg to +1deg) via onMouseMove tracking
            Shadow deepens to shadow-md
            "Lifted" feel as if picking up a physical print
  Focus:    Ink-ring focus outline (2px --vermillion with offset)
  Touch:    Tap to open lightbox (no rotation on mobile)
```

#### BrushstrokeDivider
```
Purpose: Section divider using a unique SVG brushstroke path
Variants:
  1. Mountain (山) — sweeping peak silhouette
  2. Wave (波) — Hokusai-style breaking wave
  3. Bamboo (竹) — diagonal bamboo stalk with node

Spec:
  ViewBox: 0 0 1440 120
  Stroke:  --sumi, width 2-4px variable
  Fill:    none
  Animation:
    Initial: pathLength 0
    In view: pathLength 1, duration 1200ms, ease brush-stroke
    Stagger: 300ms between multiple strokes
```

#### HeroParallax
```
Purpose: Layered depth section at top of home page
Layers:
  z-0:  InkBackground (CSS radial gradients, slow parallax scrollY*0.1)
  z-1:  DistantMountainLayer (SVG/div shapes, scrollY*0.25)
  z-2:  MidgroundElements (floating artwork silhouettes, scrollY*0.5)
  z-3:  FloatingPetals (12-15 cherry blossom particles, scrollY*0.4)
  z-4:  ForegroundContent (title, subtitle, scroll indicator, scrollY*0.8)
  z-10: BrushstrokeReveal (SVG path drawn over hero on scroll)

Mouse parallax:
  Container has perspective: 1000px
  On mouse move: rotateX(-2deg to 2deg), rotateY(-2deg to 2deg)
  Inner layers at translateZ(-200px to 50px)
```

#### GalleryMasonry
```
Purpose: Responsive masonry grid for all artworks
Layout:
  Mobile:   1 column, full width cards
  Tablet:   2 columns, asymmetric heights
  Desktop:  3 columns, masonry arrangement

FilterBar:
  Horizontal scroll on mobile, inline on desktop
  Filter chips: All, Tōkaidō, One Hundred Edo, Other
  Active filter: --vermillion underline, inactive: --mist
  Filter state reflected in URL searchParams (?series=tokaido)

Lightbox integration:
  Click artwork → opens full-screen lightbox
  Lightbox: washi bg, large image, title, description, navigation arrows
  Keyboard: Esc to close, ← → to navigate
  ARIA: role="dialog", aria-label="Artwork lightbox"
```

#### ContactForm
```
Purpose: Message submission form on About page
Fields:
  Name:     text input, bottom-border style
  Email:    text input, bottom-border style
  Message:  textarea, bottom-border style

Validation:
  Inline validation on blur
  Error: --vermillion bottom border + small --error text below
  Success: form disappears, replaced by Japanese-style acknowledgment
  (a single brushstroke character: 承 — "received")

Submission:
  POST to localhost:3001/api/contact
  Loading: vermillion ink dot pulses
  Success: 承 character animates in
  Error: form stays, error message in --vermillion
```

#### Navigation
```
Desktop:
  Horizontal links, uppercase, letter-spacing 0.08em
  Active page: vermillion underline (small, 2px height, width of text)
  Inactive: --mist, no underline
  Hover: --sumi color transition, duration-fast

Mobile (Haiku Nav):
  Closed: Single vertical kanji 道 (Dō — "the way") centered
  Tap expands: Characters of a haiku appear one by one (stagger 50ms)
    "秋深き / 隣は何を / する人ぞ"
    (Autumn deepens / my neighbor / what does he do?)
  After haiku completes: navigation links slide up from below
  Tap outside or link click: collapses back to 道 character
```

---

## 9. Iconography & Imagery

### 9.1 Icon Approach

- **Minimal icons**: Only use where essential (close X, arrow navigation, social links)
- **Style**: Thin stroke (1.5px), no filled icons, rounded line caps
- **Color**: Always --sumi or --mist, never --vermillion (reserved for seal marks)
- **Suggested library**: Lucide icons (thin stroke weight, minimal design) or hand-drawn SVGs

### 9.2 Image Handling

```
All artwork images from Wikimedia Commons.
Treatment:
  Default: Full color (Hiroshige's original woodblock colors)
  On hover: Subtle increase in contrast + saturation (5%)
  Loading: Washi-colored placeholder with subtle ink-wash gradient animation
  Fallback: Washi placeholder with series/manji symbol (卍)
  Priority: Top 3-5 hero images get priority loading; gallery images lazy
```

### 9.3 Seal Marks (Hanko)

```
Vermillion seal marks are a key visual signature.
Usage:
  • Home page hero: Large decorative seal with "広重" (Hiroshige)
  • Each artwork: Small seal mark in card
  • About page: Artist's seal as section ornament

Style:
  Square or circular, --vermillion fill with sumi text
  Rough/irregular edges (simulated via SVG filter or clip-path)
  Size: 24-48px (decorative), 16px (artwork card)
```

---

## 10. Accessibility

### 10.1 Color Contrast (WCAG AA)

All values verified via computed relative luminance per WCAG 2.1.

**Light Mode (--washi #F5F0E8 background):**

| Combination | Ratio | Pass AA (4.5:1) | Pass Large (3:1) |
|---|---|---|---|
| --sumi (#1A1A1A) on --washi | 15.3:1 | ✓ | ✓ |
| --vermillion (#C0392B) on --washi | 4.8:1 | ✓ | ✓ |
| --mist (#766C62) on --washi | 4.5:1 | ✓ | ✓ |
| --gold (#C9A84C) on --washi | 2.0:1 | ✗ decorative only | ✗ |
| --success (#2D6B3E) on --washi | 5.6:1 | ✓ | ✓ |
| --error (#B73229) on --washi | 5.3:1 | ✓ | ✓ |
| --info (#4A6E8C) on --washi | 4.8:1 | ✓ | ✓ |
| --mist (#766C62) on --washi-light | 4.0:1 | ✗ large text only | ✓ |

**Dark Mode (--washi #1A1A14 background):**

| Combination | Ratio | Pass AA (4.5:1) | Pass Large (3:1) |
|---|---|---|---|
| --sumi (#E8E3DA) on --washi | 13.7:1 | ✓ | ✓ |
| --vermillion (#E85A4A) on --washi | 5.4:1 | ✓ | ✓ |
| --mist (#8A8278) on --washi | 4.6:1 | ✓ | ✓ |
| --gold (#D4B85C) on --washi | 9.0:1 | ✓ | ✓ |
| --success (#4A9E5E) on --washi | 5.3:1 | ✓ | ✓ |
| --error (#E05541) on --washi | 4.6:1 | ✓ | ✓ |
| --info (#7BA0C7) on --washi | 6.4:1 | ✓ | ✓ |

**Notes:**
- `--gold` is decorative-only (icons, accents) and is deliberately excluded from text contrast requirements per WCAG SC 1.4.1 (Use of Color)
- `--mist` on `--washi-light` passes large text (3:1) but not normal text — acceptable because mist-on-light-bg is only used for decorative Japanese subtitles at large sizes
- Dark mode `--vermillion` was brightened from #D94A3D to #E85A4A to achieve 4.5:1 minimum on dark backgrounds

### 10.2 Focus States

```
Default focus outline:
  2px solid --vermillion
  offset: 2px
  border-radius: 2px

Ink-ring variant (for decorative elements):
  box-shadow: 0 0 0 2px --vermillion, 0 0 0 4px --washi
  Simulates a vermillion seal stamp ringing the focused element
```

### 10.3 Keyboard Navigation

```
All interactive elements:
  • Tab stops in logical reading order
  • visible focus indicator (ink-ring on anything interactive)
  • Lightbox: arrow keys for navigation, Esc to close
  • Gallery: arrow keys navigate grid when focused
  • Contact form: Tab through fields, Enter to submit
  • Skip-to-content link: first tabbable element on every page
```

### 10.4 ARIA

```
Lightbox:         role="dialog", aria-modal="true", aria-label
Gallery:          role="list", aria-label="Artwork gallery"
Navigation:       role="navigation", aria-label="Main navigation"
Contact form:     All inputs have associated <label>, error messages use aria-describedby
Images:           alt text = artwork title + "by Utagawa Hiroshige" + year
Decorative imgs:  alt="" (empty) with aria-hidden="true"
Page regions:     <main>, <header>, <footer>, <nav> semantic elements
```

### 10.5 Reduced Motion

```
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .parallax-layer { transform: none !important; }
  .floating-petal { display: none !important; }
}
```

---

## 11. Animation Patterns

### 11.1 Scroll-Driven Reveals

```
Pattern: Fade + translate upward as element enters viewport
Framer Motion: motion.div with whileInView
  initial:   { opacity: 0, y: 40 }
  whileInView: { opacity: 1, y: 0 }
  transition: { duration: 0.8, ease: 'easeOutSoft' }
  viewport: { once: true, margin: '-100px' }
```

### 11.2 Page Transitions (Ink Wipe)

```
Pattern: Diagonal ink stroke sweeps across page during navigation
Direction: Top-left to bottom-right (like a right-handed calligrapher's stroke)
Implementation:
  Exit: A pseudo-element or overlay expands from top-left to bottom-right
        Background: --sumi
        Duration: 600ms, ease brush-stroke
  Enter: The same overlay retracts to bottom-right
         Duration: 600ms, ease brush-stroke
  Framer Motion: AnimatePresence wrapping main content
                 with custom exit/enter variants
```

### 11.3 Floating Artworks (Hero)

```
Pattern: Artworks drift in a gentle sinusoidal y-axis oscillation
Each artwork gets:
  y: amplitude 6px, period 4-8s (randomized per instance)
  rotation: amplitude 0.5deg, period 6-10s
  Phase offset: 0.5s between each artwork

Framer Motion animate loop:
  animate: {
    y: [0, -6, 0, 6, 0],
    rotate: [0, -0.5, 0, 0.5, 0]
  }
  transition: {
    duration: 6 + random(0,4),
    repeat: Infinity,
    ease: 'easeInOutSoft'
  }
```

### 11.4 Gallery Cards Hover

```
Pattern: Subtle tilt when hovering over an artwork card
Uses onMouseMove to track cursor position within card
  rotateX: map cursor Y to -1deg to +1deg
  rotateY: map cursor X to -1deg to +1deg
  scale: 1.02
  transition: duration-fast, ease-out-soft
```

### 11.5 Scroll Progress (Ink Drip)

```
Pattern: Vertical ink drip on the right edge of the viewport
Representation: A thin vertical line (--sumi) with a droplet at the bottom
  The line grows from top to bottom as the user scrolls
  At the end, the droplet "drips off" (scale down + fade)

Implementation:
  motion.div, position fixed, right 0, top 0
  Width: 2px, bg: --sumi
  height maps to scroll progress via useScroll + useTransform
  Droplet: small circle at bottom of line (radius-sm)
```

### 11.6 Cherry Blossom Particles

```
Pattern: Floating petals with spiral drift path
Count: 12-15 on desktop, 0 on mobile (reduced-motion: 0)
Each petal:
  Small pink/white ellipse (~12px × 8px) with slight rotation
  Drifts from top of viewport to bottom
  Path: gentle horizontal oscillation + vertical fall + rotation
  Duration: 8-15s (randomized)
  Loop: reset to top when reaching bottom

Framer Motion:
  Animate x, y, rotate in a keyframe array
  Infinite loop with staggered start delays
  Opacity: fade in at top, fade out at bottom
```

### 11.7 Brushstroke SVG

```
Pattern: SVG path draws itself on scroll or on mount
Implementation:
  <motion.path
    initial={{ pathLength: 0 }}
    whileInView={{ pathLength: 1 }}
    transition={{ duration: 1.2, ease: 'brushStroke' }}
  />
  Multiple strokes staggered by stagger-brush (300ms)
```

### 11.8 Staggered Entrances

```
Pattern: Children elements enter sequentially with delay
Implementation:
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } }
  }
  const child = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
```

---

## 12. Dark Mode

### 12.1 Implementation Strategy

```
Approach: CSS custom properties + Tailwind dark mode class strategy
  Tailwind: darkMode: 'class' in tailwind.config.js
  Variables: :root for light mode, .dark class for dark mode overrides
  Toggle: ThemeContext provider + ThemeToggle component
  Persistence: localStorage for user preference
  Default: Match system preference via 'prefers-color-scheme' on first visit
  No DaisyUI data-theme: Colors are handled via CSS variables, class toggle only

Color scheme meta tag:
  <meta name="color-scheme" content="light dark" />
```

### 12.2 Dark Mode Design Principles

1. **Not a simple inversion**: Dark mode has its own character inspired by Hiroshige's night scenes
2. **Warmth preserved**: Dark backgrounds have warm undertones (#1A1A14), not cool greys
3. **Depth through lightness**: Elevation is indicated by getting lighter (closer to washi) rather than darker
4. **Vermillion brightens**: #E85A4A instead of #C0392B to maintain 4.5:1 AA contrast on dark backgrounds
5. **Shadows invert**: Use washi-colored shadows (low opacity) instead of sumi-colored ones

### 12.3 Dark Mode Specific Components

```
InkBackground (dark variant):
  • Radial gradients of deep charcoal (#1A1A14) with subtle cool undertones
  • "Moonlight" overlay — soft cool-white glow from top-right corner

ArtworkCard (dark variant):
  • Mounting: --washi-light (#2C2824) border instead of --washi
  • Shadow: rgba(245,240,232,0.06) instead of rgba(26,26,26,0.08)
  • Text: --sumi (#E8E3DA) on dark background
```

---

## Appendix A: Design Rationale Summary

| Decision | Rationale |
|---|---|
| Sumi #1A1A1A (not #000) | Hand-ground ink is never pure black. Warm undertone matches traditional sumi. |
| Washi #F5F0E8 (not #FFF) | Aged Japanese paper has a soft cream tone. Pure white would look sterile and digital. |
| Vermillion not blue primary | Hiroshige's own seals were vermillion. It's the traditional accent color of Japanese painting. |
| Gold muted #C9A84C (not bright) | Gold leaf in Japanese art is aged and subtle — bright gold would feel gaudy. |
| EB Garamond + Noto Serif JP | Both share similar x-height and stroke contrast. They harmonize when English and Japanese appear together. |
| Generous spacing (ma) | Empty space has weight in Japanese aesthetics. Elements breathe. |
| Subtle radii (2-4px) | Sumi-e edges are organic but not rounded. Large radii feel playful/modern. Wrong mood. |
| 400ms standard duration | Unhurried pace of calligraphy. Fast animations feel impatient. |
| Ink-bleed easing overshoot | Mimics how ink spreads slightly beyond the brush after a stroke settles. |
| CSS transforms (not Three.js) | 20KB vs 150KB+ bundle. CSS 3D transforms achieve convincing depth on their own. |
| Kakejiku card design | Direct visual reference to how Japanese scrolls are mounted and displayed. |
| Haiku nav on mobile | Turns a functional element into a poetic moment. Reinforces the aesthetic. |
| No filled backgrounds on vermillion | Vermillion seal marks are never large filled areas in traditional art — they're small, precise accents. |
| Dark mode ≠ inversion | Each mode has its own character. Dark mode references night scenes from One Hundred Famous Views of Edo. |

---

## Appendix B: File & Directory Naming

```
Pages:        PascalCase (HomePage, GalleryPage, AboutPage)
Compositions: PascalCase (KakejikuCard, BrushstrokeDivider, GalleryMasonry)
Primitives:   PascalCase (Button, Input, Badge)
Hooks:        camelCase with 'use' prefix (useMediaQuery, useReducedMotion)
Utilities:    camelCase (formatDate, fetchArtworks)
Images:       kebab-case (sudden-shower-atake.jpg, night-snow-kambara.jpg)
```

---

*This design system is a living document. Every token, pattern, and convention exists to serve one goal: making the visitor feel like they've stepped into a Hiroshige woodblock print — ancient, tranquil, and alive with subtle motion.*

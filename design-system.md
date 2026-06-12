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
Structure — same physical anatomy:
  ┌─ hanging cord (thin line, --sumi) ───────────┐
  │                                               │
  │  ┌─ top rod (--sumi-deep, 6px height) ────┐  │
  │  │                                         │  │
  │  │  ┌─ mounting (--washi, 4px border) ─┐  │  │
  │  │  │                                   │  │  │
  │  │  │  ┌─ corner accents ────────────┐  │  │  │
  │  │  │  │  (2 SVGs: top-right +       │  │  │  │
  │  │  │  │   bottom-left, draw in on   │  │  │  │
  │  │  │  │   hover via pathLength)     │  │  │  │
  │  │  │  └─────────────────────────────┘  │  │  │
  │  │  │                                   │  │  │
  │  │  │  ┌─ ARTWORK IMAGE ─────────────┐  │  │  │
  │  │  │  │  + ink-wash ripple overlay  │  │  │  │
  │  │  │  │  (cursor-following radial   │  │  │  │
  │  │  │  │  gradient, fades in on      │  │  │  │
  │  │  │  │  hover with ink-bleed ease) │  │  │  │
  │  │  │  └─────────────────────────────┘  │  │  │
  │  │  │                                   │  │  │
  │  │  │  ┌─ seal stamp (蔵) ───────────┐  │  │  │
  │  │  │  │  blooms last with ink-bleed │  │  │  │
  │  │  │  │  overshoot, delayed 200ms   │  │  │  │
  │  │  │  └─────────────────────────────┘  │  │  │
  │  │  └───────────────────────────────────┘  │  │
  │  │                                         │  │
  │  └── bottom rod (--sumi-deep, 6px) ───────┘  │
  │                                               │
  │  ┌── caption area ────────────────────────┐   │
  │  │  Title (Noto Serif JP 600, text-xl)    │   │
  │  │  Series (Noto Sans JP 300, text-sm)    │   │
  │  │  Vermillion seal (small █ mark)        │   │
  │  │  Vermillion underline draws in on      │   │
  │  │  hover (width 0→100%)                  │   │
  │  └────────────────────────────────────────┘   │
  └───────────────────────────────────────────────┘

Behavior — Tripartite Hover (parallax tilt + ink-wash ripple + brushstroke corner frame):
  Default:  Flat, like a scroll hanging on a wall. Shadow: shadow-ink-sm.
  
  Hover Enter (total: ~700ms timeline):
    0ms      Cursor enters card → mouse tracking begins (immediate)
             Parallax tilt initializes: rotateX/Y track cursor position
    0-400ms  Ink-wash ripple: radial gradient spreads from cursor (ink-bleed ease)
    100-500ms Brushstroke corner accents: 2 SVGs draw in via pathLength
              (top-right at 100ms, bottom-left at 300ms)
    200-500ms Depth shadow: transitions from single shadow to triple-layer ink spread
              Shadow intensity maps to tilt angle — deeper tilt → deeper shadow
    300-600ms Seal stamp blooms in: scale 0.3→1.0, rotate -10°→0°
              with ink-bleed overshoot (the final flourish)
  
  Hover Exit (total: ~300ms):
    0ms      Cursor leaves → all effects reverse
    0-100ms  Parallax tilt snaps to flat (no spring, immediate)
    0-200ms  Ink-wash ripple: opacity 1→0
    0-200ms  Corner accents: opacity 1→0 (no reverse pathLength, just fade)
    0-300ms  Shadow returns to shadow-ink-sm
    0-200ms  Seal stamp: opacity 1→0, scale 1→0.8

  Focus:    Ink-ring focus outline (2px --vermillion with offset)
  Touch:    Tap to open lightbox — all hover effects disabled
  Reduced motion: No tilt, no ripple, no pathLength — simple opacity fades only
```

### KakejikuCard — Tripartite Hover Implementation Reference

#### 1. Parallax Tilt (rotateX/Y)

The card sits in a CSS perspective container and tilts toward cursor position, creating 3D "following."

```typescript
// Card outer wrapper — set once, not animated
// perspective: 1000px

// Motion values
const rotateX = useMotionValue(0)
const rotateY = useMotionValue(0)
const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 15 })
const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 15 })

// Mouse tracking on the card's outermost element
const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5  // -0.5 to 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  rotateX.set(y * -10)   // map to -5deg to +5deg
  rotateY.set(x * 10)
}

// Applied style on the card's inner content wrapper:
//   transform: perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)
//   transition: transform 0.1s ease (on exit — snap back)
```

**Rationale:** Max rotation ±5° (increased from current ±1°). The wider range makes the tilt perceptible without distorting the artwork. Spring smoothing (stiffness 150, damping 15) prevents jitter during rapid mouse movement.

#### 2. Ink-Wash Ripple

A radial gradient overlay that follows the cursor, simulating ink bleeding from the point of touch onto the paper.

```typescript
// Ink ripple state — tracks cursor position as percentages
const [ripplePos, setRipplePos] = useState({ x: 50, y: 50 })

// Update on mouse move (combined with tilt handler)
setRipplePos({
  x: (e.clientX - rect.left) / rect.width * 100,
  y: (e.clientY - rect.top) / rect.height * 100,
})

// Ink-wash overlay element:
<motion.div
  className="absolute inset-0 pointer-events-none z-[1]"
  style={{
    background: `radial-gradient(
      circle at ${ripplePos.x}% ${ripplePos.y}%,
      rgba(var(--sumi-rgb), 0.10) 0%,
      rgba(var(--sumi-rgb), 0.04) 20%,
      rgba(var(--sumi-rgb), 0.02) 40%,
      transparent 65%
    )`,
  }}
  initial={{ opacity: 0 }}
  whileHover={{ opacity: 1 }}
  transition={{ duration: 0.4, ease: inkBleed }}
/>
```

**Gradient structure:**
- Center (0%): sumi at 10% opacity — darkest point at cursor
- Inner spread (20%): sumi at 4% — soft ink pool
- Mid spread (40%): sumi at 2% — feathering edge
- Fade out (65%): transparent — clean edge

**Rationale:** The ink-bleed easing curve `[0.34, 1.56, 0.64, 1]` has a subtle overshoot that mimics how ink spreads slightly beyond its final boundary before settling. The gradient is always sumi (never vermillion) — vermillion remains reserved for the seal stamp.

#### 3. Brushstroke Corner Frame

Two small SVG brushstroke marks at top-right and bottom-left corners of the mounting area. They draw in with `pathLength` animation on hover.

```
SVG assets:
  assets/scene-layers/kakejiku-corner-top-right.svg
  assets/scene-layers/kakejiku-corner-bottom-left.svg

Both: viewBox 0 0 44 44, rendered at ~24×24px (inline SVG in the mounting)
```

```typescript
// Top-right corner:
<motion.path
  d="M42 8 Q42 4 38 4 Q30 4 24 8 Q18 12 14 14 Q10 16 8 14 Q6 12 8 6"
  stroke="rgba(var(--sumi-rgb), 0.40)"
  strokeWidth="1.8"
  fill="none"
  strokeLinecap="round"
  initial={{ pathLength: 0, opacity: 0 }}
  whileHover={{ pathLength: 1, opacity: 1 }}
  transition={{ duration: 0.4, ease: brushStroke, delay: 0.1 }}
/>

// Bottom-left corner:
<motion.path
  d="M8 42 Q8 42 10 38 Q14 30 18 26 Q24 20 28 18 Q32 16 36 18 Q38 20 36 24"
  stroke="rgba(var(--sumi-rgb), 0.40)"
  strokeWidth="1.8"
  fill="none"
  strokeLinecap="round"
  initial={{ pathLength: 0, opacity: 0 }}
  whileHover={{ pathLength: 1, opacity: 1 }}
  transition={{ duration: 0.4, ease: brushStroke, delay: 0.3 }}
/>
```

**Rationale:** These corner marks reference the decorative corner reinforcements (kakuri) on high-quality Japanese scroll mounts. They aren't functional — they're visual cues that the card is a physical object with edges and structure. The staggered start (100ms vs 300ms) creates a diagonal drawing sequence: top-right then bottom-left, as if the frame is being painted in a single X-shaped gesture.

#### 4. Layered Depth Shadow

```typescript
// Shadow intensity derived from tilt angle via Framer Motion
const shadowBlur = useTransform(
  [springRotateX, springRotateY],
  ([rx, ry]) => {
    const tilt = Math.min(Math.abs(rx as number) + Math.abs(ry as number), 8)
    return tilt  // 0 (flat) → 8 (max tilt)
  }
)

// Three-layer shadow that intensifies with tilt
// At rest (tilt = 0):
//   box-shadow: 0 1px 2px rgba(var(--sumi-rgb), 0.06)
// At max tilt (tilt = 8):
//   box-shadow:
//     0 4px 12px rgba(var(--sumi-rgb), 0.08),
//     0 12px 24px rgba(var(--sumi-rgb), 0.06),
//     0 24px 48px rgba(var(--sumi-rgb), 0.04)
```

**Rationale:** Multiple box-shadows at increasing blur render in order (first on top). The tightest shadow (4px blur) creates a crisp contact shadow; the middle (12px) simulates ink spread on the surface below; the widest (24px) mimics ambient ink wash. This creates the illusion that the card is physically lifting off a slightly absorbent paper surface.

Dark mode shadows use `rgba(var(--washi-rgb), X)` instead of `rgba(var(--sumi-rgb), X)` to maintain the night-scene character.

#### 5. Seal Stamp — Updated Animation

The existing vermillion seal (蔵) remains but gains a delayed ink-bleed flourish:

```typescript
// Seal stamp — final flourish
<motion.div
  initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
  whileHover={{
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: inkBleed,     // [0.34, 1.56, 0.64, 1] — overshoot
      delay: 0.2,          // Delayed — last effect to trigger
    },
  }}
/>
```

Additional detail on hover: a subtle vermillion glow via CSS:
```css
.seal-vermillion-glow {
  filter: drop-shadow(0 0 4px rgba(var(--vermillion-rgb), 0.25));
}
```

#### Effect Layering Diagram

```
┌── KakejikuCard (perspective: 1000px) ─────────────────────────┐
│                                                                 │
│  rotateX(spring) rotateY(spring)   ← Framer Motion on inner     │
│                                                                 │
│  ┌── shadow (tilt-responsive triple layer) ───────────────────┐ │
│  │                                                             │ │
│  │  ┌── top rod ────────────────────────────────────────────┐ │ │
│  │  │                                                       │ │ │
│  │  │  ┌── mounting ──────────────────────────────────────┐ │ │ │
│  │  │  │                                                    │ │ │ │
│  │  │  │  ┌── corner-top-right (SVG, pathLength 0→1) ───┐  │ │ │ │
│  │  │  │  │                              delay: 100ms    │  │ │ │ │
│  │  │  │  └──────────────────────────────────────────────┘  │ │ │ │
│  │  │  │                                                    │ │ │ │
│  │  │  │  ┌── artwork image ─────────────────────────────┐  │ │ │ │
│  │  │  │  │  ┌── ink-wash ripple overlay ────────────┐   │  │ │ │ │
│  │  │  │  │  │  radial-gradient follows cursor,      │   │  │ │ │ │
│  │  │  │  │  │  opacity 0→1 via inkBleed ease        │   │  │ │ │ │
│  │  │  │  │  └───────────────────────────────────────┘   │  │ │ │ │
│  │  │  │  └──────────────────────────────────────────────┘  │ │ │ │
│  │  │  │                                                    │ │ │ │
│  │  │  │  ┌── corner-bottom-left (SVG, pathLength 0→1) ─┐  │ │ │ │
│  │  │  │  │                               delay: 300ms   │  │ │ │ │
│  │  │  │  └──────────────────────────────────────────────┘  │ │ │ │
│  │  │  │                                                    │ │ │ │
│  │  │  │  ┌── seal stamp 蔵 ──────────────────────────────┐  │ │ │ │
│  │  │  │  │  blooms last: scale 0.3→1.0, inkBleed ease,  │  │ │ │ │
│  │  │  │  │  delay: 200ms                                │  │ │ │ │
│  │  │  │  └──────────────────────────────────────────────┘  │ │ │ │
│  │  │  └────────────────────────────────────────────────────┘ │ │ │
│  │  │                                                       │ │ │
│  │  └── bottom rod ─────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌── caption ─────────────────────────────────────────────────┐ │
│  │  Title + vermillion underline (width 0→100%, delay: 0ms)  │ │ │
│  │  Series · Year + small seal mark                          │ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### Reduced Motion Variant

When `prefers-reduced-motion: reduce` is active:
- No perspective on card wrapper (flat stacking)
- No mouse tracking for tilt
- Ink-wash ripple: opacity snaps to 0.05 (static, no animation)
- Corner accents: opacity fades to 0.3 (no pathLength animation)
- Seal stamp: simple opacity 0→1 over 200ms, no scale/rotate
- Shadow: no change on hover
- Vermillion underline: simple opacity 0→1 (no width animation)

#### Touch Device Behavior

On touch devices (detected via `useMediaQuery('(hover: none)')` or `useReducedMotion`):
- All hover effects disabled
- Tap opens lightbox directly
- No tilt state persists after tap

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

### 11.4 Gallery Cards Hover — Tripartite Animation

```
Pattern: Three coordinated effects that trigger when hovering over an artwork card,
creating the sensation of the artwork "coming to life" under the viewer's gaze.

#### Effect 1: Parallax Tilt (rotateX/Y)
  Tilt toward cursor with spring-smooth interpolation.
  rotateX: map cursor Y to -5deg to +5deg (card tilts forward/back)
  rotateY: map cursor X to -5deg to +5deg (card tilts left/right)
  Spring: stiffness 150, damping 15, mass 1
  On cursor leave: snap to 0 (immediate, no spring — prevents drift)

#### Effect 2: Ink-Wash Ripple
  A radial gradient overlay on the artwork image that spreads from the cursor
  position, simulating ink bleeding outward from the point of touch.
  Gradient: radial at cursor X/Y, sumi at 10%→4%→2%→transparent
  Opacity: 0→1 via ink-bleed easing (overshoot), 400ms
  On cursor leave: opacity 1→0, 200ms, linear

#### Effect 3: Brushstroke Corner Frame
  Two small SVG corner marks at top-right and bottom-left of the card mounting.
  Top-right: pathLength 0→1, 400ms, brush-stroke ease, delay 100ms
  Bottom-left: pathLength 0→1, 400ms, brush-stroke ease, delay 300ms
  On cursor leave: both fade out (opacity 1→0), 200ms, no pathLength reversal

#### Timing Summary (See §8.3 KakejikuCard for full spec):
  Total hover entry: ~700ms
  Total hover exit: ~300ms
  Shadow responds to tilt angle dynamically (see §8.3 for shadow formula)
  Vermillion underline: width 0→100%, 400ms, inkBleed ease
  Seal stamp: scale 0.3→1.0, rotate -10°→0°, 500ms, inkBleed, delay 200ms
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

## 13. 2.5D Scene Layer System

> *"Not the literal, but the essence. Not the object, but the feeling."*
> — Applied to the homepage as a layered 2.5D diorama evoking Hiroshige's landscape composition.

### 13.1 Concept & Design Philosophy

The homepage hero transitions from a photographic artwork display into a **living 2.5D ukiyo-e diorama** — 6 illustrated SVG scene layers stacked in CSS 3D perspective space, each at a different `translateZ` depth, moving at independent speeds on scroll and responding to mouse movement.

**Why 2.5D instead of 3D (Three.js):** Staying within the existing constraint of "Framer Motion + CSS transforms only" (see §6, Design Rationale). CSS 3D perspective achieves convincing parallax depth at zero additional bundle cost. The flat-color, bold-outline illustration style of the SVGs harmonizes with the woodblock print aesthetic — printed ukiyo-e works are inherently flat, and the 2.5D treatment respects that flatness while adding spatial depth.

**Design principles for the scene layers:**

| Principle | Application |
|---|---|
| **Flat color planes** | Every layer uses solid fills (no gradients except atmospheric haze). Mimics woodblock printing where each color is a separate carved block. |
| **Bold sumi outlines** | All shapes have thin (1-1.5px) `--sumi` strokes. This is the defining characteristic of ukiyo-e illustration vs. Western painting. |
| **Compositional depth through overlap** | Layers don't need gradient fade to recede — they simply overlay each other, with nearer layers partially occluding farther ones. |
| **Negative space (ma)** | The scene layers occupy roughly 40% of the viewport. The remaining 60% is washi-cream negative space — the sky, the empty paper. |
| **Diagonal asymmetry** | The composition flows on a diagonal from upper-left (distant mountains) to lower-right (foreground pine). This follows Hiroshige's own compositional preference. |

**Rationale:** The 2.5D scene replaces the current purely abstract CSS-gradient ink washes (InkBackground) with specific pictorial content that directly references Hiroshige's iconography. A visitor now sees *mountains, clouds, waves, and pine* — the same motifs that populate Hiroshige's prints — rather than abstract ink blots. This makes the thematic connection explicit and emotionally resonant.

### 13.2 Layer Specifications

Six layers, ordered back-to-front:

| # | Layer | Name (JP) | Z-Index | translateZ | Scroll Speed | SVG File |
|---|---|---|---|---|---|---|
| 0 | Distant Mountains | 遠山 (Enzan) | 1 | -600px | 0.05x | `assets/scene-layers/layer-00-distant-mountains.svg` |
| 1 | Mid-ground Clouds | 雲 (Kumo) | 2 | -400px | 0.15x | `assets/scene-layers/layer-01-clouds.svg` |
| 2 | Waves / Water | 波 (Nami) | 3 | -200px | 0.30x | `assets/scene-layers/layer-02-waves.svg` |
| 3 | Foreground Pine | 松 (Matsu) | 4 | 50px | 0.50x | `assets/scene-layers/layer-03-pine-branch.svg` |
| 4 | Falling Petals | 花 (Hana) | 5 | 150px | 0.60x | `assets/scene-layers/layer-04-petals.svg` |
| 5 | Vermillion Seal | 朱印 (Shu-in) | 6 | 250px | 0.70x | `assets/scene-layers/layer-05-seal.svg` |

#### Layer 0: Distant Mountains (遠山)

```
Purpose: Farthest background — establishes the horizon and geographic setting
Content:
  • Three receding mountain ranges at decreasing opacity
  • Mt. Fuji silhouette at center with snow cap (washi-cream)
  • Tiny pine silhouettes on ridge lines
  • 5-6 flying birds in V-formation (classic ukiyo-e detail)
  • Subtle horizon haze line
Colors: --mist at 4-8%, --sumi outlines at 8-18%, --washi for snow cap at 50%
Opacity (total layer): 30-50% of normal — recedes into mist
```

#### Layer 1: Mid-ground Clouds (雲)

```
Purpose: Divides the composition into depth planes — clouds partially obscure mountains
Content:
  • 5 horizontal cloud bands with characteristic ukiyo-e curled "fist" ends
  • Clouds at varying heights and widths
  • Thin mist/haze lines between cloud bands
  • Subtle shadow line beneath main cloud for depth
Colors: --washi fill at 75-90%, --sumi outlines at 10-15%
Opacity (total layer): 60-80%
```

#### Layer 2: Waves / Water (波)

```
Purpose: Mid-ground water body with stylized wave patterns — references Hiroshige's water motifs
Content:
  • 3 rows of curved wave arcs at increasing scale
  • Foreground row: larger claw-shaped wave curves with spray detail
  • Foam crests: small white circles at wave peaks
  • Fine spray droplets above breaking waves
  • Water body: subtle indigo-blue wash (Prussian blue — Hiroshige's signature color)
Colors: --info/indigo (#5A7A9A) at 6% for water, --sumi outlines at 12-20%,
        --washi for foam at 35-60%
Opacity (total layer): 50-70%
```

#### Layer 3: Foreground Pine (松)

```
Purpose: Foreground framing element (maegaki) — creates extreme depth through overlap
Content:
  • Main trunk entering from right edge, angling down-left
  • 2 sub-branches forking off at different angles
  • 4 needle clusters at branch tips (radial arrangement of fine lines)
  • Scattered individual needles for organic feel
  • Small pine cone detail on main branch
Colors: --sumi-deep at 28-35% for trunk, --sumi at 15-30% for needles
Opacity (total layer): 60-85%
```

#### Layer 4: Falling Petals (花)

```
Purpose: Animated foreground particles — adds life and impermanence (mujō) theme
Content:
  • SVG <defs> defines two particle shapes: sakura petal (pink) and snow (white)
  • 12-15 particle instances positioned at runtime by Framer Motion
  • Each particle has: drift path, rotation, fade-in/out cycle
  • Dark mode: petals replaced by snow particles (white circles with cross)
Colors: Petals: #E8C8C0 (pale cherry blossom), Snow: --washi at 50%
Opacity (total layer): 40-60%
```

#### Layer 5: Vermillion Seal (朱印)

```
Purpose: Atmospheric watermark — feels like looking through a sealed scroll
Content:
  • Large rectangular seal (~120×120px) with irregular "worn" edges
  • Inner border inset 8px
  • Kanji: 広重 (Hiroshige) in simplified seal-script (tensho) style
  • Secondary smaller circular seal (蔵) at bottom-left for compositional balance
Colors: --vermillion at 6-15% (watermark opacity, not full seal color)
Opacity (total layer): 30-50%
```

### 13.3 Depth Map & Perspective System

#### CSS Perspective Container

```css
.scene-container {
  perspective: 1500px;         /* Focal length for 3D transforms */
  perspective-origin: 50% 40%; /* Slightly above center — looking up at scene */
  transform-style: preserve-3d;
}
```

**How perspective + translateZ creates parallax:**

When the container rotates (on mouse move), each layer at a different `translateZ` moves by a different apparent amount on screen. An element at `translateZ(-600px)` moves very little (appears far away), while an element at `translateZ(250px)` moves noticeably more (appears close). This creates the 3D depth illusion without manual X/Y offset calculations.

#### Per-Layer Transform Map

```
Layer 0 (Mountains):   translateZ(-600px) scale(1.6)  — appears very far, small
Layer 1 (Clouds):      translateZ(-400px) scale(1.4)  — farther
Layer 2 (Waves):       translateZ(-200px) scale(1.15) — moderate distance
Layer 3 (Pine):        translateZ(50px)   scale(0.95) — slightly close
Layer 4 (Petals):      translateZ(150px)  scale(0.9)  — near
Layer 5 (Seal):        translateZ(250px)  scale(0.85) — closest

Scaling compensates for perspective foreshortening:
  Elements at negative translateZ would appear smaller, so we scale up.
  Elements at positive translateZ would appear larger, so we scale down.
```

#### Z-Index Stack

```
Scene Container (fixed, inset-0, z-index: 0, pointer-events: none)
  ├── Layer 0: Mountains   (z: 1)
  ├── Layer 1: Clouds      (z: 2)
  ├── Layer 2: Waves       (z: 3)
  ├── Layer 3: Pine        (z: 4)
  ├── Layer 4: Petals      (z: 5)
  └── Layer 5: Seal        (z: 6)

Content Overlay (relative, z-index: 10)
  ├── Hero title + subtitle
  ├── Floating Artwork Cards (positioned at various depths)
  ├── Section content
  └── Footer
```

### 13.4 Artwork Card Integration (Floating Kakejiku Windows)

Instead of a flat grid, featured artwork cards are placed as **floating kakejiku "windows"** positioned at different depths among the scene layers.

#### Positioning Strategy

| Card | Position | Depth | Size | Scene Context |
|---|---|---|---|---|
| 1. Sudden Shower | Upper-mid left | translateZ(-300px) | 280×200 | Among clouds, partially obscured |
| 2. Plum Park | Center | translateZ(-100px) | 320×230 | Floating above waves |
| 3. Night Snow | Right | translateZ(-50px) | 300×215 | Between cloud bands |
| 4. Naruto Whirlpool | Lower-left | translateZ(80px) | 340×240 | Near the water |
| 5. Fireworks | Upper-right | translateZ(-400px) | 240×170 | Distant, small (in the sky) |
| 6-10 | Below the scene | normal flow | normal | Standard KakejikuCard grid below the hero |

**Rationale for reducing visible floating cards from 10 to 5-6:** Only the most visually striking artworks appear as "floating windows" in the scene. The remaining 4-5 appear below the hero as a standard grid. This prevents visual overload and gives each floating card room to breathe.

#### Floating Window Behavior

Each floating artwork card inherits the KakejikuCard design (§8.3) with these additions:

```
1. Depth offset:  Each card sits at a unique translateZ within the perspective container
2. Sinusoidal drift:  Gentle y-axis oscillation (amplitude 3-6px, period 5-8s)
3. Mouse tilt:  Subtle rotateX/Y following cursor (half the intensity of the scene)
4. Scroll reveal:  Cards fade in + drift up as they reach their scroll position
5. Opacity blend:  Cards at negative translateZ get subtle --mist overlay (atmospheric perspective)
6. No hover tilt on mobile:  Touch devices skip mouse tracking
```

#### Atmospheric Perspective Rule

Cards positioned at more negative `translateZ` (farther away) receive:
- `filter: brightness(0.85) saturate(0.7)` — desaturated and dimmed
- `opacity: 0.7` — slightly transparent

This simulates how distant objects appear in atmospheric haze (a technique Hiroshige mastered).

### 13.5 Interaction Behaviors

#### Scroll Parallax

```
Each layer uses Framer Motion useScroll + useTransform:

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  Layer scroll speeds (applied as translateY):
    Layer 0 (Mountains): useTransform(scrollYProgress, [0, 1], [0, 40])
    Layer 1 (Clouds):    useTransform(scrollYProgress, [0, 1], [0, 100])
    Layer 2 (Waves):     useTransform(scrollYProgress, [0, 1], [0, 200])
    Layer 3 (Pine):      useTransform(scrollYProgress, [0, 1], [0, 350])
    Layer 4 (Petals):    useTransform(scrollYProgress, [0, 1], [0, 420])
    Layer 5 (Seal):      useTransform(scrollYProgress, [0, 1], [0, 500])

  Combined transform per layer:
    style={{ transform: `translateY(${scrollY}px) translateZ(${z}px) scale(${s})` }}
```

**Rationale:** Scroll speeds increase linearly with proximity. The mountains barely move (0.05×), while the seal scrolls at 0.7× the page scroll rate. This matches real-world parallax where distant objects shift less than close ones.

#### Mouse-Move Parallax (CSS 3D)

```
Container: perspective(1500px) on the scene wrapper

On mouse move:
  • Map cursor position (0-1 normalized) to rotateX(-2deg to 2deg), rotateY(-2deg to 2deg)
  • Use useSpring for smooth interpolation (stiffness: 100, damping: 30)
  • Each layer's translateZ creates differential movement automatically
  • Reduced motion: skip all mouse tracking, no perspective on container

Code pattern (see existing HeroParallax.tsx useParallax pattern):
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const rotateY = useTransform(springX, [-5, 5], [-2, 2])
```

#### Scroll-Into-View Card Tilt

Cards below the hero section tilt on scroll entry — a subtle 3D "wake-up" effect:

```
Framer Motion variant:
  hidden: { opacity: 0, y: 60, rotateX: 15, transformPerspective: 1000 }
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
  viewport: { once: true, margin: '-50px' }
```

**Rationale:** The rotateX gives a subtle "flipping up" feel, like a print being lifted from a stack. The perspective foreshortening makes the bottom edge appear closer briefly before the card settles flat. This is imperceptible on conscious level but contributes to the overall materiality.

#### Petal Animation

```
Each petal instance (12-15 total) gets a randomized Framer Motion loop:

  animate: {
    y: ['-10vh', '110vh'],           // Fall from above viewport to below
    x: [0, drift*0.3, drift, drift*0.5, 0],  // Horizontal drift with curve
    rotate: [start, start+180, start+360],     // Spiral rotation
    opacity: [0, 0.5, 0.4, 0.3, 0]            // Fade in/out
  }
  transition: {
    duration: 10-20s (randomized),
    repeat: Infinity,
    delay: 0-15s (staggered start),
    ease: 'linear'
  }

Petals pause on hover:  The scene container can pause particle animations
on mouse enter (reduced cognitive load when reading).

Mobile: 0 petals. Reduced motion: 0 petals.
```

### 13.6 3D Depth Cues Throughout the Page

Beyond the hero scene, the entire page gains subtle 3D enhancements:

#### Layered Section Dividers

Brushstroke dividers and horizontal section separators gain layered shadows that create the illusion of stacked paper:

```css
.section-divider-deep {
  box-shadow:
    0 2px 4px rgba(var(--sumi-rgb), 0.06),    /* tight shadow */
    0 8px 16px rgba(var(--sumi-rgb), 0.04),   /* mid shadow */
    0 20px 40px rgba(var(--sumi-rgb), 0.02);  /* wide wash shadow */
}
```

**Rationale:** Multiple box-shadows at increasing blur/distances simulate how ink spreads on paper layers. Each shadow is progressively wider and lighter, mimicking the "ink bleed" effect of sumi-e on absorbent paper.

#### Navigation Depth

The sticky navigation bar gains a subtle bottom shadow that intensifies on scroll:

```css
.nav-shadow-scrolled {
  box-shadow:
    0 1px 2px rgba(var(--sumi-rgb), 0.04),
    0 4px 12px rgba(var(--sumi-rgb), 0.03);
}
```

The shadow appears only after the user scrolls past the hero — it's absent at page top (where the nav floats above the scene).

#### Footer Depth

The footer receives a subtle top shadow that separates it from the content above, creating a sense of it being a "base" layer:

```css
footer {
  box-shadow:
    0 -1px 2px rgba(var(--sumi-rgb), 0.03),
    0 -4px 12px rgba(var(--sumi-rgb), 0.04);
}
```

### 13.7 Component Architecture Updates

#### New Components

Add to the compositions tier:

| Component | Purpose | Props |
|---|---|---|
| `SceneContainer` | Root wrapper: CSS perspective container, mouse tracking, scroll tracking | `children` |
| `SceneLayer` | Single 2.5D layer: SVG asset, translateZ, scroll speed, opacity | `layerIndex`, `svgPath`, `zDepth`, `scrollSpeed`, `opacity` |
| `FloatingArtworkCard` | KakejikuCard variant positioned at a specific depth in the scene | `artwork`, `zDepth`, `position`, `driftAmplitude` |

#### Modified Components

| Component | Change |
|---|---|
| `HeroParallax` | Scene layers replace abstract CSS-gradient parallax layers. Integrates `SceneContainer` + 6× `SceneLayer` + `FloatingArtworkCard` × 5-6. Title/subtitle remain as foreground overlay. |
| `InkBackground` | Reduced role: now only provides the washi-cream base background `--ink-bg` CSS. The radial gradient washes remain as texture behind the scene layers. |
| `BrushstrokeDivider` | Gains `className` prop for `section-divider-deep` shadow variant. |
| `KakejikuCard` | Gains `perspective` variant — tilt-on-scroll-into-view via `rotateX` variant. New prop: `tiltOnScroll?: boolean`. |

#### Component Dependency Tree (Updated Home Page)

```
HomePage (Server Component)
├── InkBackground (CSS base only — washi texture)
├── SceneContainer (Client) — wrapper with perspective + mouse tracking
│   ├── SceneLayer (Layer 0: Mountains)
│   ├── SceneLayer (Layer 1: Clouds)
│   ├── SceneLayer (Layer 2: Waves)
│   ├── SceneLayer (Layer 3: Pine)
│   ├── SceneLayer (Layer 4: Petals) — with Framer Motion particle instances
│   ├── SceneLayer (Layer 5: Seal)
│   └── FloatingArtworkCard × 5-6 — at various depths
├── Hero Title + Subtitle (foreground overlay, z-index: 20)
├── FeaturedArtworksSection (remaining 4-5 artworks)
│   └── KakejikuCard × 4-5 (with tiltOnScroll variant)
├── Section dividers (with layered shadow tokens)
├── Artist Section
└── Series Overview Section
```

### 13.8 Updated Motion Tokens

Add to `lib/animations.ts`:

```typescript
// ─── 2.5D Scene Tokens ─────────────────────────────────────────────

/** Scene layer scroll speeds (Y displacement per scroll unit) */
export const layerScrollSpeeds = [0.05, 0.15, 0.3, 0.5, 0.6, 0.7] as const

/** Scene layer Z depths */
export const layerZDepths = [-600, -400, -200, 50, 150, 250] as const

/** Layer scale factors (compensating for perspective) */
export const layerScales = [1.6, 1.4, 1.15, 0.95, 0.9, 0.85] as const

/** Scene perspective settings */
export const scenePerspective = {
  container: 1500,
  originX: 50,
  originY: 40,
  mouseRotateRange: 2, // degrees
  springStiffness: 100,
  springDamping: 30,
} as const

// ─── Floating Artwork Tokens ────────────────────────────────────────

export const floatingCardConfigs = [
  { zDepth: -300, x: '15%', y: '20%', scale: 0.75, driftAmp: 4, driftPeriod: 6 },
  { zDepth: -100, x: '40%', y: '35%', scale: 0.85, driftAmp: 5, driftPeriod: 7 },
  { zDepth: -50,  x: '68%', y: '25%', scale: 0.8,  driftAmp: 3, driftPeriod: 5 },
  { zDepth: 80,   x: '22%', y: '55%', scale: 0.9,  driftAmp: 6, driftPeriod: 8 },
  { zDepth: -400, x: '72%', y: '12%', scale: 0.65, driftAmp: 3, driftPeriod: 5 },
] as const

// ─── Scroll-View Tilt ───────────────────────────────────────────────

export const tiltOnScrollVariants: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: 15, transformPerspective: 1000 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: softEase },
  },
}

// ─── Card Hover (Tripartite) — See §8.3 for full spec ─────────────

/** Parallax tilt range in degrees */
export const cardTiltRange = 5 as const

/** Spring config for smooth card tilt interpolation */
export const cardTiltSpring = {
  stiffness: 150,
  damping: 15,
  mass: 1,
} as const

/** Ink-wash ripple: radial gradient centered on cursor position */
export const inkWashGradient = (x: number, y: number): string =>
  `radial-gradient(circle at ${x}% ${y}%, rgba(var(--sumi-rgb), 0.10) 0%, rgba(var(--sumi-rgb), 0.04) 20%, rgba(var(--sumi-rgb), 0.02) 40%, transparent 65%)`

/** Stamp bloom — delayed ink-bleed flourish */
export const sealBloomVariants: Variants = {
  rest: { opacity: 0, scale: 0.3, rotate: -10 },
  hover: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: inkBleed, delay: 0.2 },
  },
}

/** Vermillion underline draw */
export const underlineVariants: Variants = {
  rest: { scaleX: 0 },
  hover: {
    scaleX: 1,
    transition: { duration: 0.4, ease: inkBleed },
  },
}
```

### 13.9 Graphics Asset Index

The 6 SVG scene layer files reside in `assets/scene-layers/`:

| File | Contents | ViewBox |
|---|---|---|
| `layer-00-distant-mountains.svg` | 3 mountain ranges, Mt. Fuji, birds, haze | `0 0 1440 900` |
| `layer-01-clouds.svg` | 5 cloud bands with curled ends, mist lines | `0 0 1440 900` |
| `layer-02-waves.svg` | 3 rows of wave curves, foam crests, spray | `0 0 1440 900` |
| `layer-03-pine-branch.svg` | Trunk, 2 sub-branches, 4 needle clusters, pine cone | `0 0 1440 900` |
| `layer-04-petals.svg` | Sakura petal + snow particle `<defs>` shapes | `0 0 1440 900` |
| `layer-05-seal.svg` | Hiroshige seal (広重) + secondary round seal (蔵) | `0 0 1440 900` |

Each SVG is designed as a **flat, inline-able asset**. The component inlines the SVG markup directly (no `<img>` loading — enables path animation and CSS variable color access). Colors reference CSS variables `var(--sumi)`, `var(--washi)`, etc. through `rgba()` with the appropriate RGB triplets.

### 13.10 Dark Mode Scene Variants

Dark mode transforms the scene from a daylight landscape to a **moonlit night scene** — referencing Hiroshige's famous night prints (Night Snow at Kambara, Sudden Shower, Moon Pine at Ueno).

| Layer | Dark Mode Change |
|---|---|
| Mountains | Opacity reduced by 30%. Haze color shifts to cool `--info` blue. Birds removed. |
| Clouds | Fill shifts from `--washi` to `rgba(44,40,36,0.7)` (dark charcoal). Outlines at 25% opacity. |
| Waves | Indigo water intensifies (opacity doubles). Foam crests shift to pale blue-white. |
| Pine | Trunk opacity increases (against lighter dark background). Needles reduce opacity. |
| Petals | Cherry blossom replaced by snow particles (white circles with cross). |
| Seal | Vermillion opacity reduces to 4-6%. Becomes a subtle moon-like watermark. |

**Implementation approach:** Each SceneLayer accepts a CSS class that applies dark-mode overrides via CSS custom properties on the SVG elements. No separate SVG files needed — the existing SVGs use relative colors that adapt via CSS variable changes in the `.dark` class.

### 13.11 Accessibility & Reduced Motion

```
Reduced motion behaviors:
  1. Scene parallax disabled:  All layers render at their base translateZ with no scroll or mouse movement.
  2. Petal particles removed:  FloatingPetals count = 0.
  3. Floating artwork drift:  No sinusoidal y-oscillation. Cards remain static.
  4. Card scroll-tilt:  rotateX variant skipped — cards fade in with opacity only.
  5. Mouse tracking:  No event listeners attached for mouse parallax.
  6. Scene container:  No perspective CSS property set — flat stacking.

ARIA considerations:
  • Scene container: role="presentation", aria-hidden="true"
  • All scene layers: aria-hidden="true" (decorative, not content)
  • Floating artwork cards: retain their full ARIA as interactive elements
  • Scene does not interfere with keyboard navigation or tab order
```

### 13.12 Implementation Notes for Frontend Mode

1. **Inline SVGs**: Import each layer SVG as a string or embed the markup directly in the SceneLayer component. Do NOT use `<Image>` or `<img>` — inline SVGs enable CSS variable access and potential future path animation.

2. **Layer layout**: Each SceneLayer is `absolute inset-0` within the SceneContainer, with its own `transform: translateZ() scale()` and scroll-driven `translateY`.

3. **Mouse tracking**: Attach `onMouseMove` to the SceneContainer (not `window` — this scopes the effect to the hero section and prevents interference with other page interactions).

4. **Scroll tracking**: `useScroll` with `target: sceneContainerRef`, `offset: ['start start', 'end start']`. The scene container should span at minimum `200vh` height (current hero pattern) so there's enough scroll distance for the parallax to unfold.

5. **Floating artwork cards**: Use Framer Motion `animate` loops for the sinusoidal drift. Each card gets a unique random seed for period/amplitude/delay (use `useMemo` with stable random per card ID).

6. **Dark mode CSS**: Layer SVGs use `rgba(var(--sumi-rgb), X)` patterns so they automatically respond to dark mode CSS variable changes.

7. **Performance**: 
   - Use `will-change: transform` on each SceneLayer
   - Petal count: 12 max (reduced from current 15)
   - All transforms are GPU-composited (no layout triggers)
   - `transform: translate3d()` for hardware acceleration

---

*This design system is a living document. Every token, pattern, and convention exists to serve one goal: making the visitor feel like they've stepped into a Hiroshige woodblock print — ancient, tranquil, and alive with subtle motion.*

import type { Transition, Variants } from 'framer-motion'

// ─── Easing Curves ─────────────────────────────────────────────────

/** Ink-bleed overshoot: used for decorative reveals, stamp effects */
export const inkBleed: [number, number, number, number] = [0.34, 1.56, 0.64, 1]

/** Soft entrance: used for cards, sections, staggered items */
export const softEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Brush-stroke: used for SVG path reveals, ink-wipe transitions */
export const brushStroke: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

/** Standard ease-in-out for micro-interactions */
export const easeInOut: [number, number, number, number] = [0.65, 0, 0.35, 1]

// ─── Duration Tokens ───────────────────────────────────────────────

export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  deliberate: 1.2,
  reveal: 0.6,
} as const

// ─── Shared Transitions ────────────────────────────────────────────

export const fadeInUp: Transition = {
  duration: duration.reveal,
  ease: softEase,
}

export const fadeIn: Transition = {
  duration: duration.normal,
  ease: softEase,
}

export const inkWipe: Transition = {
  duration: 0.6,
  ease: brushStroke,
}

export const inkReveal: Transition = {
  duration: duration.slow,
  ease: inkBleed,
}

export const staggerItem: Transition = {
  duration: duration.reveal,
  ease: softEase,
}

// ─── Common Variants ───────────────────────────────────────────────

/** Fade + slide up for scroll-reveal items */
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

/** Simple opacity fade */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

/** Ink-blur entrance (for hero text) */
export const blurInVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0)' },
}

/** Scale + fade (for modal/lightbox) */
export const scaleInVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0, y: 20 },
  visible: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.95, opacity: 0, y: 20 },
}

/** Reduced motion fallback — simple fade */
export const reducedFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

// ─── Card Hover Tokens (Tripartite) ───────────────────────────────

/** Parallax tilt: max degrees of rotation from center */
export const cardTiltRange = 5 as const

/** Spring config for card tilt smoothing */
export const cardTiltSpring = {
  stiffness: 150,
  damping: 15,
  mass: 1,
} as const

/** Ink-wash ripple gradient template (fill in cursor X%, Y% at runtime) */
export const inkWashGradient = (
  x: number,
  y: number,
): string =>
  `radial-gradient(circle at ${x}% ${y}%, rgba(var(--sumi-rgb), 0.10) 0%, rgba(var(--sumi-rgb), 0.04) 20%, rgba(var(--sumi-rgb), 0.02) 40%, transparent 65%)`

/** Corner accent SVG pathLength animation */
export const cornerAccentTransition = (delay: number) =>
  ({
    duration: 0.4,
    ease: brushStroke,
    delay,
  }) as Transition

/** Card shadow interpolator: maps tilt intensity (0-8) to shadow CSS */
export function cardShadow(tiltIntensity: number): string {
  const t = Math.min(tiltIntensity, 8)
  const y1 = 1 + (t / 8) * 3       // 1 → 4
  const blur1 = 2 + (t / 8) * 10   // 2 → 12
  const blur2 = 12 + (t / 8) * 12  // 12 → 24
  const blur3 = 24 + (t / 8) * 24  // 24 → 48
  const a1 = 0.06 + (t / 8) * 0.02
  const a2 = 0.04 + (t / 8) * 0.02
  const a3 = 0.02 + (t / 8) * 0.02

  return [
    `0 ${y1}px ${blur1}px rgba(var(--sumi-rgb), ${a1})`,
    `0 ${blur1}px ${blur2}px rgba(var(--sumi-rgb), ${a2})`,
    `0 ${blur2}px ${blur3}px rgba(var(--sumi-rgb), ${a3})`,
  ].join(', ')
}

// ─── Card Hover Variants ───────────────────────────────────────────

/** Ink-wash ripple enter/exit */
export const rippleVariants: Variants = {
  rest: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { duration: 0.4, ease: inkBleed },
  },
}

/** Seal stamp bloom — delayed ink-bleed flourish */
export const sealBloomVariants: Variants = {
  rest: { opacity: 0, scale: 0.3, rotate: -10 },
  hover: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: inkBleed, delay: 0.2 },
  },
}

/** Vermillion underline draw-in */
export const underlineVariants: Variants = {
  rest: { scaleX: 0 },
  hover: {
    scaleX: 1,
    transition: { duration: 0.4, ease: inkBleed },
  },
}

// ─── 2.5D Scene Tokens ─────────────────────────────────────────────

/** Scene layer scroll speeds (Y displacement per scroll unit) */
export const layerScrollSpeeds = [0.05, 0.15, 0.3, 0.5, 0.6, 0.7] as const

/** Scene layer Z depths (px) */
export const layerZDepths = [-600, -400, -200, 50, 150, 250] as const

/** Layer scale factors (compensating for perspective foreshortening) */
export const layerScales = [1.6, 1.4, 1.15, 0.95, 0.9, 0.85] as const

/** Scene perspective settings */
export const scenePerspective = {
  container: 1500,
  originX: 50,
  originY: 40,
  mouseRotateRange: 2,
  springStiffness: 100,
  springDamping: 30,
} as const

/** Floating artwork card configurations */
export const floatingCardConfigs = [
  { zDepth: -300, x: '15%', y: '20%', scale: 0.75, driftAmp: 4, driftPeriod: 6 },
  { zDepth: -100, x: '40%', y: '35%', scale: 0.85, driftAmp: 5, driftPeriod: 7 },
  { zDepth: -50,  x: '68%', y: '25%', scale: 0.8,  driftAmp: 3, driftPeriod: 5 },
  { zDepth: 80,   x: '22%', y: '55%', scale: 0.9,  driftAmp: 6, driftPeriod: 8 },
  { zDepth: -400, x: '72%', y: '12%', scale: 0.65, driftAmp: 3, driftPeriod: 5 },
] as const

/** Scroll-into-view tilt variant (for tiltOnScroll) */
export const tiltOnScrollVariants: Variants = {
  hidden: { opacity: 0, y: 60, rotateX: 15, transformPerspective: 1000 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: softEase },
  },
}

// ─── Stagger Helpers ───────────────────────────────────────────────

export function staggerDelay(index: number, baseDelay = 0.1): number {
  return baseDelay + index * 0.1
}

export function charDelay(index: number, baseDelay = 0.8, perChar = 0.12): number {
  return baseDelay + index * perChar
}

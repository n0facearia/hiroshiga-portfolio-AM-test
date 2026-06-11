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

// ─── Stagger Helpers ───────────────────────────────────────────────

export function staggerDelay(index: number, baseDelay = 0.1): number {
  return baseDelay + index * 0.1
}

export function charDelay(index: number, baseDelay = 0.8, perChar = 0.12): number {
  return baseDelay + index * perChar
}

/**
 * Component: BrushstrokeUnderline
 * What it does: Wraps interactive text with a brushstroke underline that draws
 *   in on hover (SVG pathLength), shifts text color to vermillion, and
 *   increases letter-spacing slightly for a "settling ink" feel.
 * Props:
 *   children: ReactNode — the clickable text/link/button to wrap
 *   className?: string — additional classes for the outer wrapper
 *   isHovered?: boolean — external hover control (for elements inside larger
 *     interactive areas where the wrapper can't capture mouse events)
 * Renders: A span containing children + an SVG brushstroke underline
 * Does NOT do: Handle click events, change routing, manage focus
 * Gotchas: Wrap the ENTIRE interactive element (not just text inside a button)
 *   so that the hover area matches the clickable area. For elements where that's
 *   impractical (FilterBar tabs), pass isHovered from parent state.
 *   When isHovered is provided, the component defers hover detection to parent.
 *   All effects disabled under prefers-reduced-motion: static underline only.
 */

'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsHoverable } from '@/hooks/useIsHoverable'
import { brushStroke } from '@/lib/animations'

interface BrushstrokeUnderlineProps {
  children: React.ReactNode
  className?: string
  isHovered?: boolean
}

export function BrushstrokeUnderline({
  children,
  className = '',
  isHovered: externalHover,
}: BrushstrokeUnderlineProps) {
  const reduced = useReducedMotion()
  const canHover = useIsHoverable()
  const [internalHover, setInternalHover] = useState(false)

  // Use external hover control if provided, otherwise use internal
  const hovered = externalHover ?? internalHover

  const handleMouseEnter = useCallback(() => {
    if (externalHover === undefined) setInternalHover(true)
  }, [externalHover])

  const handleMouseLeave = useCallback(() => {
    if (externalHover === undefined) setInternalHover(false)
  }, [externalHover])

  // ─── Touch device: no hover effects, just render children ─────
  if (!canHover) {
    return (
      <span className={`inline-flex ${className}`}>
        {children}
      </span>
    )
  }

  // ─── Reduced motion: simple static underline ─────────────────
  if (reduced) {
    return (
      <span className={`group relative inline-flex ${className}`}>
        <span className="transition-[color,letter-spacing] duration-200 ease-out group-hover:text-vermillion group-hover:tracking-[0.01em]">
          {children}
        </span>
        {/* Static underline — opacity toggle only */}
        <span
          className="absolute -bottom-0.5 left-0 w-full h-px bg-vermillion pointer-events-none transition-opacity duration-200"
          style={{ opacity: hovered ? 1 : 0.3 }}
        />
      </span>
    )
  }

  // ─── Full animation ──────────────────────────────────────────
  return (
    <span
      className={`group relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Text wrapper — vermillion + letter-spacing on hover via CSS */}
      <span className="transition-[color,letter-spacing] duration-200 ease-out group-hover:text-vermillion group-hover:tracking-[0.01em]">
        {children}
      </span>

      {/* SVG brushstroke underline — draws left to right */}
      <span className="absolute -bottom-0.5 left-0 w-full h-[2px] overflow-visible pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 2"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Primary brushstroke */}
          <motion.path
            d="M0,1 L100,1"
            style={{ stroke: 'var(--vermillion)' }}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: hovered ? 1 : 0,
              opacity: hovered ? 1 : 0,
            }}
            transition={{
              pathLength: hovered
                ? { duration: 0.4, ease: brushStroke }
                : { duration: 0.2 },
              opacity: { duration: 0.2 },
            }}
          />
          {/* Secondary ink-bleed texture stroke — lighter, slightly offset */}
          <motion.path
            d="M0,1 L100,1"
            style={{ stroke: 'rgba(var(--vermillion-rgb), 0.25)' }}
            strokeWidth="0.6"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: hovered ? 1 : 0,
              opacity: hovered ? 1 : 0,
            }}
            transition={{
              pathLength: hovered
                ? { duration: 0.5, ease: brushStroke, delay: 0.05 }
                : { duration: 0.2 },
              opacity: { duration: 0.2 },
            }}
          />
        </svg>
      </span>
    </span>
  )
}

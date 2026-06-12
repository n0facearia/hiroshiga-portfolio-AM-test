/**
 * Component: SceneLayer
 * What it does: Renders a single 2.5D scene layer — an inline SVG positioned
 *   at a specific translateZ depth within the SceneContainer. The layer moves
 *   at its own scroll speed (translateY based on scroll progress) and at its
 *   own Z-depth for mouse parallax.
 * Props:
 *   layerIndex: number — which layer (0-5), used to look up zDepth, scrollSpeed, scale
 *   className?: string — additional classes for dark mode overrides
 * Renders: An absolutely-positioned div containing the inline SVG for this layer.
 *   The div is inset-0 within the SceneContainer, with:
 *     transform: translateZ(zDepth) scale(scale)
 *     will-change: transform
 *     The scroll-driven translateY is applied via Framer Motion useTransform
 * Does NOT do: Handle mouse events (delegated to SceneContainer), animate
 *   individual SVG paths, manage petal particle instances.
 * Gotchas: aria-hidden="true" since layers are purely decorative. SVG content
 *   is inlined (not <img>) for CSS variable access (dark mode). Under reduced
 *   motion, no translateZ, scroll-movement, or will-change is applied.
 */

'use client'

import { motion, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { layerZDepths, layerScales, layerScrollSpeeds } from '@/lib/animations'
import { LAYER_SVGS, type LayerIndex } from '@/lib/scene-layers'
import { useScroll } from 'framer-motion'
import { useRef } from 'react'

interface SceneLayerProps {
  /** Which layer (0-5). Determines SVG, zDepth, scrollSpeed, and scale. */
  layerIndex: LayerIndex
  /** Additional CSS classes (e.g. dark-mode overrides) */
  className?: string
}

export function SceneLayer({ layerIndex, className = '' }: SceneLayerProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const zDepth = layerZDepths[layerIndex]
  const scale = layerScales[layerIndex]
  const speed = layerScrollSpeeds[layerIndex]
  const svgContent = LAYER_SVGS[layerIndex]

  // ─── Scroll-driven translateY ────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -speed * 500])

  if (!svgContent) return null

  return (
    <motion.div
      ref={ref}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
      style={
        reduced
          ? { zIndex: layerIndex + 1 }
          : {
              zIndex: layerIndex + 1,
              willChange: 'transform',
            }
      }
    >
      {/* Inner transform layer — translateZ for perspective, translateY for scroll */}
      <motion.div
        className="w-full h-full"
        style={
          reduced
            ? {}
            : {
                transform: `translateZ(${zDepth}px) scale(${scale})`,
                transformStyle: 'preserve-3d',
                y: scrollY,
              }
        }
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </motion.div>
  )
}

/**
 * Page: HeroParallax
 * What it does: Renders the homepage hero section with the 2.5D ukiyo-e
 *   diorama — 6 illustrated scene layers (mountains, clouds, waves, pine,
 *   petals, seal) at different translateZ depths, 5 floating artwork cards,
 *   and a foreground overlay with title/subtitle/scroll indicator.
 * Route: / (home page)
 * Data needed: artworks: Artwork[] (featured artworks from getFeaturedArtworks)
 * Composes: SceneContainer, SceneLayer (×6), FloatingArtworkCard (×5),
 *   FloatingPetals, motion.div for title/subtitle
 * Auth: public
 */

'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { Artwork } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SceneContainer } from './SceneContainer'
import { SceneLayer } from './SceneLayer'
import { FloatingArtworkCard } from './FloatingArtworkCard'
import { FloatingPetals } from './FloatingPetals'
import { floatingCardConfigs } from '@/lib/animations'

interface HeroParallaxProps {
  artworks: Artwork[]
}

const TITLE_CHARS = '木版画の世界'
const TITLE_ENGLISH = 'Hiroshige'
const SUBTITLE = 'Utagawa Hiroshige · 1797–1858'

export function HeroParallax({ artworks }: HeroParallaxProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // Take first 5 artworks for floating cards
  const floatingArtworks = artworks.slice(0, 5)

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh]"
      aria-label="Hero showcase"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ─── 2.5D Scene Diorama ──────────────────────────────── */}
        <SceneContainer>
          {/* Layer 0: Distant Mountains */}
          <SceneLayer layerIndex={0} />

          {/* Layer 1: Mid-ground Clouds */}
          <SceneLayer layerIndex={1} />

          {/* Layer 2: Waves / Water */}
          <SceneLayer layerIndex={2} />

          {/* Layer 3: Foreground Pine */}
          <SceneLayer layerIndex={3} />

          {/* Layer 4: Petal SVG defs (animated by FloatingPetals below) */}
          <SceneLayer layerIndex={4} />

          {/* Layer 5: Vermillion Seal */}
          <SceneLayer layerIndex={5} />

          {/* Floating artwork cards — positioned at various depths */}
          {floatingArtworks.map((artwork, i) => {
            const config = floatingCardConfigs[i]
            if (!config) return null
            return (
              <FloatingArtworkCard
                key={artwork.id}
                artwork={artwork}
                config={config}
                index={i}
              />
            )
          })}
        </SceneContainer>

        {/* ─── Floating Petals (animated particles) ────────────── */}
        {!reduced && <FloatingPetals count={12} />}

        {/* ─── Foreground Content Overlay ──────────────────────── */}
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none"
          aria-hidden="false"
        >
          {/* Blurred backdrop behind title text — enhances readability
              in both themes (warm glow in light mode, contrast shield in dark) */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl aspect-[4/3] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(var(--washi-rgb), 0.85) 0%, rgba(var(--washi-rgb), 0.50) 30%, rgba(var(--washi-rgb), 0.20) 60%, transparent 75%)',
              filter: 'blur(30px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            aria-hidden="true"
          />

          {/* English title */}
          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl text-sumi text-center leading-none tracking-tight mb-2"
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.3,
            }}
          >
            {TITLE_ENGLISH}
          </motion.h1>

          {/* Japanese title — character by character with ink-bleed */}
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {TITLE_CHARS.split('').map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                className="font-display-jp text-2xl md:text-4xl text-sumi"
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                transition={{
                  duration: 0.8,
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: 0.8 + i * 0.12,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            className="font-body text-xs md:text-sm text-sumi mt-6 tracking-[0.15em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            {SUBTITLE}
          </motion.p>

          {/* Scroll indicator */}
          {!reduced && (
            <motion.div
              className="absolute bottom-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.5 }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-sumi uppercase tracking-[0.2em] font-body">
                  Scroll
                </span>
                <motion.div
                  className="w-px h-8 bg-sumi/30"
                  animate={{ height: [16, 32, 16] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

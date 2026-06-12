/**
 * Component: FloatingArtworkCard
 * What it does: An artwork card that floats at a specific translateZ depth
 *   within the SceneContainer 2.5D diorama. Has gentle sinusoidal drift
 *   (y-axis oscillation + rotation), scroll reveal fade-in, mouse tilt
 *   at half scene intensity, and atmospheric perspective at negative depths.
 * Props:
 *   artwork: Artwork — the artwork data
 *   config: { zDepth, x, y, scale, driftAmp, driftPeriod } — positioning
 *     and drift parameters from floatingCardConfigs
 *   index?: number — stagger delay for scroll reveal
 *   onOpen?: (id: number) => void — lightbox trigger
 * Renders: A kakejiku-styled floating card with mounting border, image,
 *   vermillion seal, and caption. Positioned absolutely within SceneContainer
 *   at the specified translateZ.
 * Does NOT do: Fetch artwork data, manage lightbox state, render the full
 *   KakejikuCard tripartite hover (simplified to tilt + basic hover).
 * Gotchas: All motion disabled under prefers-reduced-motion. Cards at negative
 *   translateZ receive a --mist atmospheric overlay. The drift animation is
 *   randomized per card ID for natural variation.
 */

'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, animate, useInView } from 'framer-motion'
import type { Artwork } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cardTiltRange, cardTiltSpring } from '@/lib/animations'

interface FloatingCardConfig {
  zDepth: number
  x: string
  y: string
  scale: number
  driftAmp: number
  driftPeriod: number
}

interface FloatingArtworkCardProps {
  artwork: Artwork
  config: FloatingCardConfig
  index?: number
  onOpen?: (id: number) => void
}

export function FloatingArtworkCard({
  artwork,
  config,
  index = 0,
  onOpen,
}: FloatingArtworkCardProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const [isHovered, setIsHovered] = useState(false)

  // ─── Tilt motion values (half scene intensity) ─────────────────
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  // ─── Stable random seed per artwork ID ─────────────────────────
  const driftSeed = useMemo(() => {
    const id = artwork.id || index
    return {
      yAmp: config.driftAmp + ((id * 7) % 3 - 1),
      period: config.driftPeriod + ((id * 13) % 4),
      rotAmp: 0.3 + ((id * 11) % 5) * 0.1,
      delay: (id * 0.5) % 3,
      phase: (id * 1.7) % (Math.PI * 2),
    }
  }, [artwork.id, index, config.driftAmp, config.driftPeriod])

  // ─── Atmospheric perspective overlay ───────────────────────────
  const hasAtmoOverlay = config.zDepth < 0
  const atmoOpacity = useMemo(() => {
    if (!hasAtmoOverlay) return 0
    // More negative = more atmosphere
    const t = Math.min(Math.abs(config.zDepth) / 600, 1)
    return t * 0.12
  }, [config.zDepth, hasAtmoOverlay])

  // ─── Mouse tilt (half intensity) ───────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isHovered || reduced) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      animate(rotateX, y * -(cardTiltRange), {
        type: 'spring',
        ...cardTiltSpring,
      })
      animate(rotateY, x * cardTiltRange, {
        type: 'spring',
        ...cardTiltSpring,
      })
    },
    [isHovered, reduced, rotateX, rotateY],
  )

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (!reduced) {
      animate(rotateX, 0, { duration: 0.1, ease: 'easeOut' })
      animate(rotateY, 0, { duration: 0.1, ease: 'easeOut' })
    }
  }, [reduced, rotateX, rotateY])

  // ─── Drift animation ───────────────────────────────────────────
  const driftAnimate = reduced
    ? {}
    : {
        y: [
          0,
          -driftSeed.yAmp,
          0,
          driftSeed.yAmp,
          0,
        ],
        rotate: [
          0,
          -driftSeed.rotAmp,
          0,
          driftSeed.rotAmp,
          0,
        ],
      }

  const driftTransition = reduced
    ? {}
    : {
        duration: driftSeed.period,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: driftSeed.delay,
      }

  return (
    <motion.div
      ref={ref}
      className="absolute cursor-pointer"
      style={{
        left: config.x,
        top: config.y,
        zIndex: 10 - index,
      }}
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 30 }
      }
      animate={
        isInView
          ? reduced
            ? { opacity: 1 }
            : { opacity: 1, y: 0 }
          : {}
      }
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2 + index * 0.15,
      }}
      onClick={() => onOpen?.(artwork.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen?.(artwork.id)
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${artwork.title} in lightbox`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer transform — translateZ + scale from config */}
      <motion.div
        style={
          reduced
            ? {}
            : {
                transform: `translateZ(${config.zDepth}px) scale(${config.scale})`,
                transformStyle: 'preserve-3d',
                rotateX,
                rotateY,
              }
        }
        animate={driftAnimate}
        transition={driftTransition}
        whileHover={reduced ? {} : { scale: config.scale * 1.05 }}
      >
        {/* Kakejiku mounting */}
        <div
          className="relative overflow-hidden"
          style={{
            width: '280px',
            maxWidth: 'min(28vw, 280px)',
            borderRadius: '2px',
            boxShadow: '0 2px 12px rgba(var(--sumi-rgb), 0.08)',
          }}
        >
          {/* Top wooden rod */}
          <div
            className="h-[6px] rounded-t-sm"
            style={{
              background: 'linear-gradient(180deg, var(--sumi-deep) 0%, var(--sumi-deep) 50%, transparent 100%)',
            }}
          />

          {/* Image area */}
          <div className="relative aspect-[3/2] bg-washi-light/50">
            <Image
              src={artwork.wikimedia_thumb || artwork.wikimedia_url}
              alt={`${artwork.title} by Utagawa Hiroshige${artwork.year ? `, ${artwork.year}` : ''}`}
              fill
              className="object-contain p-1"
              sizes="280px"
              quality={85}
            />

            {/* Atmospheric perspective overlay (for negative depth cards) */}
            {hasAtmoOverlay && (
              <div
                className="absolute inset-0 pointer-events-none z-[2]"
                style={{
                  background: `rgba(var(--mist-rgb), ${atmoOpacity})`,
                }}
                aria-hidden="true"
              />
            )}

            {/* Subtle hover glow */}
            <div
              className="absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                boxShadow: isHovered ? 'inset 0 0 20px rgba(var(--vermillion-rgb), 0.06)' : 'none',
              }}
              aria-hidden="true"
            />
          </div>

          {/* Bottom wooden rod */}
          <div
            className="h-[4px] rounded-b-sm"
            style={{
              background: 'linear-gradient(0deg, var(--sumi-deep) 0%, var(--sumi-deep) 50%, transparent 100%)',
            }}
          />

          {/* Caption area */}
          <div className="px-2 py-1.5 bg-washi">
            <h3 className="font-display-jp text-[11px] text-sumi leading-tight truncate">
              {artwork.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] text-mist font-body truncate">
                {artwork.series} · {artwork.year}
              </span>
              <span className="inline-block w-1.5 h-1.5 bg-vermillion rounded-ink flex-shrink-0" aria-hidden="true" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

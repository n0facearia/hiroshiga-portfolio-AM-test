/**
 * Component: KakejikuCard
 * What it does: Displays an artwork in a Japanese hanging scroll (kakejiku) layout
 *   with a tripartite hover animation: parallax tilt + ink-wash ripple +
 *   brushstroke corner frame + seal stamp bloom + dynamic depth shadow.
 * Props:
 *   artwork: Artwork — the artwork data
 *   index?: number — stagger delay for scroll-reveal entrance
 *   onOpen?: (id: number) => void — lightbox trigger
 *   priority?: boolean — next/image priority hint
 * Renders: A full kakejiku card with hanging cord, wooden rods, mounting with
 *   artwork image, corner brushstroke accents, ink-wash ripple, seal stamp,
 *   caption with vermillion underline
 * Does NOT do: Fetch artwork data, manage lightbox state, handle keyboard
 *   navigation beyond Enter/Space to open
 * Gotchas: All hover effects disabled on reduced motion (opacity/border only).
 *   Tilt uses animate() for exit snap-back (no spring drift). Corner SVGs use
 *   rgba(var(--sumi-rgb), X) for automatic dark mode adaptation.
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useTransform, useInView, animate } from 'framer-motion'
import type { Artwork } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsHoverable } from '@/hooks/useIsHoverable'
import {
  cardTiltRange,
  cardTiltSpring,
  inkBleed,
  brushStroke,
  inkWashGradient,
  cardShadow,
  tiltOnScrollVariants,
  softEase,
} from '@/lib/animations'

interface KakejikuCardProps {
  artwork: Artwork
  index?: number
  onOpen?: (id: number) => void
  priority?: boolean
  /** When true, uses rotateX tilt-on-scroll-into-view instead of standard fade-up */
  tiltOnScroll?: boolean
}

export function KakejikuCard({
  artwork,
  index = 0,
  onOpen,
  priority = false,
  tiltOnScroll = false,
}: KakejikuCardProps) {
  const reducedMotion = useReducedMotion()
  const canHover = useIsHoverable()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)
  const [ripplePos, setRipplePos] = useState({ x: 50, y: 50 })

  // ─── Parallax tilt ──────────────────────────────────────────────

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  // Shadow intensity derived from tilt angle
  const tiltIntensity = useTransform(
    [rotateX, rotateY],
    ([rx, ry]) => Math.min(Math.abs(rx as number) + Math.abs(ry as number), 8),
  )
  const boxShadowValue = useTransform(tiltIntensity, (t) => cardShadow(t))

  // ─── Event handlers ─────────────────────────────────────────────

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isHovered || reducedMotion) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      // Spring-smoothed tilt toward cursor
      animate(rotateX, y * -(cardTiltRange * 2), {
        type: 'spring',
        ...cardTiltSpring,
      })
      animate(rotateY, x * (cardTiltRange * 2), {
        type: 'spring',
        ...cardTiltSpring,
      })

      // Ink-wash ripple position (as percentages)
      setRipplePos({
        x: (e.clientX - rect.left) / rect.width * 100,
        y: (e.clientY - rect.top) / rect.height * 100,
      })
    },
    [isHovered, reducedMotion, rotateX, rotateY],
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (!reducedMotion) {
      // Snap tilt back immediately — no spring (prevents drift)
      animate(rotateX, 0, { duration: 0.1, ease: 'easeOut' })
      animate(rotateY, 0, { duration: 0.1, ease: 'easeOut' })
    }
  }, [reducedMotion, rotateX, rotateY])

  // ─── Scroll reveal config ───────────────────────────────────────

  const useTilt = tiltOnScroll && !reducedMotion

  // When tiltOnScroll is enabled, use rotateX tilt variants.
  // Otherwise, use standard fade-up with object-based initial/animate.
  const scrollVariants = useTilt ? tiltOnScrollVariants : undefined
  const scrollInitial = useTilt ? 'hidden' as const : { opacity: 0, y: reducedMotion ? 0 : 40 }
  const scrollAnimate = useTilt
    ? (isInView ? 'visible' as const : 'hidden' as const)
    : (isInView ? { opacity: 1, y: 0 } : {})

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <motion.div
      ref={ref}
      className="kakejiku cursor-pointer group"
      style={!reducedMotion ? { perspective: 1000 } : undefined}
      variants={scrollVariants}
      initial={scrollInitial}
      animate={scrollAnimate}
      transition={{
        duration: 0.8,
        ease: useTilt ? softEase : [0.16, 1, 0.3, 1],
        delay: index * 0.1,
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
      onMouseEnter={canHover ? handleMouseEnter : undefined}
      onMouseMove={canHover ? handleMouseMove : undefined}
      onMouseLeave={canHover ? handleMouseLeave : undefined}
      whileTap={canHover ? undefined : { scale: 0.98 }}
    >
      {/* ─── Inner tilt wrapper ───────────────────────────────── */}
      <motion.div
        style={!reducedMotion ? {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          boxShadow: boxShadowValue,
        } : undefined}
      >
        {/* Top hanging cord */}
        <div className="flex justify-center">
          <div className="w-px h-3 bg-sumi/30" />
        </div>

        {/* Top wooden rod */}
        <div className="kakejiku-rod-top" />

        {/* Mounting + image area */}
        <div className="kakejiku-mounting relative">
          {/* Image container */}
          <div className="relative aspect-[3/2] overflow-hidden bg-washi-light/50">
            <Image
              src={artwork.wikimedia_thumb || artwork.wikimedia_url}
              alt={`${artwork.title} by Utagawa Hiroshige${artwork.year ? `, ${artwork.year}` : ''}`}
              fill
              className={`object-contain p-2 transition-all duration-slow ${
                isHovered ? 'saturate-[0.85]' : ''
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              priority={priority}
            />

            {/* ─── Ink-wash ripple overlay ───────────────────── */}
            <div
              className="absolute inset-0 pointer-events-none z-[1]"
              style={{
                background: inkWashGradient(ripplePos.x, ripplePos.y),
                opacity: reducedMotion
                  ? (isHovered ? 0.05 : 0)
                  : (isHovered ? 1 : 0),
                transition: `opacity ${reducedMotion ? '0.2s ease' : '0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'}`,
              }}
              aria-hidden="true"
            />

            {/* ─── Brushstroke corner accents ────────────────── */}

            {/* Top-right corner */}
            <svg
              className="absolute top-1 right-1 w-6 h-6 z-[3] pointer-events-none"
              viewBox="0 0 44 44"
              fill="none"
              aria-hidden="true"
            >
              {/* Primary brushstroke */}
              <motion.path
                d="M42 8 Q42 4 38 4 Q30 4 24 8 Q18 12 14 14 Q10 16 8 14 Q6 12 8 6"
                style={{ stroke: 'rgba(var(--sumi-rgb), 0.40)' }}
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={
                  reducedMotion
                    ? { opacity: isHovered ? 0.3 : 0 }
                    : {
                        pathLength: isHovered ? 1 : 0,
                        opacity: isHovered ? 1 : 0,
                      }
                }
                transition={
                  reducedMotion
                    ? { opacity: { duration: 0.2 } }
                    : {
                        pathLength: isHovered
                          ? { duration: 0.4, ease: brushStroke, delay: 0.1 }
                          : { duration: 0.2 },
                        opacity: { duration: 0.2 },
                      }
                }
              />
              {/* Secondary ink-bleed texture stroke */}
              <motion.path
                d="M42 10 Q40 6 36 6 Q28 7 22 10"
                style={{ stroke: 'rgba(var(--sumi-rgb), 0.12)' }}
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
                initial={false}
                animate={
                  reducedMotion
                    ? { opacity: isHovered ? 0.3 : 0 }
                    : {
                        pathLength: isHovered ? 1 : 0,
                        opacity: isHovered ? 1 : 0,
                      }
                }
                transition={
                  reducedMotion
                    ? { opacity: { duration: 0.2 } }
                    : {
                        pathLength: isHovered
                          ? { duration: 0.4, ease: brushStroke, delay: 0.1 }
                          : { duration: 0.2 },
                        opacity: { duration: 0.2 },
                      }
                }
              />
            </svg>

            {/* Bottom-left corner */}
            <svg
              className="absolute bottom-1 left-1 w-6 h-6 z-[3] pointer-events-none"
              viewBox="0 0 44 44"
              fill="none"
              aria-hidden="true"
            >
              {/* Primary brushstroke */}
              <motion.path
                d="M8 42 Q8 42 10 38 Q14 30 18 26 Q24 20 28 18 Q32 16 36 18 Q38 20 36 24"
                style={{ stroke: 'rgba(var(--sumi-rgb), 0.40)' }}
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={
                  reducedMotion
                    ? { opacity: isHovered ? 0.3 : 0 }
                    : {
                        pathLength: isHovered ? 1 : 0,
                        opacity: isHovered ? 1 : 0,
                      }
                }
                transition={
                  reducedMotion
                    ? { opacity: { duration: 0.2 } }
                    : {
                        pathLength: isHovered
                          ? { duration: 0.4, ease: brushStroke, delay: 0.3 }
                          : { duration: 0.2 },
                        opacity: { duration: 0.2 },
                      }
                }
              />
              {/* Secondary ink-bleed texture stroke */}
              <motion.path
                d="M10 42 Q12 38 16 34 Q22 28 28 24"
                style={{ stroke: 'rgba(var(--sumi-rgb), 0.12)' }}
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
                initial={false}
                animate={
                  reducedMotion
                    ? { opacity: isHovered ? 0.3 : 0 }
                    : {
                        pathLength: isHovered ? 1 : 0,
                        opacity: isHovered ? 1 : 0,
                      }
                }
                transition={
                  reducedMotion
                    ? { opacity: { duration: 0.2 } }
                    : {
                        pathLength: isHovered
                          ? { duration: 0.4, ease: brushStroke, delay: 0.3 }
                          : { duration: 0.2 },
                        opacity: { duration: 0.2 },
                      }
                }
              />
            </svg>

          </div>

          {/* ─── Seal stamp — blooms last ─────────────────────── */}
          <motion.div
            className="absolute bottom-3 right-3 z-10"
            initial={false}
            animate={
              reducedMotion
                ? { opacity: isHovered ? 1 : 0 }
                : {
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.3,
                    rotate: isHovered ? 0 : -10,
                  }
            }
            transition={
              reducedMotion
                ? { opacity: { duration: 0.2 } }
                : {
                    opacity: { duration: isHovered ? 0.5 : 0.2, ease: inkBleed, delay: isHovered ? 0.2 : 0 },
                    scale: isHovered
                      ? { duration: 0.5, ease: inkBleed, delay: 0.2 }
                      : { duration: 0.2 },
                    rotate: isHovered
                      ? { duration: 0.5, ease: inkBleed, delay: 0.2 }
                      : { duration: 0.2 },
                  }
            }
            aria-hidden="true"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              className="drop-shadow-sm"
              style={{ filter: isHovered && !reducedMotion ? 'drop-shadow(0 0 4px rgba(var(--vermillion-rgb), 0.25))' : undefined }}
            >
              {/* Seal border */}
              <rect
                x="0.5"
                y="0.5"
                width="27"
                height="27"
                rx="2"
                fill="var(--vermillion)"
                stroke="var(--vermillion)"
                strokeWidth="0.5"
              />
              {/* Inner border */}
              <rect
                x="3"
                y="3"
                width="22"
                height="22"
                rx="1.5"
                fill="none"
                stroke="var(--washi)"
                strokeWidth="0.5"
                opacity="0.7"
              />
              {/* Kanji character 蔵 (treasure/storehouse) */}
              <text
                x="14"
                y="18.5"
                textAnchor="middle"
                fill="var(--washi)"
                fontSize="14"
                fontFamily="serif"
                fontWeight="bold"
              >
                蔵
              </text>
            </svg>
          </motion.div>
        </div>

        {/* Bottom wooden rod */}
        <div className="kakejiku-rod-bottom" />

        {/* Caption area */}
        <div className="px-3 py-3 bg-washi">
          {/* Title with brushstroke underline */}
          <div className="relative overflow-hidden">
            <h3 className="font-display-jp text-sm md:text-base text-sumi leading-tight">
              {artwork.title}
            </h3>
            {/* Vermillion underline — draws in on hover */}
            <motion.div
              className="absolute bottom-0 left-0 h-px bg-vermillion"
              style={{ originX: 0 }}
              initial={false}
              animate={
                reducedMotion
                  ? { opacity: isHovered ? 1 : 0 }
                  : { scaleX: isHovered ? 1 : 0 }
              }
              transition={{ duration: reducedMotion ? 0.2 : 0.4, ease: inkBleed }}
            />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-mist font-body">
              {artwork.series}
              {' · '}
              {artwork.year}
            </span>
            {/* Vermillion seal accent */}
            <span
              className="inline-block w-2 h-2 bg-vermillion rounded-ink"
              aria-hidden="true"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

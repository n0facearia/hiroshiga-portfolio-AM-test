'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import type { Artwork } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { FloatingPetals } from './FloatingPetals'

interface HeroParallaxProps {
  artworks: Artwork[]
}

const TITLE_CHARS = '木版画の世界'
const TITLE_ENGLISH = 'Hiroshige'
const SUBTITLE = 'Utagawa Hiroshige · 1797–1858'

export function HeroParallax({ artworks }: HeroParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax layers
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const midY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const foreY = useTransform(scrollYProgress, [0, 1], [0, 250])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Mouse parallax
  const mouseX = useMotionValue(0)
  const mouseY_mv = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY_mv, { stiffness: 100, damping: 30 })

  // Mouse parallax transforms
  const rotateXVal = useTransform(springY, [-5, 5], [1, -1])
  const rotateYVal = useTransform(springX, [-5, 5], [-1, 1])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mouseX.set(x * 5)
      mouseY_mv.set(y * 5)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [reduced, mouseX, mouseY_mv])

  const displayArtworks = artworks.slice(0, 4)

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh]"
      aria-label="Hero showcase"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Perspective container for 3D mouse parallax */}
        <motion.div
          className="relative w-full h-full"
          style={
            reduced
              ? {}
              : {
                  perspective: '1200px',
                  rotateX: rotateXVal,
                  rotateY: rotateYVal,
                }
          }
        >
          {/* Layer 1: Ink wash background (z=0) */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ y: bgY, opacity }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-washi to-washi" />
            <div
              className="absolute top-[-10%] left-[-5%] w-[80%] h-[70%] opacity-[0.06]"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 40%, var(--sumi) 0%, transparent 70%)',
              }}
            />
            <div
              className="absolute bottom-0 right-[-5%] w-[60%] h-[50%] opacity-[0.04]"
              style={{
                background:
                  'radial-gradient(ellipse at 70% 60%, var(--sumi) 0%, transparent 70%)',
              }}
            />
          </motion.div>

          {/* FloatingPetals */}
          <FloatingPetals count={15} />

          {/* Layer 2: 3D floating artworks (z=mid) */}
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{
              y: midY,
              opacity,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="relative w-full max-w-4xl mx-auto aspect-[16/9]">
              {displayArtworks.map((artwork, i) => {
                const zDepth = [80, -50, -120, 30][i] || 0
                const yDrift = [0, 6, -4, 8][i] || 0
                const scale = [1, 0.85, 0.7, 0.55][i] || 0.5
                const xOffset = [-8, 8, -15, 15][i] || 0

                return (
                  <motion.div
                    key={artwork.id}
                    className="absolute inset-0"
                    style={{
                      zIndex: 10 - i,
                      transformStyle: 'preserve-3d',
                    }}
                    initial={false}
                    animate={
                      reduced
                        ? {}
                        : {
                            y: [yDrift, yDrift - 6, yDrift + 4, yDrift],
                          }
                    }
                    transition={{
                      duration: 4 + i * 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.5,
                    }}
                  >
                    <div
                      className="relative w-full h-full"
                      style={{
                        transform: `translateZ(${zDepth}px) translateX(${xOffset}px) scale(${scale})`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="relative w-[80%] md:w-[70%] mx-auto aspect-[3/2] rounded-ink-md overflow-hidden shadow-ink-lg">
                        <Image
                          src={artwork.wikimedia_thumb || artwork.wikimedia_url}
                          alt={`${artwork.title} by Utagawa Hiroshige`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 80vw, 50vw"
                          quality={85}
                          priority={i === 0}
                        />
                        {/* Overlay for depth */}
                        <div className="absolute inset-0 bg-sumi/[0.08]" />
                      </div>

                      {/* Caption */}
                      {i === 0 && (
                        <div
                          className="mt-4 text-center"
                          style={{ transform: 'translateZ(30px)' }}
                        >
                          <p className="font-body text-xs text-mist tracking-wider">
                            {artwork.title}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Layer 3: Brushstroke SVG */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ y: foreY, opacity }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 1440 900"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Left brushstroke */}
              <motion.path
                d="M0,300 Q100,200 200,280 Q300,360 400,250 Q500,140 600,260 Q700,380 800,220 Q900,60 1000,240 Q1100,420 1200,200 Q1300,-20 1440,180"
                fill="none"
                className="stroke-sumi"
                strokeWidth="1.5"
                strokeOpacity="0.12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
              />
              {/* Right brushstroke */}
              <motion.path
                d="M1440,600 Q1300,500 1200,580 Q1100,660 1000,550 Q900,440 800,560 Q700,680 600,520 Q500,360 400,540 Q300,720 200,500 Q100,280 0,460"
                fill="none"
                className="stroke-sumi"
                strokeWidth="1"
                strokeOpacity="0.08"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1], delay: 1 }}
              />
            </svg>
          </motion.div>

          {/* Layer 4: Foreground text content */}
          <motion.div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6"
            style={{ y: foreY, opacity }}
          >
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
              className="font-body text-xs md:text-sm text-mist mt-6 tracking-[0.15em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
            >
              {SUBTITLE}
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.5 }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-mist uppercase tracking-[0.2em] font-body">
                  Scroll
                </span>
                <motion.div
                  className="w-px h-8 bg-sumi/30"
                  animate={{ height: [16, 32, 16] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotion()

  // All hooks called before any early return
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const dropletOpacity = useTransform(scrollYProgress, [0.95, 1], [0, 1])
  const dropletScale = useTransform(scrollYProgress, [0.95, 1], [0.5, 1])

  if (reduced) return null

  return (
    <div
      className="fixed right-0 top-0 bottom-0 w-1.5 z-50 hidden md:block pointer-events-none"
      aria-hidden="true"
    >
      {/* Track */}
      <div className="absolute inset-0 bg-washi-medium opacity-30 w-px mx-auto" />

      {/* Progress line */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px bg-sumi origin-bottom"
        style={{ height }}
      />

      {/* Ink droplet at bottom */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sumi"
        style={{
          opacity: dropletOpacity,
          scale: dropletScale,
        }}
      />
    </div>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Layered ink wash backgrounds with parallax scroll effect.
 * Uses CSS radial gradients at varying opacities to simulate sumi-e washes.
 */
export function InkBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 60])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6])

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Layer 1: Deep wash — slow */}
      <motion.div
        className="absolute inset-0"
        style={{ y: y1, opacity }}
      >
        <div
          className="absolute top-[-10%] left-[-5%] w-[60%] h-[50%] opacity-[0.04]"
          style={{
            background:
              'radial-gradient(ellipse at 30% 40%, var(--sumi) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[40%] opacity-[0.03]"
          style={{
            background:
              'radial-gradient(ellipse at 70% 60%, var(--sumi) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Layer 2: Mid wash — moves opposite */}
      <motion.div
        className="absolute inset-0"
        style={{ y: y2 }}
      >
        <div
          className="absolute top-[20%] right-[10%] w-[40%] h-[30%] opacity-[0.02]"
          style={{
            background:
              'radial-gradient(ellipse at 60% 50%, var(--gold) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-[30%] left-[15%] w-[35%] h-[25%] opacity-[0.015]"
          style={{
            background:
              'radial-gradient(ellipse at 40% 50%, var(--vermillion) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Layer 3: Subtle texture — static */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, var(--sumi) 1px, transparent 1px), radial-gradient(circle at 75% 75%, var(--sumi) 1px, transparent 1px)',
          backgroundSize: '80px 80px, 60px 60px',
        }}
      />
    </div>
  )
}

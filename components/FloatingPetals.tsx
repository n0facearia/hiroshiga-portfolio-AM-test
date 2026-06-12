'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Petal {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  drift: number
  rotation: number
}

export function FloatingPetals({ count = 15 }: { count?: number }) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const reduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  // Defer rendering until after initial paint so petals don't block LCP
  useEffect(() => {
    const id = requestIdleCallback(() => setMounted(true))
    const fallback = setTimeout(() => setMounted(true), 200)
    return () => {
      cancelIdleCallback(id)
      clearTimeout(fallback)
    }
  }, [])

  const petals = useMemo<Petal[]>(() => {
    if (isMobile || reduced) return []

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 6 + Math.random() * 8,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 15,
      drift: -20 + Math.random() * 40,
      rotation: Math.random() * 360,
    }))
  }, [count, isMobile, reduced])

  if (isMobile || reduced) return null
  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: '-5%',
            width: petal.size,
            height: petal.size * 0.7,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, petal.drift * 0.3, petal.drift, petal.drift * 0.5, 0],
            rotate: [petal.rotation, petal.rotation + 180, petal.rotation + 360],
            opacity: [0, 0.5, 0.4, 0.3, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Petal shape */}
          <svg
            viewBox="0 0 20 14"
            className="w-full h-full"
            style={{ fill: 'rgba(var(--vermillion-rgb), 0.15)' }}
          >
            <ellipse cx="10" cy="7" rx="9" ry="6" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

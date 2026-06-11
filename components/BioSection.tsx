'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface BioSectionProps {
  name: string
  bio: string
  birthYear: number
  deathYear: number
}

export function BioSection({ name, bio, birthYear, deathYear }: BioSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
      <div className="grid md:grid-cols-5 gap-8 md:gap-12">
        {/* Left: decorative kanji stamp */}
        <motion.div
          className="hidden md:flex md:col-span-1 items-start justify-center pt-4"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-accent text-7xl text-vermillion/30 leading-none">
            広重
          </span>
        </motion.div>

        {/* Right: content */}
        <motion.div
          className="md:col-span-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {/* Title */}
          <div className="flex items-baseline gap-4 mb-8">
            <h1 className="font-display text-4xl md:text-5xl text-sumi">
              {name.split(' ')[0]}
            </h1>
            <span className="font-display-jp text-2xl md:text-3xl text-mist">
              {name.split(' ')[1]}
            </span>
          </div>

          {/* Lifespan */}
          <p className="font-body text-xs text-mist uppercase tracking-widest mb-6">
            {birthYear} — {deathYear}
          </p>

          {/* Bio */}
          <div className="font-body text-sm md:text-base text-sumi/80 leading-relaxed space-y-4">
            {bio.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

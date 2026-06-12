'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TimelineEvent {
  year: number
  event: string
}

interface TimelineProps {
  events: TimelineEvent[]
}

export function Timeline({ events }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-20">
      <h2 className="font-display text-2xl md:text-3xl text-sumi mb-12 text-center">
        Life & Legacy
      </h2>

      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-washi-medium"
          aria-hidden="true"
        />

        {events.map((event, index) => {
          const isLeft = index % 2 === 0
          return (
            <motion.div
              key={event.year}
              className={`relative flex items-start gap-6 mb-8 md:mb-12 ${
                isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: index * 0.15,
              }}
            >
              {/* Year + dot — always on left */}
              <div
                className={`flex items-center gap-4 md:w-1/2 ${
                  isLeft ? 'md:justify-end md:text-right' : 'md:justify-start'
                }`}
              >
                {/* Dot */}
                <div
                  className={`relative z-10 flex-shrink-0 w-[38px] flex justify-center md:hidden`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-vermillion" />
                </div>

                {/* Year */}
                <span className="font-display text-lg md:text-xl text-vermillion flex-shrink-0">
                  {event.year}
                </span>
              </div>

              {/* Desktop dot on center line */}
              <div
                className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 w-4 h-4 items-center justify-center"
                aria-hidden="true"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-vermillion border-2 border-washi" />
              </div>

              {/* Event text */}
              <div className="md:w-1/2 pl-0 md:pl-0">
                <p className="font-body text-sm text-sumi leading-relaxed">
                  {event.event}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

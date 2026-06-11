'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { BrushstrokeVariant } from '@/types'
import { brushStroke, duration } from '@/lib/animations'

interface BrushstrokeDividerProps {
  variant?: BrushstrokeVariant
  className?: string
}

const paths: Record<BrushstrokeVariant, string> = {
  mountain:
    'M0,60 Q60,20 120,40 Q180,60 240,30 Q300,0 360,35 Q420,70 480,40 Q540,10 600,45 Q660,80 720,50 Q780,20 840,55 Q900,90 960,60 Q1020,30 1080,50 Q1140,70 1200,40 Q1260,10 1320,45 Q1380,80 1440,55',
  wave:
    'M0,60 Q40,30 80,50 Q120,70 160,40 Q200,10 240,50 Q280,90 320,30 Q360,-10 400,40 Q440,90 480,20 Q520,-20 560,50 Q600,80 640,30 Q680,10 720,60 Q760,90 800,40 Q840,20 880,55 Q920,85 960,35 Q1000,10 1040,50 Q1080,80 1120,30 Q1160,15 1200,55 Q1240,85 1280,40 Q1320,20 1360,50 Q1400,75 1440,45',
  bamboo:
    'M200,0 L220,40 L200,80 L225,120 L205,160 L230,200 L210,240 L235,280 L215,320 L240,360 L220,400 L245,440 L225,480 L250,520 L230,560 L255,600 L235,640 L260,680 L240,720',
}

export function BrushstrokeDivider({
  variant = 'mountain',
  className = '',
}: BrushstrokeDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div
      ref={ref}
      className={`w-full h-24 md:h-32 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <motion.path
          d={paths[variant]}
          fill="none"
          className="stroke-sumi"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 0.4 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: duration.deliberate,
            ease: brushStroke,
            delay: 0.2,
          }}
        />
        {/* Second stroke for depth */}
        <motion.path
          d={paths[variant]}
          fill="none"
          className="stroke-sumi"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 0.2 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: 1.5,
            ease: brushStroke,
            delay: 0.5,
          }}
        />
      </svg>
    </div>
  )
}

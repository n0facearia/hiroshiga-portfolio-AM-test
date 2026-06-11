'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import type { Artwork } from '@/types'

interface KakejikuCardProps {
  artwork: Artwork
  index?: number
  onOpen?: (id: number) => void
  priority?: boolean
}

export function KakejikuCard({
  artwork,
  index = 0,
  onOpen,
  priority = false,
}: KakejikuCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      className="kakejiku cursor-pointer group"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1,
      }}
      whileHover={{
        scale: 1.02,
        rotate: Math.random() > 0.5 ? 1 : -1,
        transition: { duration: 0.2, ease: 'easeOut' },
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
    >
      {/* Top hanging cord */}
      <div className="flex justify-center">
        <div className="w-px h-3 bg-sumi/30" />
      </div>

      {/* Top wooden rod */}
      <div className="kakejiku-rod-top" />

      {/* Mounting + image area */}
      <div className="kakejiku-mounting">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={artwork.wikimedia_thumb || artwork.wikimedia_url}
            alt={`${artwork.title} by Utagawa Hiroshige${artwork.year ? `, ${artwork.year}` : ''}`}
            fill
            className="object-cover transition-transform duration-slow group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />

          {/* Hover overlay — subtle ink wash */}
          <div className="absolute inset-0 bg-sumi/0 transition-colors duration-normal group-hover:bg-sumi/[0.04]" />
        </div>
      </div>

      {/* Bottom wooden rod */}
      <div className="kakejiku-rod-bottom" />

      {/* Caption area */}
      <div className="px-3 py-3 bg-washi">
        {/* Title reveal on hover */}
        <div className="relative overflow-hidden">
          <h3 className="font-display-jp text-sm md:text-base text-sumi leading-tight">
            {artwork.title}
          </h3>
          {/* Brushstroke underline on hover */}
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-vermillion"
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
  )
}

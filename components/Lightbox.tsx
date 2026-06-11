'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Artwork } from '@/types'

interface LightboxProps {
  artworkId: number
  artworks: Artwork[]
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export function Lightbox({
  artworkId,
  artworks,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const artwork = artworks.find((a) => a.id === artworkId)
  const currentIndex = artworks.findIndex((a) => a.id === artworkId)
  const total = artworks.length

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowRight':
          onNext()
          break
        case 'ArrowLeft':
          onPrev()
          break
      }
    },
    [onClose, onNext, onPrev]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!artwork) return null

  return (
    <AnimatePresence>
      <motion.div
        key={artwork.id}
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        role="dialog"
        aria-modal="true"
        aria-label={`Lightbox: ${artwork.title}`}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-sumi/80 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-5xl w-full mx-4 md:mx-8 max-h-[90vh] flex flex-col md:flex-row bg-washi rounded-ink-md overflow-hidden shadow-xl"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center text-sumi hover:text-vermillion transition-colors duration-fast bg-washi/80 rounded-ink"
            aria-label="Close lightbox"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Image */}
          <div className="relative w-full md:w-3/5 aspect-[4/3] md:aspect-auto md:min-h-[60vh]">
            <Image
              src={artwork.wikimedia_url}
              alt={`${artwork.title} by Utagawa Hiroshige${artwork.year ? `, ${artwork.year}` : ''}`}
              fill
              className="object-contain bg-washi"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </div>

          {/* Info panel */}
          <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto flex flex-col justify-center">
            <span className="text-xs text-mist uppercase tracking-widest font-body">
              {artwork.series}
              {' · '}
              {artwork.year}
            </span>
            <h2 className="font-display-jp text-xl md:text-2xl text-sumi mt-2 leading-tight">
              {artwork.title}
            </h2>
            {artwork.title_jp && (
              <p className="font-accent text-base text-mist mt-1">{artwork.title_jp}</p>
            )}
            <p className="font-body text-sm text-sumi/80 mt-4 leading-relaxed">
              {artwork.description}
            </p>

            {/* Counter */}
            <p className="text-xs text-mist mt-6">
              {currentIndex + 1} / {total}
            </p>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-xs uppercase tracking-widest border border-sumi text-sumi hover:bg-sumi hover:text-washi transition-colors duration-fast disabled:opacity-30 disabled:cursor-not-allowed rounded-ink"
                aria-label="Previous artwork"
              >
                Prev
              </button>
              <button
                onClick={onNext}
                disabled={currentIndex === total - 1}
                className="px-4 py-2 text-xs uppercase tracking-widest border border-sumi text-sumi hover:bg-sumi hover:text-washi transition-colors duration-fast disabled:opacity-30 disabled:cursor-not-allowed rounded-ink"
                aria-label="Next artwork"
              >
                Next
              </button>
            </div>

            {/* Wikimedia attribution */}
            <p className="text-xs text-mist/60 mt-6 leading-relaxed">
              Image courtesy of{' '}
              <a
                href="https://commons.wikimedia.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-vermillion transition-colors"
              >
                Wikimedia Commons
              </a>
              {' '}(public domain)
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

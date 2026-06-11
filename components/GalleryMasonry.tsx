'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Artwork } from '@/types'
import { KakejikuCard } from './KakejikuCard'

const Lightbox = dynamic(() => import('./Lightbox').then((m) => m.Lightbox), { ssr: false })

interface GalleryMasonryProps {
  artworks: Artwork[]
}

export function GalleryMasonry({ artworks }: GalleryMasonryProps) {
  const [lightboxId, setLightboxId] = useState<number | null>(null)

  const handleOpen = useCallback((id: number) => {
    setLightboxId(id)
  }, [])

  const handleClose = useCallback(() => {
    setLightboxId(null)
  }, [])

  const handleNext = useCallback(() => {
    if (lightboxId === null) return
    const currentIndex = artworks.findIndex((a) => a.id === lightboxId)
    if (currentIndex < artworks.length - 1) {
      setLightboxId(artworks[currentIndex + 1].id)
    }
  }, [lightboxId, artworks])

  const handlePrev = useCallback(() => {
    if (lightboxId === null) return
    const currentIndex = artworks.findIndex((a) => a.id === lightboxId)
    if (currentIndex > 0) {
      setLightboxId(artworks[currentIndex - 1].id)
    }
  }, [lightboxId, artworks])

  if (artworks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-mist font-body text-sm tracking-wider">
          No artworks found for this filter.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* CSS masonry columns */}
      <div
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        role="list"
        aria-label="Artwork gallery"
      >
        {artworks.map((artwork, index) => (
          <div key={artwork.id} className="break-inside-avoid" role="listitem">
            <KakejikuCard
              artwork={artwork}
              index={index}
              onOpen={handleOpen}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxId !== null && (
        <Lightbox
          artworkId={lightboxId}
          artworks={artworks}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  )
}

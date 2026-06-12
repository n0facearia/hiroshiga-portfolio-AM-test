/**
 * Component: HomeGalleryClient
 * What it does: Wraps the homepage's "Featured Masterworks" grid with lightbox
 *   state management so clicking a KakejikuCard opens the full lightbox view —
 *   same behavior as the /work gallery page.
 * Props:
 *   artworks: Artwork[] — the grid artworks (featured artworks after the first 5)
 * Renders: CSS grid of KakejikuCards + Lightbox (when active)
 * Does NOT do: Fetch artwork data, handle filter state, render the hero section
 * Gotchas: This is a Client Component (requires 'use client') because it manages
 *   interactive lightbox state. The Lightbox is dynamically imported (ssr: false)
 *   to avoid server hydration issues with dialog/overlay.
 */

'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Artwork } from '@/types'
import { KakejikuCard } from './KakejikuCard'

const Lightbox = dynamic(() => import('./Lightbox').then((m) => m.Lightbox), { ssr: false })

interface HomeGalleryClientProps {
  artworks: Artwork[]
}

export function HomeGalleryClient({ artworks }: HomeGalleryClientProps) {
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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artworks.map((artwork, index) => (
          <KakejikuCard
            key={artwork.id}
            artwork={artwork}
            index={index}
            tiltOnScroll
            onOpen={handleOpen}
          />
        ))}
      </div>

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

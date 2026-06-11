'use client'

import type { Artwork } from '@/types'
import { FilterBar } from '@/components/FilterBar'
import { GalleryMasonry } from '@/components/GalleryMasonry'

interface GalleryPageClientProps {
  artworks: Artwork[]
}

export function GalleryPageClient({ artworks }: GalleryPageClientProps) {
  return (
    <>
      <FilterBar />
      <div className="mt-8">
        <GalleryMasonry artworks={artworks} />
      </div>
    </>
  )
}

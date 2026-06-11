import { Suspense } from 'react'
import { getAllArtworks } from '@/lib/artworks'
import { GalleryPageClient } from './GalleryPageClient'

export const metadata = {
  title: 'Gallery',
  description:
    'Browse the complete collection of Utagawa Hiroshige\'s woodblock prints — The Fifty-Three Stations of the Tōkaidō and One Hundred Famous Views of Edo.',
  openGraph: {
    title: 'Gallery — Hiroshige Woodblock Prints',
    description:
      'Browse the complete collection of Utagawa Hiroshige\'s woodblock prints.',
  },
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: { series?: string }
}) {
  const artworks = await getAllArtworks(searchParams.series)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page header */}
        <div className="mb-8 md:mb-12">
          <h1 className="font-display text-3xl md:text-4xl text-sumi">
            Gallery
          </h1>
          <p className="font-display-jp text-base text-mist mt-1">
            作品集
          </p>
          <p className="font-body text-xs text-mist mt-2 tracking-wider">
            {artworks.length} artworks
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="kakejiku animate-pulse"
                >
                  <div className="kakejiku-rod-top" />
                  <div className="aspect-[4/3] bg-washi-light" />
                  <div className="kakejiku-rod-bottom" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-washi-medium rounded" />
                    <div className="h-2 bg-washi-light rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <GalleryPageClient artworks={artworks} />
        </Suspense>
      </div>
    </div>
  )
}

import { getFeaturedArtworks } from '@/lib/artworks'
import { getArtistInfo } from '@/lib/artworks'
import { InkBackground } from '@/components/InkBackground'
import { HeroParallax } from '@/components/HeroParallax'
import { KakejikuCard } from '@/components/KakejikuCard'
import { BrushstrokeDivider } from '@/components/BrushstrokeDivider'
import { BrushstrokeUnderline } from '@/components/BrushstrokeUnderline'

export default async function HomePage() {
  const [featured, artist] = await Promise.all([
    getFeaturedArtworks(),
    getArtistInfo(),
  ])

  // First 5 appear as floating cards in HeroParallax, the rest as a grid
  const gridArtworks = featured.slice(5)

  return (
    <>
      <InkBackground />

      {/* Hero section with 2.5D floating scene */}
      <HeroParallax artworks={featured} />

      {/* Visual divider — transitions from floating 3D scene to flat grid */}
      <BrushstrokeDivider variant="mountain" />

      {/* Section 2: Featured Masterworks (remaining artworks after floating cards) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-sumi">
            Featured Masterworks
          </h2>
          <p className="font-display-jp text-base text-mist mt-2">
            代表作
          </p>
          <div className="w-12 h-px bg-vermillion mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gridArtworks.map((artwork, index) => (
            <KakejikuCard
              key={artwork.id}
              artwork={artwork}
              index={index}
              tiltOnScroll
            />
          ))}
        </div>
      </section>

      <BrushstrokeDivider variant="wave" />

      {/* Section 3: Artist introduction */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
          <div className="hidden md:flex md:col-span-2 items-center justify-center">
            <span className="font-accent text-8xl text-vermillion/20 leading-none select-none">
              広重
            </span>
          </div>
          <div className="md:col-span-3">
            <h3 className="font-display text-2xl md:text-3xl text-sumi">
              Utagawa Hiroshige
            </h3>
            <p className="font-body text-xs text-mist uppercase tracking-widest mt-1">
              {artist.birth_year} — {artist.death_year}
            </p>
            <p className="font-body text-sm text-sumi/80 mt-4 leading-relaxed">
              {artist.bio}
            </p>
            <div className="mt-6">
              <BrushstrokeUnderline>
                <a
                  href="/about"
                  className="text-xs uppercase tracking-widest text-vermillion border border-vermillion rounded-ink px-6 py-2 inline-block transition-all duration-fast"
                >
                  Read More
                </a>
              </BrushstrokeUnderline>
            </div>
          </div>
        </div>
      </section>

      <BrushstrokeDivider variant="bamboo" />

      {/* Section 4: Series overview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-sumi">
            Explore the Series
          </h2>
          <p className="font-display-jp text-base text-mist mt-2">
            シリーズ
          </p>
          <div className="w-12 h-px bg-vermillion mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Tōkaidō */}
          <div className="border border-washi-medium rounded-ink-md p-8 text-center hover:bg-sumi/[0.02] transition-colors duration-normal">
            <h3 className="font-display-jp text-2xl text-sumi">
              東海道
            </h3>
            <p className="font-display text-lg text-sumi mt-1">
              The Fifty-Three Stations of the Tōkaidō
            </p>
            <p className="font-body text-xs text-mist mt-2">
              1833 — 1834
            </p>
            <p className="font-body text-sm text-sumi/70 mt-4 leading-relaxed">
              Hiroshige&apos;s most celebrated series, capturing each post station along the
              Tōkaidō road connecting Edo and Kyoto.
            </p>
            <div className="mt-6">
              <BrushstrokeUnderline>
                <a
                  href="/work?series=Fifty-Three+Stations+of+the+Tōkaidō"
                  className="text-xs uppercase tracking-widest text-vermillion transition-colors duration-fast"
                >
                  View Series →
                </a>
              </BrushstrokeUnderline>
            </div>
          </div>

          {/* Edo */}
          <div className="border border-washi-medium rounded-ink-md p-8 text-center hover:bg-sumi/[0.02] transition-colors duration-normal">
            <h3 className="font-display-jp text-2xl text-sumi">
              江戸名所
            </h3>
            <p className="font-display text-lg text-sumi mt-1">
              One Hundred Famous Views of Edo
            </p>
            <p className="font-body text-xs text-mist mt-2">
              1856 — 1858
            </p>
            <p className="font-body text-sm text-sumi/70 mt-4 leading-relaxed">
              Hiroshige&apos;s final masterpiece — 100 woodblock prints depicting
              scenes from Edo (Tokyo) across all four seasons.
            </p>
            <div className="mt-6">
              <BrushstrokeUnderline>
                <a
                  href="/work?series=One+Hundred+Famous+Views+of+Edo"
                  className="text-xs uppercase tracking-widest text-vermillion transition-colors duration-fast"
                >
                  View Series →
                </a>
              </BrushstrokeUnderline>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import { getArtistInfo } from '@/lib/artworks'
import { InkBackground } from '@/components/InkBackground'
import { BioSection } from '@/components/BioSection'
import { BrushstrokeDivider } from '@/components/BrushstrokeDivider'
import { Timeline } from '@/components/Timeline'
import { AboutPageClient } from './AboutPageClient'

export const metadata = {
  title: 'About & Contact',
  description:
    'Learn about Utagawa Hiroshige, one of the last great masters of ukiyo-e woodblock printing, and get in touch.',
  openGraph: {
    title: 'About Utagawa Hiroshige — Contact',
    description:
      'Learn about the life and legacy of Utagawa Hiroshige, master of Japanese woodblock printing.',
  },
}

export default async function AboutPage() {
  const artist = await getArtistInfo()

  return (
    <>
      <InkBackground />

      <div className="relative z-10 pt-24">
        {/* Bio section */}
        <BioSection
          name={artist.name}
          bio={artist.bio}
          birthYear={artist.birth_year}
          deathYear={artist.death_year}
        />

        <BrushstrokeDivider variant="mountain" />

        {/* Timeline */}
        <Timeline events={artist.timeline} />

        <BrushstrokeDivider variant="wave" />

        {/* Contact */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <AboutPageClient />
        </section>

        <BrushstrokeDivider variant="bamboo" />

        {/* Wikimedia credits */}
        <section className="max-w-3xl mx-auto px-6 md:px-12 py-12 text-center">
          <p className="font-body text-xs text-mist/60 leading-relaxed">
            All artwork images are sourced from{' '}
            <a
              href="https://commons.wikimedia.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-vermillion transition-colors"
            >
              Wikimedia Commons
            </a>
            {' '}and are in the public domain as faithful reproductions of
            pre-1923 works by Utagawa Hiroshige (1797–1858).
          </p>
        </section>
      </div>
    </>
  )
}

import type { Artwork } from '@/types'
import { FALLBACK_ARTWORKS } from './fallback-data'
import { fetchApi } from './api'

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  try {
    const data = await fetchApi<{ artworks: Artwork[] }>(
      '/artworks?featured=true'
    )
    return data.artworks
  } catch {
    return FALLBACK_ARTWORKS.filter((a) => a.is_featured)
      .sort((a, b) => a.display_order - b.display_order)
  }
}

export async function getAllArtworks(series?: string): Promise<Artwork[]> {
  try {
    const query = series && series !== 'all' ? `?series=${encodeURIComponent(series)}` : ''
    const data = await fetchApi<{ artworks: Artwork[] }>(`/artworks${query}`)
    return data.artworks
  } catch {
    let artworks = FALLBACK_ARTWORKS
    if (series && series !== 'all') {
      artworks = artworks.filter((a) => a.series.toLowerCase() === series.toLowerCase())
    }
    return artworks
  }
}

export async function getArtworkById(id: number): Promise<Artwork | null> {
  try {
    return await fetchApi<Artwork>(`/artworks/${id}`)
  } catch {
    return FALLBACK_ARTWORKS.find((a) => a.id === id) ?? null
  }
}

export async function getArtistInfo() {
  try {
    return await fetchApi<{
      name: string
      bio: string
      birth_year: number
      death_year: number
      timeline: { year: number; event: string }[]
    }>('/artist')
  } catch {
    return {
      name: 'Utagawa Hiroshige',
      bio: 'Utagawa Hiroshige (1797–1858) was one of the last great masters of ukiyo-e, the art of Japanese woodblock printing. He is best known for his landscape series The Fifty-Three Stations of the Tōkaidō (1833–1834) and One Hundred Famous Views of Edo (1856–1858). His work is characterized by subtle use of color, poetic atmosphere, and innovative compositions that captured the transient beauty of nature and everyday life in Edo-period Japan. Hiroshige\'s influence extended far beyond Japan, inspiring European Impressionists such as Van Gogh, Monet, and Whistler.',
      birth_year: 1797,
      death_year: 1858,
      timeline: [
        { year: 1797, event: 'Born as Andō Tokutarō in Edo (modern-day Tokyo)' },
        { year: 1811, event: 'Begins studying ukiyo-e under Utagawa Toyohiro' },
        { year: 1831, event: 'Publishes first major landscape series, Famous Views of the Eastern Capital' },
        { year: 1833, event: 'Begins The Fifty-Three Stations of the Tōkaidō — his most famous series' },
        { year: 1840, event: 'Teaches and produces various series, including illustrations for books' },
        { year: 1856, event: 'Begins One Hundred Famous Views of Edo, his final masterpiece' },
        { year: 1858, event: 'Dies at age 61 during the Edo cholera epidemic' },
      ],
    }
  }
}

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the api module — artworks.ts delegates to fetchApi
vi.mock('./api', () => ({
  fetchApi: vi.fn(),
}))

import { fetchApi } from './api'
import {
  getFeaturedArtworks,
  getAllArtworks,
  getArtworkById,
  getArtistInfo,
} from './artworks'
import { FALLBACK_ARTWORKS } from './fallback-data'

const featuredSorted = FALLBACK_ARTWORKS
  .filter((a) => a.is_featured)
  .sort((a, b) => a.display_order - b.display_order)

describe('getFeaturedArtworks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches from /artworks?featured=true and returns artworks array', async () => {
    const artworks = [{ id: 1, title: 'Featured' }]
    vi.mocked(fetchApi).mockResolvedValue({ artworks })

    const result = await getFeaturedArtworks()

    expect(fetchApi).toHaveBeenCalledWith('/artworks?featured=true')
    expect(result).toEqual(artworks)
  })

  it('returns fallback featured artworks sorted by display_order on API failure', async () => {
    vi.mocked(fetchApi).mockRejectedValue(new Error('API error'))

    const result = await getFeaturedArtworks()

    expect(result).toEqual(featuredSorted)
  })
})

describe('getAllArtworks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches from /artworks without filter when no series provided', async () => {
    const artworks = [{ id: 1, title: 'Test' }]
    vi.mocked(fetchApi).mockResolvedValue({ artworks })

    const result = await getAllArtworks()

    expect(fetchApi).toHaveBeenCalledWith('/artworks')
    expect(result).toEqual(artworks)
  })

  it('fetches from /artworks when series is "all"', async () => {
    vi.mocked(fetchApi).mockResolvedValue({ artworks: [] })

    await getAllArtworks('all')

    expect(fetchApi).toHaveBeenCalledWith('/artworks')
  })

  it('fetches from /artworks?series=Edo when series filter is provided', async () => {
    vi.mocked(fetchApi).mockResolvedValue({ artworks: [] })

    await getAllArtworks('Edo')

    expect(fetchApi).toHaveBeenCalledWith('/artworks?series=Edo')
  })

  it('returns all fallback artworks on API failure with no filter', async () => {
    vi.mocked(fetchApi).mockRejectedValue(new Error('API error'))

    const result = await getAllArtworks()

    expect(result).toEqual(FALLBACK_ARTWORKS)
  })

  it('returns filtered fallback on API failure when series is provided', async () => {
    vi.mocked(fetchApi).mockRejectedValue(new Error('API error'))

    const result = await getAllArtworks('Edo')

    const expected = FALLBACK_ARTWORKS.filter(
      (a) => a.series.toLowerCase() === 'edo',
    )
    expect(result).toEqual(expected)
  })
})

describe('getArtworkById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches from /artworks/{id} and returns the artwork', async () => {
    const artwork = { id: 1, title: 'Test' }
    vi.mocked(fetchApi).mockResolvedValue(artwork)

    const result = await getArtworkById(1)

    expect(fetchApi).toHaveBeenCalledWith('/artworks/1')
    expect(result).toEqual(artwork)
  })

  it('returns null on API failure when id has no fallback match', async () => {
    vi.mocked(fetchApi).mockRejectedValue(new Error('API error'))

    const result = await getArtworkById(9999)

    expect(result).toBeNull()
  })

  it('returns fallback artwork on API failure when id matches fallback', async () => {
    vi.mocked(fetchApi).mockRejectedValue(new Error('API error'))

    const result = await getArtworkById(1)

    expect(result).toEqual(FALLBACK_ARTWORKS.find((a) => a.id === 1))
  })
})

describe('getArtistInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches from /artist and returns artist info', async () => {
    const artistInfo = {
      name: 'Utagawa Hiroshige',
      bio: 'A master of ukiyo-e.',
      birth_year: 1797,
      death_year: 1858,
      timeline: [{ year: 1797, event: 'Born' }],
    }
    vi.mocked(fetchApi).mockResolvedValue(artistInfo)

    const result = await getArtistInfo()

    expect(fetchApi).toHaveBeenCalledWith('/artist')
    expect(result).toEqual(artistInfo)
  })

  it('returns hardcoded fallback on API failure', async () => {
    vi.mocked(fetchApi).mockRejectedValue(new Error('API error'))

    const result = await getArtistInfo()

    expect(result).toHaveProperty('name', 'Utagawa Hiroshige')
    expect(result).toHaveProperty('birth_year', 1797)
    expect(result).toHaveProperty('death_year', 1858)
    expect(result).toHaveProperty('timeline')
    expect(Array.isArray(result.timeline)).toBe(true)
    expect(result.timeline.length).toBeGreaterThan(0)
  })
})

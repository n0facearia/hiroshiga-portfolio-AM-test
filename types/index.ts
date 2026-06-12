export type Series =
  | 'Fifty-Three Stations of the Tōkaidō'
  | 'One Hundred Famous Views of Edo'
  | 'Eight Views of Ōmi'
  | 'Famous Places of Kyōto'
  | 'Thirty-six Views of Mount Fuji'
  | 'The Sixty-nine Stations of the Kisokaidō'

export interface Artwork {
  id: number
  title: string
  title_jp?: string
  series: Series
  series_number: number
  year: number
  description: string
  wikimedia_url: string
  wikimedia_thumb?: string
  source_url?: string
  attribution?: string
  tags: string
  is_featured: boolean
  display_order: number
}

export interface ContactMessage {
  name: string
  email: string
  message: string
}

export interface ContactResponse {
  success: boolean
  error?: string
}

export interface TimelineEvent {
  year: number
  event: string
}

export interface ArtistInfo {
  name: string
  bio: string
  birth_year: number
  death_year: number
  timeline: TimelineEvent[]
}

export type BrushstrokeVariant = 'mountain' | 'wave' | 'bamboo'

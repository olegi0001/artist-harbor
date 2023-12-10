import { ArtistImage } from "./common.types"

export type ArtistInfo = {
  artist: {
    name?: string
    mbid: string
    url: string
    image: ArtistImage[]
    stats: ArtistStats
    bio: ArtistBio
    tags?: ArtistTags
  }
}

type ArtistStats = {
  listeners: string
  playcount: string
}

type ArtistTags = {
  tag: {
    name: string
    url: string
  }[]
}

type ArtistBio = {
  published?: string
  summary?: string
  content?: string
  links?: {
    link?: {
      '#text': string
      rel: string
      href: string
    }[]
  }
}


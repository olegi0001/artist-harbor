import { ArtistImage } from "./common.types"

export type SearchResult = {
  artist?: Artist[]
}

export type SearchResultRaw = {
  results: {
    artistmatches: {
      artist?: Artist[]
    }
  }
}

export type Artist = {
  name: string
  listeners?: string
  mbid: string
  url?: string
  streamable?: string
  image: ArtistImage[]
}


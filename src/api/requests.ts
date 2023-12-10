import { API_KEY, API_BASE_URL } from './config'
import { SearchResult, SearchResultRaw } from '../types/searchResult.type'
import { ArtistInfo } from '../types/artistInfo.type'

export const searchArtist = async (artist: string): Promise<SearchResult> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?method=artist.search&artist=${artist}&api_key=${API_KEY}&format=json`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch search results')
    }

    const rawData: SearchResultRaw = await response.json()
    const data: SearchResult = rawData?.results?.artistmatches

    return data
  } catch (error) {
    throw new Error(`Error in searchArtist: ${error.message}`)
  }
}

export const getArtistInfo = async (artist: string): Promise<ArtistInfo> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?method=artist.getinfo&artist=${artist}&api_key=${API_KEY}&format=json`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch artist info')
    }

    const data: ArtistInfo = await response.json()
    return data
  } catch (error) {
    throw new Error(`Error in getArtist: ${error.message}`)
  }
}

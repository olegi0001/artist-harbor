import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { SearchResult } from '../../types/searchResult.type'
import { ArtistListItem } from './ArtistListItem'

type ArtistListProps = {
	result: SearchResult
}

export const ArtistList = ({ result }: ArtistListProps) => {
	return (
		<FlatList
			data={result.artist}
			renderItem={({ item }) => <ArtistListItem item={item} />}
			showsVerticalScrollIndicator={false}
		/>
	)
}

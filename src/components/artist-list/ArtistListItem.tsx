import React from 'react'
import { Image, StyleSheet, Text, Pressable } from 'react-native'
import { router } from 'expo-router'

import { findImageSrc } from '../../utils/utils'
import { Artist } from '../../types/searchResult.type'

type ArtistListProps = {
	item: Artist
}

export const ArtistListItem = ({ item }: ArtistListProps) => {
	const openArtist = () => {
		router.push({
			pathname: `/${item.name}`,
			params: { artistName: item.name }
		})
	}

	const fallbackImageSrc = '../../../assets/images/fallbackImage.png'
	const imageSrc = findImageSrc(item.image, 'small')

	return (
		<Pressable style={styles.container} onPress={openArtist}>
			{imageSrc ? (
				<Image source={{ uri: imageSrc }} style={styles.image} />
			) : (
				<Image source={require(fallbackImageSrc)} style={styles.image} />
			)}
			<Text style={styles.artistName}>{item.name}</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 3,
		padding: 6,
		flexDirection: 'row',
		alignItems: 'center'
	},
	artistName: {
		fontSize: 16,
		fontWeight: '500',
		marginLeft: 10
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 6
	}
})

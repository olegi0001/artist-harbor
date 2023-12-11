import React, { useEffect, useState } from 'react'
import { Text, View, Image, ActivityIndicator, StyleSheet, SafeAreaView, useWindowDimensions } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import RenderHtml from 'react-native-render-html'

import { getArtistInfo } from '../api/requests'
import { findImageSrc } from '../utils/utils'
import { ArtistInfo } from '../types/artistInfo.type'
import { ARTIST_IMAGE_WIDTH_PX } from '../constants/constants'

const Artist = () => {
	const router = useRouter()
	const { artistName } = useLocalSearchParams()
	const [artistInfo, setArtistInfo] = useState<ArtistInfo | null>(null)
	const [imageSrc, setImageSrc] = useState<string>(null)
	const [tags, setTags] = useState<string[]>([])
	const [loading, setLoading] = useState(false)
	const { width } = useWindowDimensions()

	useEffect(() => {
		fetchArtistInfo()
	}, [artistName])

	const fetchArtistInfo = async () => {
		setLoading(true)
		try {
			const artistInfo = await getArtistInfo(artistName as string)
			setImageSrc(findImageSrc(artistInfo?.artist.image, 'extralarge'))
			setArtistInfo(artistInfo)
			// Pase tag names
			setTags(artistInfo.artist?.tags?.tag?.map(tag => tag.name) || [])
		} catch (error) {
			console.error('Error fetching artist info:', error)
		} finally {
			setLoading(false)
		}
	}

	const fallbackImageSrc = '../../assets/images/fallbackImage.png'

	return (
		<>
			<SafeAreaView style={{ flex: 1, backgroundColor: '#f0b9ef' }}>
				<LinearGradient colors={['#f0b9ef', '#aed1ef']} style={styles.linearGradient}>
					<FontAwesome
						style={styles.back}
						name="angle-left"
						color="gray"
						size={40}
						onPress={() => {
							router.back()
						}}
					/>
					<View style={styles.container}>
						{loading ? (
							<ActivityIndicator
								animating={loading}
								hidesWhenStopped={true}
								style={styles.loadingIndicator}
								size="small"
								color="gray"
							/>
						) : artistInfo ? (
							<View style={styles.container}>
								{imageSrc ? (
									<Image source={{ uri: imageSrc }} style={styles.artistImage} />
								) : (
									<Image source={require(fallbackImageSrc)} style={styles.artistImage} />
								)}
								<Text style={styles.artistTitleText}>{artistInfo.artist?.name?.toLocaleUpperCase()}</Text>
									<View style={styles.statsRowContainer}>
									{artistInfo.artist?.stats && (
										<>
											<View style={styles.listenersColContainer}>
												<Text style={styles.listenersTitleText}>LISTENERS</Text>
												<Text style={styles.listenersValueText}>{artistInfo.artist.stats.listeners}</Text>
											</View>
											<View style={styles.playsColContainer}>
												<Text style={styles.playsTitleText}>PLAYS</Text>
												<Text style={styles.playsValueText}>{artistInfo.artist.stats.playcount}</Text>
											</View>
										</>
										)}
										{tags.length > 0 && (
											<View style={styles.tagsContainer}>
												{tags.map((tag, index) => (
													<Text key={index} style={styles.tag}>
														#{tag.toLowerCase()}
													</Text>
												))}
											</View>
										)}
									</View>
								{artistInfo.artist?.bio?.summary && (
									<View style={styles.artistBioText}>
										<RenderHtml
											contentWidth={width}
											source={{
												html: `
                      <p style='text-align:justify; font-size:14px; color: #181818'>
                        ${artistInfo.artist.bio.summary}
                      </p>`
											}}
										/>
									</View>
								)}
							</View>
						) : (
							<Text>No artist information available.</Text>
						)}
					</View>
				</LinearGradient>
			</SafeAreaView>
			<SafeAreaView style={{ flex: 0, backgroundColor: '#aed1ef' }} />
		</>
	)
}

export default Artist

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'stretch'
	},
	statsRowContainer: {
		gap: 10,
		flexDirection: 'row',
		alignContent: 'flex-start',
		alignItems: 'center',
		alignSelf: 'stretch',
		marginHorizontal: 50
	},
	loadingIndicator: {
		alignSelf: 'center'
	},
	artistImage: {
		width: ARTIST_IMAGE_WIDTH_PX,
		height: ARTIST_IMAGE_WIDTH_PX,
		aspectRatio: 1,
		borderRadius: ARTIST_IMAGE_WIDTH_PX / 2 // round
	},
	artistTitleText: {
		marginVertical: 30,
		fontSize: 22,
		paddingHorizontal: 50
	},
	artistBioText: {
		marginHorizontal: 50,
		color: '#4D4D4D'
	},
	listenersTitleText: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#272727'
	},
	listenersColContainer: {
		flexDirection: 'column',
		alignContent: 'center',
		alignItems: 'flex-start'
	},
	playsColContainer: {
		flexDirection: 'column',
		alignContent: 'center',
		alignItems: 'flex-start',
		flex: 2
	},
	playsTitleText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#251616'
	},
	listenersValueText: {
		color: '#333333'
	},
	playsValueText: {
		color: '#333333'
	},
	tagsContainer: {
		flexDirection: 'row',
		alignContent: 'center',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		justifyContent: 'flex-end',
		flex: 2
	},
	tag: {
		fontSize: 12,
		textAlign: 'right',
		color: '#666666',
		paddingStart: 8,
	},
	back: {
		marginHorizontal: 30,
		marginVertical: 15,
		alignSelf: 'flex-start'
	},
	linearGradient: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

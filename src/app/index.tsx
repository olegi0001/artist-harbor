import React, { useEffect, useState, useRef } from 'react'
import { TextInput, StyleSheet, View, Animated, Easing, ActivityIndicator, Text } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'

import { SEARCH_QUERY_MIN_LENGTH } from '../constants/constants'
import { ArtistList } from '../components/artist-list/ArtistList'
import { SearchResult } from '../types/searchResult.type'
import { searchArtist } from '../api/requests'

const SearchScreen = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResult, setSearchResult] = useState<SearchResult>(null)
	const [loading, setLoading] = useState(false)
	const [fetchDone, setFetchDone] = useState(true)

	const backgroundColor = useRef(new Animated.Value(0)).current
	const backgroundColorInterpolation = backgroundColor.interpolate({
		inputRange: [0, 1, 2],
		outputRange: ['transparent', '#aed1ef', 'transparent']
	})

	const animateBackgroundColor = () => {
		Animated.loop(
			Animated.timing(backgroundColor, {
				toValue: 1,
				duration: 1500,
				easing: Easing.ease,
				useNativeDriver: false
			})
		).start()
	}

	const stopBackgroundColorAnimation = () => {
		backgroundColor.stopAnimation()
		backgroundColor.setValue(0)
	}

	const isValidSearchQuery = (): boolean => searchQuery.length >= SEARCH_QUERY_MIN_LENGTH

	useEffect(() => {
		let timeoutId: NodeJS.Timeout
		setFetchDone(true)

		if (isValidSearchQuery()) {
			setFetchDone(false)

			// Clear the previous timeout, if any
			if (timeoutId) {
				clearTimeout(timeoutId)
			}

			// Set a new timeout to delay the fetch by 0.3 seconds
			timeoutId = setTimeout(() => {
				fetchSearchResult()
			}, 300)
		} else {
			setLoading(false)
			setSearchResult(null)
		}

		return () => {
			clearTimeout(timeoutId)
		}
	}, [searchQuery])

	useEffect(() => {
		if (loading) {
			animateBackgroundColor()
		} else {
			stopBackgroundColorAnimation()
		}
	}, [loading])

	const fetchSearchResult = async () => {
		// Start loading after timeout, not before. It will seem like shorter loading time for the user
		setLoading(true)
		try {
			const searchResult = await searchArtist(searchQuery)
			setSearchResult(searchResult)
		} catch (e) {
			console.log(e)
		} finally {
			setLoading(false)
			setFetchDone(true)
		}
	}

	return (
		<>
			{/* One safe area view with edge gradient color on top, another on the bottom in order to produce a consistent gradient */}
			<SafeAreaView style={{ flex: 0, backgroundColor: '#f0b9ef' }} />
			<LinearGradient colors={['#f0b9ef', '#aed1ef']} style={styles.linearGradient}>
				<Animated.View style={[{ flex: 1, backgroundColor: backgroundColorInterpolation, alignSelf: 'stretch' }]}>
					<View style={styles.searchbarContainer}>
						<FontAwesome name="search" color="gray" size={16} />
						<TextInput
							style={styles.searchInput}
							placeholder="Search for artists"
							placeholderTextColor="gray"
							onChangeText={(text) => {
								setSearchQuery(text)
							}}
							value={searchQuery}
						/>
					</View>
					<View style={styles.listContainer}>
						<ActivityIndicator
							animating={loading}
							hidesWhenStopped={true}
							style={styles.loadingIndicator}
							size="small"
							color="gray"
						/>
						{searchResult?.artist.length > 0 ? (
							<ArtistList result={searchResult} />
						) : (
							isValidSearchQuery() &&
							fetchDone && (
								<View style={styles.noResultContainer}>
									<Text style={styles.noResultText}>No artists match your search</Text>
								</View>
							)
						)}
					</View>
				</Animated.View>
			</LinearGradient>
			{/*Bottom safe area view for consistent gradient */}
			<SafeAreaView style={{ flex: 0, backgroundColor: '#aed1ef' }} />
		</>
	)
}

export default SearchScreen

const styles = StyleSheet.create({
	searchbarContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		paddingTop: 30,
		paddingBottom: 8,
		paddingHorizontal: 30,
		gap: 8
	},
	listContainer: {
		height: '100%',
		paddingHorizontal: 60
	},
	loadingIndicator: {
		marginLeft: 8
	},
	searchInput: {
		flex: 1,
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 16,
		paddingHorizontal: 16,
		color: 'gray',
		width: '100%'
	},
	linearGradient: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	noResultText: {
		fontWeight: '400',
		color: 'gray'
	},
	noResultContainer: {
		alignItems: 'center',
		justifyContent: 'center'
	}
})

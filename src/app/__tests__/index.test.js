import React from 'react'
import { create, act } from 'react-test-renderer'
import SearchScreen from '../index'

// Mock the API requests module
jest.mock('../../api/requests', () => ({
	searchArtist: jest.fn()
}))

beforeEach(() => {
	jest.clearAllMocks()
})

describe('SearchScreen', () => {
	it('renders correctly', () => {
		const tree = create(<SearchScreen />)
		expect(tree.toJSON()).toMatchSnapshot()
	})
})

it('updates searchQuery state when input changes', () => {
	const component = create(<SearchScreen />)
	const input = component.root.findByType('TextInput')

	act(() => {
		input.props.onChangeText('test')
	})

	expect(component.root.findByType('TextInput').props.value).toBe('test')
})

it('fetches search result on valid search query', async () => {
	const component = create(<SearchScreen />)
	const input = component.root.findByType('TextInput')

	// Simulate typing
	act(() => {
		input.props.onChangeText('randomQuery')
	})

	// Trigger useEffect
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 300))
	})

	// Ensure searchArtist function is called with the correct argument
	expect(require('../../api/requests').searchArtist).toHaveBeenCalledWith('randomQuery')
})

it('does not fetch search result on invalid search query', async () => {
	const component = create(<SearchScreen />)
	const input = component.root.findByType('TextInput')

	// Simulate typing
	act(() => {
		input.props.onChangeText('q')
	})

	// Trigger useEffect
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 300))
	})

	// Ensure searchArtist function is not called
	expect(require('../../api/requests').searchArtist).not.toHaveBeenCalled()
})

it('displays loading indicator when loading state is true', async () => {
	const component = create(<SearchScreen />)
	const input = component.root.findByType('TextInput')

	// Simulate typing
	act(() => {
		input.props.onChangeText('randomQueryForLoading')
	})

	// Trigger useEffect
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 300))
	})

	expect(component.root.findByType('ActivityIndicator')).toBeTruthy()
})

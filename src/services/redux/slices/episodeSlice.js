import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { collection, getDocs } from 'firebase/firestore'
import { dbFirestore } from '../../firebase/firebase'

const initialState = {
	list: [],
	isLoading: false,
	error: null,
}

// ANCHOR[id=thunk-getepisodes] - Fetch Episodes Middleware
const getEpisodes = createAsyncThunk('episodes/get', async (_, { rejectWithValue }) => {
	return getDocs(collection(dbFirestore, 'episodes'))
		.then((querySnapshot) => {
			return Array.from(querySnapshot.docs).map((doc) => ({ id: doc.id, ...doc.data() }))
		})
		.catch((error) => {
			return rejectWithValue({ errorCode: error.code, errorMessage: error.message })
		})
})

//ANCHOR[id=episodesSlice] - Episodes Slice

export const episodesSlice = createSlice({
	name: 'episodes',
	initialState,
	reducers: {},
	extraReducers: {
		// SECTION [getPodcasts]
		[getEpisodes.pending]: (state) => {
			state.isLoading = true
		},
		[getEpisodes.fulfilled]: (state, action) => {
			state.isLoading = false
			state.list = action.payload
			state.error = null
		},
		[getEpisodes.rejected]: (state, action) => {
			state.isLoading = false
			state.list = []
			state.error = action.payload
		},
	},
})
export { getEpisodes }

export default episodesSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { collection, getDocs } from 'firebase/firestore'
import { dbFirestore } from '../../firebase/firebase'

const initialState = {
	list: [],
	selectPodcast: null,
	isLoading: false,
	error: null,
}

// ANCHOR[id=thunk-getpodcasts] - Fetch Podcasts Middleware
const getPodcasts = createAsyncThunk('podcasts/get', async (_, { rejectWithValue }) => {
	return getDocs(collection(dbFirestore, 'podcasts'))
		.then((querySnapshot) => {
			return Array.from(querySnapshot.docs).map((doc) => ({ id: doc.id, ...doc.data() }))
		})
		.catch((error) => {
			return rejectWithValue({ errorCode: error.code, errorMessage: error.message })
		})
})

// ANCHOR[id=thunk-addpodcasts] - Add New Podcasts Middleware
// REVIEW [addPodcasts] - Toast chronology issue
// const addPodcasts = createAsyncThunk('podcasts/post', async ({ title, description, thumbnailObj, bannerObj, createdBy }, { rejectWithValue }) => {
// 	return toast
// 		.promise(
// 			new Promise((resolve) => {
// 				uploadFiles([thumbnailObj, bannerObj]).then((urls) => {
// 					toast.update('uploadingPodcast', {
// 						render: 'Files Uploaded. Creating Podcast...',
// 					})
// 					addDoc(collection(dbFirestore, 'podcasts'), {
// 						title,
// 						description,
// 						thumbnailUrl: urls[0],
// 						bannerUrl: urls[1],
// 						createdBy,
// 						createdAt: Timestamp.now(),
// 						updatedAt: Timestamp.now(),
// 					}).then(() => {
// 						resolve()
// 					})
// 				})
// 			}),

// 			{
// 				pending: 'Hold on! Uploading Files...',
// 				success: {
// 					render: (
// 						<>
// 							<p>Podcast Created Successfully!</p>
// 							<button
// 								onClick={() => {
// 									// TODO: redirect to podcast page
// 								}}>
// 								View Podcast
// 							</button>
// 						</>
// 					),
// 					autoClose: false,
// 				},
// 				error: {
// 					render({ data }) {
// 						// When the promise reject, "data"(only data will work) will contain the error
// 						return data.code.split('/')[1]
// 					},
// 				},
// 			},
// 			{
// 				toastId: 'uploadingPodcast',
// 			}
// 		)
// 		.catch((error) => {
// 			return rejectWithValue({ errorCode: error.code, errorMessage: error.message })
// 		})
// })

//ANCHOR[id=podcastsSlice] - Podcasts Slice

export const podcastsSlice = createSlice({
	name: 'podcasts',
	initialState,
	reducers: {
		selectPodcast: (state, action) => {
			state.selectPodcast = state.list.find((podcast) => podcast.id === action.payload)
		},
	},
	extraReducers: {
		// SECTION [getPodcasts]
		[getPodcasts.pending]: (state) => {
			state.isLoading = true
		},
		[getPodcasts.fulfilled]: (state, action) => {
			state.isLoading = false
			state.isAuthenticated = true
			state.list = action.payload
			state.error = null
		},
		[getPodcasts.rejected]: (state, action) => {
			state.isLoading = false
			state.list = []
			state.error = action.payload
		},
	},
})

export { getPodcasts }

export const { selectPodcast } = podcastsSlice.actions

export default podcastsSlice.reducer

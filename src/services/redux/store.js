import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import appReducer from './slices/appSlice'
import podcastsReducer from './slices/podcastSlice'
import episodesReducer from './slices/episodeSlice'
const store = configureStore({
	reducer: {
		app: appReducer,
		user: userReducer,
		podcasts: podcastsReducer,
		episodes: episodesReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
})

export default store

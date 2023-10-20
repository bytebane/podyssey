import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	isSignupPage: true,
	isForgetPasswordPage: false,
	episodePlaying: null,
}

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		showSignup: (state) => {
			state.isForgetPasswordPage = false
			state.isSignupPage = true
		},
		showSignin: (state) => {
			state.isSignupPage = false
			state.isForgetPasswordPage = false
		},
		showForgetPassword: (state) => {
			state.isSignupPage = false
			state.isForgetPasswordPage = true
		},
		setPlayingEpisode: (state, action) => {
			state.episodePlaying = action.payload
		},
		closePlayingEpisode: (state) => {
			state.episodePlaying = null
		},
	},
})

export const { showSignup, showSignin, showForgetPassword, setPlayingEpisode, closePlayingEpisode } = appSlice.actions

export default appSlice.reducer

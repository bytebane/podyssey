import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { toast } from 'react-toastify'
import uploadFiles from '../../firebase/uploadFiles'

const initialState = {
	data: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
}

const savetoLocalStorage = (key, value) => {
	localStorage.setItem(key, value)
}

// ANCHOR[id=thunk-signup] - Signup Middleware
const signupUser = createAsyncThunk('user/signup', ({ name, email, password, imageFile }, { rejectWithValue }) => {
	return toast
		.promise(
			createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
				await updateProfile(userCredential.user, {
					displayName: name,
				})
				sendEmailVerification(userCredential.user).then(() => {
					toast.success('Verification email sent!', {
						autoClose: 5000,
					})
				})
				uploadFiles([
					{
						name: 'Profile Picture',
						data: imageFile,
						uploadPath: `user/dp-${userCredential.user.uid}`,
					},
				]).then(async (url) => {
					await updateProfile(userCredential.user, {
						photoURL: url[0],
					})
				})
				savetoLocalStorage('hasAccount', true)
				return userCredential.user
			}),
			// .catch((error) => {
			//     return rejectWithValue({ errorCode: error.code, errorMessage: error.message })
			// }),
			{
				pending: 'Creating account...',
				success: 'Successfully signed up!',
				error: {
					render({ data }) {
						// When the promise reject, "data"(only data will work) will contain the error
						return data.code.split('/')[1]
					},
				},
			}
		)
		.catch((error) => {
			return rejectWithValue({ errorCode: error.code, errorMessage: error.message })
		})
})

// ANCHOR[id=thunk-signin] - Signin Middleware.
const signinUser = createAsyncThunk('user/signin', ({ email, password }, { rejectWithValue }) => {
	return toast
		.promise(
			signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
				savetoLocalStorage('hasAccount', true)
				return userCredential.user
			}),
			{
				pending: 'Signing in...',
				success: 'Successfully signed in!',
				error: {
					render({ data }) {
						return data.code.split('/')[1]
					},
				},
			}
		)
		.catch((error) => {
			return rejectWithValue({ errorCode: error.code, errorMessage: error.message })
		})
})

//ANCHOR[id=thunk-signout] - Signout Middleware
const signoutUser = createAsyncThunk('user/signout', () => {
	return toast.promise(auth.signOut(), {
		pending: 'Signing out...',
		success: 'Signed out! See you later!',
		error: {
			render({ data }) {
				return data.code
			},
		},
	})
})

//ANCHOR[id=userSlice] - User Slice

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.isAuthenticated = action.payload.isAuthenticated
			state.data = action.payload.user
		},
	},
	extraReducers: {
		// SECTION [signupUser]
		[signupUser.pending]: (state) => {
			state.isLoading = true
		},
		[signupUser.fulfilled]: (state, action) => {
			state.isLoading = false
			state.isAuthenticated = true
			state.data = action.payload
			state.error = null
		},
		[signupUser.rejected]: (state, action) => {
			state.isLoading = false
			state.isAuthenticated = false
			state.data = null
			state.error = action.payload
		},
		// SECTION [signinUser]
		[signinUser.pending]: (state) => {
			state.isLoading = true
		},
		[signinUser.fulfilled]: (state, action) => {
			state.isLoading = false
			state.isAuthenticated = true
			state.data = action.payload
			state.error = null
		},
		[signinUser.rejected]: (state, action) => {
			state.isLoading = false
			state.isAuthenticated = false
			state.data = null
			state.error = action.payload
		},
		// SECTION [signoutUser]
		[signoutUser.pending]: (state) => {
			state.isLoading = true
		},
		[signoutUser.fulfilled]: (state) => {
			state.data = null
			state.isAuthenticated = false
			state.error = null
			state.isLoading = false
		},
		[signoutUser.rejected]: (state, action) => {
			state.isLoading = false
			state.isAuthenticated = false
			state.data = null
			state.error = action.payload
		},
	},
})

export { signinUser, signupUser, signoutUser }

export const { setUser } = userSlice.actions

export default userSlice.reducer

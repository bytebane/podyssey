import React, { Suspense, lazy, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import NavBar from './components/NavBar'
import { navOptions } from './services/routing/nav'
import { setUser } from './services/redux/slices/userSlice'
import { closePlayingEpisode } from './services/redux/slices/appSlice'

import './App.css'

const Audio = lazy(() => import('./components/Audio/Audio'))

function App() {
	const navigate = useNavigate()

	const dispatch = useDispatch()

	const episodePlaying = useSelector((state) => state.app.episodePlaying)

	const userState = useSelector((state) => state.user)

	const auth = getAuth()

	// Adding event listener to check if user is signed in
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user && !userState.isLoading) {
				// User is signed in.
				dispatch(setUser({ isAuthenticated: true, user }))
				navigate('/podcasts')
			} else {
				// User is not signed in.
				dispatch(setUser({ isAuthenticated: false, user: null }))
				dispatch(closePlayingEpisode())
				navigate('/')
			}
		})
	}, [])

	return (
		<>
			{/* NavBar Component */}
			<NavBar />

			{/* Protected Routes */}
			<Routes>
				{navOptions.map((route, index) => {
					if (route.isProtected && auth.currentUser) {
						return (
							<Route
								key={index}
								path={route.path}
								element={route.element}
							/>
						)
					} else if (!route.isProtected) {
						return (
							<Route
								key={index}
								path={route.path}
								element={route.element}
							/>
						)
					}
				})}
			</Routes>

			{/* Audio Component */}
			<Suspense fallback={<></>}>{episodePlaying && <Audio />}</Suspense>

			<ToastContainer
				position="top-right"
				autoClose={1500}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</>
	)
}

export default App

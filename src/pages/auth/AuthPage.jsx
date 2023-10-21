import React, { createRef, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'

import { auth } from '../../services/firebase/firebase'
import { signinUser, signupUser } from '../../services/redux/slices/userSlice'
import { showForgetPassword, showSignin, showSignup } from '../../services/redux/slices/appSlice'

import InputBox from '../../components/InputBox'
import { ButtonSkeleton } from '../../components/Skeletons'

import { AddImageIcon } from '../../assets'
import './AuthPage.css'

function AuthPage() {
	const appState = useSelector((state) => state.app)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const imageInputRef = createRef()
	const [imageFile, setImageFile] = useState()

	const userState = useSelector((state) => state.user)

	const [isBackButton, setIsBackButton] = React.useState(true)

	const handleSignin = (event) => {
		event.preventDefault()

		const email = event.target.email.value
		const password = event.target.password.value
		// Validate email and password
		if (!email || !password) return toast.error('Please enter email and password')
		if (password.length < 6) return toast.error('Password should be more than 6 characters')

		dispatch(signinUser({ email, password }))

		// Reset form
		event.target.reset()
	}
	const handleSignup = (event) => {
		event.preventDefault()

		const name = event.target.name.value.trim()
		const email = event.target.email.value.trim()
		const password = event.target.password.value
		const confirmPassword = event.target.confirmPassword.value

		// Validate
		if (!name || !email || !password || !confirmPassword) return toast.error('All fields are Mandatory')
		if (password !== confirmPassword) return toast.error('Passwords do not match')
		if (password.length < 6) return toast.error('Password should be more than 6 characters')
		if (name && name.split(' ').length < 2) return toast.error('Please enter full name')
		if (!imageFile) return toast.error('Please select a profile picture')

		dispatch(signupUser({ name, email, password, imageFile }))

		// Reset form
		event.target.reset()
	}

	const handleForgetPassword = async (event) => {
		event.preventDefault()

		if (isBackButton) return dispatch(showSignin())

		const email = event.target.email.value
		if (!email) return toast.error('Please enter email')

		toast.loading('Sending Email...', {
			toastId: 'sendEmail',
		})

		// Send Email
		try {
			await sendPasswordResetEmail(auth, email)
			toast.update('sendEmail', {
				render: 'An email with a password reset link has been sent to your email address.',
				type: 'success',
				isLoading: false,
				autoClose: 5000,
				toastId: 'sendEmail',
				closeButton: true,
			})
			dispatch(showSignin())
		} catch (error) {
			toast.update('sendEmail', {
				render: error.message,
				type: 'error',
				isLoading: false,
				autoClose: 2000,
				toastId: 'sendEmail',
				closeButton: true,
			})
		}
	}

	useEffect(() => {
		const hasAccount = localStorage.getItem('hasAccount')
		if (hasAccount) {
			dispatch(showSignin())
		}
		if (userState.isAuthenticated) {
			navigate('/podcasts')
		}
	}, [])

	return appState.isSignupPage ? signUp() : !appState.isForgetPasswordPage ? signIn() : forgotPassword()

	function signUp() {
		return (
			<main
				className="auth"
				style={{ paddingTop: '5rem' }}>
				<h1>Sign Up</h1>
				<form
					key={'signup'}
					className="auth-form"
					onSubmit={handleSignup}>
					<div className="dp-holder">
						{imageFile ? (
							<img
								className="dp"
								src={URL.createObjectURL(imageFile)}
								alt="profilePicture"
							/>
						) : (
							<div className="dp">Choose a profile picture</div>
						)}
						<img
							onClick={() => imageInputRef.current.click()}
							style={{ cursor: 'pointer', opacity: `${imageFile ? '0.8' : '1'}` }}
							className="add-image-ic"
							src={AddImageIcon}
							alt="pick-image"
						/>
					</div>
					<input
						ref={imageInputRef}
						type="file"
						accept="image/*"
						style={{ display: 'none' }}
						onChange={(e) => setImageFile(e.target.files[0])}
					/>

					<InputBox
						type="text"
						name="name"
						placeholder="Full Name"
					/>
					<InputBox
						type="email"
						name="email"
						placeholder="Email"
					/>
					<InputBox
						type="password"
						name="password"
						placeholder="Password"
					/>
					<InputBox
						type="password"
						name="confirmPassword"
						placeholder="Confirm Password"
					/>
					{userState.isLoading ? (
						<ButtonSkeleton />
					) : (
						<InputBox
							type="submit"
							value="Sign Up"
						/>
					)}
				</form>

				<div className="auth-choice">
					Already have an account?{' '}
					<span
						className="btn-text"
						onClick={() => dispatch(showSignin())}>
						Sign In
					</span>
				</div>
			</main>
		)
	}

	function signIn() {
		return (
			<main className="auth">
				<h1>Sign In</h1>
				<form
					key={'signin'}
					className="auth-form"
					onSubmit={handleSignin}>
					<InputBox
						type="email"
						name="email"
						placeholder="Email"
					/>
					<InputBox
						type="password"
						name="password"
						placeholder="Password"
					/>
					{userState.isLoading ? (
						<ButtonSkeleton />
					) : (
						<InputBox
							type="submit"
							value="Sign IN"
						/>
					)}
				</form>

				<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
					<span
						onClick={() => dispatch(showForgetPassword())}
						className="btn-text">
						Forgot Password?
					</span>
				</div>
				<div className="auth-choice">
					{"Don't have an account? "}
					<span
						className="btn-text"
						onClick={() => dispatch(showSignup())}>
						Sign Up
					</span>
				</div>
			</main>
		)
	}

	function forgotPassword() {
		return (
			<main className="auth">
				<h1>Reset Password</h1>
				<form
					key={'reset'}
					className="auth-form"
					onSubmit={handleForgetPassword}>
					<InputBox
						type="email"
						name="email"
						placeholder="Email"
						onChange={(e) => (e.target.value ? setIsBackButton(false) : setIsBackButton(true))}
					/>

					<InputBox
						type="submit"
						value={isBackButton ? 'Back' : 'Send Reset Link'}
					/>
				</form>
			</main>
		)
	}
}

export default AuthPage

import React, { createRef, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { sendEmailVerification, updateEmail, updateProfile } from 'firebase/auth'
import ProgressiveImage from 'react-progressive-graceful-image'

import { auth } from '../../services/firebase/firebase'
import { uploadFile } from './../../services/firebase/uploadFiles'
import { getPodcasts } from '../../services/redux/slices/podcastSlice'

import InputBox from '../../components/InputBox'
import { PodcastCard as Card } from '../../components/Card'
import { CardSkeleton, ImageSkeleton } from '../../components/Skeletons'

import { AddImageIcon, UnVerifiedIcon, VerifiedIcon } from '../../assets'
import './ProfilePage.css'

const ProfilePage = () => {
	const userData = useSelector((state) => state.user.data)

	const podcasts = useSelector((state) => state.podcasts)
	const episodes = useSelector((state) => state.episodes)

	const dispatch = useDispatch()
	const [editing, setEditing] = useState(false)
	const [imageFile, setImageFile] = useState()
	const [imageUrl, setImageUrl] = useState()

	const navigate = useNavigate()

	const imageInputRef = createRef()

	const handleVerifyClick = () => {
		if (auth.currentUser.emailVerified) {
			return toast.info('Email is already verified')
		}
		sendEmailVerification(auth.currentUser)
			.then(() => {
				toast.success('Verification mail has been sent to your email address.')
			})
			.catch((error) => {
				toast.error(error.message)
			})
	}

	// ANCHOR EditProfile. Get Form Data and Update Firebase Users
	const handleEdit = () => {
		event.preventDefault()

		// Show Edit
		if (!editing) {
			return setEditing(true)
		}

		const name = event.target.name.value
		const email = event.target.email.value

		// Cancel Editing
		if (!name && !email && !imageFile) {
			return setEditing(false)
		}

		// Validate full name
		if (name && name.split(' ').length < 2) {
			return toast.error('Please enter full name')
		}

		// Update Profile Picture
		if (imageFile) {
			uploadFile({ name: 'Profile Picture', data: imageFile, uploadPath: `user/dp-${auth.currentUser.uid}` })
				.then((url) => {
					updateProfile(auth.currentUser, {
						photoURL: url,
					})
					setImageUrl(url)
				})
				.then(() => {
					setEditing(false)
					setImageFile(null)
				})
		}
		// Update Name and Email
		if (name && email) {
			updateProfile(auth.currentUser, {
				displayName: name,
				email,
			}).then(() => {
				setEditing(false)
			})
		}
		// Update only Name
		if (name) {
			updateProfile(auth.currentUser, {
				displayName: name,
			})
		}
		// Update only Email
		if (email) {
			updateEmail(auth.currentUser, email)
				.then(() => {
					console.log('Email updated')
					setEditing(false)
				})
				.catch((error) => {
					console.log(error)
				})
		}
		// Reset Form
		event.target.reset()
	}

	// Set Image URL and get Podcasts if not already loaded
	useEffect(() => {
		setImageUrl(auth.currentUser.photoURL)
		if (!podcasts.list.length > 0) dispatch(getPodcasts())
	}, [])

	return (
		<main className="profile-container">
			<form onSubmit={handleEdit}>
				<section className="profile">
					<InputBox
						className="edit-btn"
						type="submit"
						width="fit-content"
						value={editing ? 'Save / Cancel' : 'Edit'}
					/>
					<input
						ref={imageInputRef}
						type="file"
						accept="image/*"
						style={{ display: 'none' }}
						onChange={(e) => setImageFile(e.target.files[0])}
					/>

					<h1>Profile</h1>
					<div style={{ position: 'relative' }}>
						{imageFile ? (
							<img
								className="profile-image"
								src={URL.createObjectURL(imageFile)}
								alt="profilePicture"
							/>
						) : (
							imageUrl && (
								<ProgressiveImage
									src={imageUrl}
									placeholder="">
									{(src, loading) => {
										return loading ? (
											<div className="profile-image">
												<ImageSkeleton dp />
											</div>
										) : (
											<img
												className={`profile-image ${editing && 'edit-image'}`}
												src={src}
												alt="profilePicture"
											/>
										)
									}}
								</ProgressiveImage>
							)
						)}
						{editing && (
							<img
								onClick={() => imageInputRef.current.click()}
								style={{ cursor: 'pointer', opacity: `${imageFile ? '0.2' : '1'}` }}
								className="edit-image-ic"
								src={AddImageIcon}
								alt="edit_icon"
							/>
						)}
					</div>
					<div className="user-data">
						{editing ? (
							<InputBox
								width="80%"
								type="text"
								name="name"
								placeholder={`Name: ${userData.displayName}`}
								style={{ margin: '3% 10%', marginTop: '5%', textAlign: 'center', letterSpacing: '0.15rem' }}
							/>
						) : (
							<div className="name-container">
								<h3>{userData.displayName}</h3>
								<img
									className="verified-badge"
									src={auth.currentUser.emailVerified ? VerifiedIcon : UnVerifiedIcon}
									alt="Verification Badge"
									onClick={handleVerifyClick}
								/>
							</div>
						)}
						{editing ? (
							<InputBox
								width="80%"
								type="email"
								name="email"
								placeholder={`Email: ${userData.email}`}
								style={{ margin: '3% 10%', marginBottom: '6%', textAlign: 'center', letterSpacing: '0.15rem' }}
							/>
						) : (
							<p>
								Email-Id:&nbsp;&nbsp;<span> {userData.email}</span>
							</p>
						)}
						<p>
							Total Uploads:&nbsp;&nbsp;<span>{podcasts.list.filter((podcast) => podcast.createdBy === auth.currentUser.uid).length} Podcasts </span>&nbsp; ● &nbsp;&nbsp;<span>{episodes.list.filter((episode) => episode.createdBy === auth.currentUser.uid).length} Episodes</span>
						</p>
					</div>
				</section>
			</form>
			<section className="podcast">
				<h2>My Podcasts</h2>
				<div className="card-grid">
					{podcasts.isLoading
						? Array(2)
								.fill(0)
								.map((_, index) => <CardSkeleton key={index} />)
						: podcasts.list.length > 0 && // eslint-disable-next-line no-mixed-spaces-and-tabs
						  podcasts.list
								.filter((podcast) => podcast.createdBy === auth.currentUser.uid)
								.map((podcast) => {
									return (
										<Card
											key={podcast.id}
											cardImage={podcast.thumbnailUrl}
											cardTitle={podcast.title}
											cardSubtitle={podcast.description}
											cardOnClick={() => {
												navigate(`/podcast/${podcast.id}`)
											}}
										/>
									)
								})}
				</div>
			</section>
		</main>
	)
}

export default ProfilePage

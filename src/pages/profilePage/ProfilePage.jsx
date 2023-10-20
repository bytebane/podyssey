import React, { createRef, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateEmail, updateProfile } from 'firebase/auth'

import { auth } from '../../services/firebase/firebase'
import { uploadFile } from './../../services/firebase/uploadFiles'
import { getPodcasts } from '../../services/redux/slices/podcastSlice'

import InputBox from '../../components/InputBox'
import { PodcastCard as Card } from '../../components/Card'
import { CardSkeleton } from '../../components/Skeletons/Skeletons'

import cameraIcon from '../../assets/camera-ic.svg'
import PlaceholderImage from '../../assets/aa.png'

import './ProfilePage.css'

const ProfilePage = () => {
	const userData = useSelector((state) => state.user.data)

	const podcasts = useSelector((state) => state.podcasts)

	const dispatch = useDispatch()
	const [editing, setEditing] = useState(false)
	const [imageFile, setImageFile] = useState()

	const navigate = useNavigate()

	const imageInputRef = createRef()

	useEffect(() => {
		if (!podcasts.list.length > 0) dispatch(getPodcasts())
	}, [])

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

		if (name && name.split(' ').length < 2) {
			return toast.error('Please enter full name')
		}

		if (imageFile) {
			uploadFile({ name: 'Profile Picture', data: imageFile, uploadPath: `user/dp-${auth.currentUser.uid}` })
				.then((url) => {
					updateProfile(auth.currentUser, {
						photoURL: url,
					})
				})
				.then(() => {
					setEditing(false)
					setImageFile(null)
				})
		}
		if (name && email) {
			updateProfile(auth.currentUser, {
				displayName: name,
				email,
			}).then(() => {
				setEditing(false)
			})
		}
		if (name) {
			updateProfile(auth.currentUser, {
				displayName: name,
			})
		}
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

		event.target.reset()
	}

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
						) : userData.photoURL ? (
							<img
								className={`profile-image ${editing && 'edit-image'}`}
								src={userData.photoURL}
								alt="profilePicture"
							/>
						) : (
							<img
								className={`profile-image ${editing && 'edit-image'}`}
								src={PlaceholderImage}
								alt="profilePicture"
							/>
						)}
						{editing && (
							<img
								onClick={() => imageInputRef.current.click()}
								style={{ cursor: 'pointer', opacity: `${imageFile ? '0.2' : '1'}` }}
								className="edit-image-ic"
								src={cameraIcon}
								alt="edit_icon"></img>
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
							<h3>{userData.displayName}</h3>
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
							Total Uploads:&nbsp;&nbsp;<span>00 Podcasts </span>&nbsp; ● &nbsp;&nbsp;<span>00 Episodes</span>
						</p>
					</div>
				</section>
			</form>
			<section className="podcast">
				<h2>My Podcasts</h2>
				<div className="card-grid">
					{/* TODO map all podcasts cerated by user as Cards */}

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

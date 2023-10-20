import React from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'

import uploadFiles from '../../services/firebase/uploadFiles'
import { dbFirestore } from '../../services/firebase/firebase'
import { getPodcasts } from '../../services/redux/slices/podcastSlice'

import InputBox from '../../components/InputBox'

import './AddPodcast.css'
import { ButtonSkeleton } from '../../components/Skeletons'

const AddPodcastPage = () => {
	const UserInfo = useSelector((state) => state.user.data)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [loading, setLoading] = React.useState(false)

	const createNewPodcast = async (event) => {
		event.preventDefault()

		const inputTitle = event.target.title.value.trim()
		const inputDescription = event.target.description.value.trim()
		const inputThumbnail = event.target.thumbnail.files[0]
		const inputBanner = event.target.banner.files[0]

		// Validations
		if (!inputTitle || !inputDescription) {
			toast.error('All fields are Mandatory')
			return
		}
		if (!inputBanner || !inputThumbnail) {
			toast.error('Images are Mandatory')
			return
		}
		if (inputDescription.length < 10) {
			toast.error('Description should be more than 10 characters')
			return
		}
		if (inputTitle.length < 3) {
			toast.error('Title should be more than 3 characters')
			return
		}
		if (inputTitle.length > 100) {
			toast.error('Title should be less than 100 characters')
			return
		}
		if (inputDescription.length > 500) {
			toast.error('Description should be less than 500 characters')
			return
		}
		if (inputThumbnail.size > 1048576) {
			toast.error('Thumbnail should be less than 1MB')
			return
		}
		if (inputBanner.size > 5242880) {
			toast.error('Banner should be less than 5MB')
			return
		}

		// Upload Files & Create New Podcast
		setLoading(true)
		toast.loading('Hold on! Uploading Files...', {
			toastId: 'uploadingPodcast',
		})
		uploadFiles([
			{ name: 'thumbnail', data: inputThumbnail, uploadPath: `podcasts/thumbnails/${Date.now()}` },
			{ name: 'banner', data: inputBanner, uploadPath: `podcasts/banners/${Date.now()}` },
		]).then(async (urls) => {
			toast.update('uploadingPodcast', {
				render: 'Files Uploaded. Creating Podcast...',
				type: 'info',
				closeButton: true,
			})
			await addDoc(collection(dbFirestore, 'podcasts'), {
				title: inputTitle,
				description: inputDescription,
				thumbnailUrl: urls[0],
				bannerUrl: urls[1],
				createdBy: UserInfo.uid,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			})
				.then((docRef) => {
					dispatch(getPodcasts()).then(() => {
						toast.update('uploadingPodcast', {
							type: 'success',
							isLoading: false,
							closeButton: true,
							render: (
								<>
									<p>Podcast Created Successfully!</p>
									<button
										onClick={() => {
											toast.dismiss('uploadingPodcast')
											navigate(`/podcast/${docRef.id}`)
										}}>
										View Podcast
									</button>
								</>
							),
						})
						setLoading(false)
						event.target.reset()
					})
				})
				.catch((err) => {
					toast.update('uploadingPodcast', {
						render: 'Podcast Creation Failed ' + err,
						type: 'error',
						isLoading: false,
						autoClose: 2000,
					})
					setLoading(false)
				})
		})
	}
	return (
		<main className="add-podcast">
			<h1>Create a Podcast</h1>
			<form
				key={'signin'}
				className="auth-form"
				onSubmit={createNewPodcast}>
				<InputBox
					type="text"
					name="title"
					placeholder="Podcast Title"
					required
				/>
				<label style={{ width: '100%' }}>
					Select a Thumbnail Image
					<InputBox
						type="file"
						name="thumbnail"
						accept="image/*"
						placeholder="Thumbnail"
					/>
				</label>
				<label style={{ width: '100%' }}>
					Select a Banner Image
					<InputBox
						type="file"
						name="banner"
						accept="image/*"
						placeholder="Banner Image"
					/>
				</label>
				<InputBox
					type="textarea"
					name="description"
					placeholder="Podcast Description"
					maxLength={500}
					required
				/>

				{loading ? (
					<ButtonSkeleton />
				) : (
					<InputBox
						type="submit"
						value="Create New"
					/>
				)}
			</form>
		</main>
	)
}

export default AddPodcastPage

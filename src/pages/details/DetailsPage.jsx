import { PopupForm } from '../../components/PopupForm/PopupForm'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getPodcasts, selectPodcast } from '../../services/redux/slices/podcastSlice'

import { toast } from 'react-toastify'
import uploadFiles from '../../services/firebase/uploadFiles'
import { addDoc, collection } from 'firebase/firestore'
import { auth, dbFirestore } from '../../services/firebase/firebase'
import { getEpisodes } from '../../services/redux/slices/episodeSlice'

import { EpisodeCard as Card } from '../../components/Card'
import { CardWithTextSkeleton } from '../../components/Skeletons/Skeletons'
import { setPlayingEpisode } from '../../services/redux/slices/appSlice'

import './DetailsPage.css'

const DetailsPage = () => {
	const params = useParams()

	const podcasts = useSelector((state) => state.podcasts)

	const podcastData = useSelector((state) => state.podcasts.selectPodcast)
	const episodesData = useSelector((state) => state.episodes)
	const formRef = useRef(null)

	const dispatch = useDispatch()

	useEffect(() => {
		if (!podcasts.list.length > 0) dispatch(getPodcasts())
		dispatch(selectPodcast(params.id))
	}, [])

	// ANCHOR AddNewEpisode
	const handleAddNewEpisode = () => {
		event.preventDefault()

		const title = event.target.title.value
		const description = event.target.description.value

		const audio = event.target.audio.files[0]

		if (!audio) return

		toast.loading('Hold on! Uploading Files...', {
			toastId: 'uploadingEpisode',
		})

		uploadFiles([{ name: 'audio', data: audio, uploadPath: `episodes/audio/${Date.now()}` }])
			.then(async (urls) => {
				toast.update('uploadingEpisode', {
					render: 'Files Uploaded. Creating Episode...',
				})

				await addDoc(collection(dbFirestore, 'episodes'), {
					podcastId: params.id,
					title: title,
					description: description,
					audioUrl: urls[0],
					thumbnailUrl: podcastData.thumbnailUrl,
					createdBy: auth.currentUser.uid,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				}).then(() => {
					toast.update('uploadingEpisode', {
						type: 'success',
						isLoading: false,
						closeButton: true,
						autoClose: 2000,
						render: 'Episode Created Successfully!',
					})
					dispatch(getEpisodes())
				})
			})

			.finally(() => {
				formRef.current.close()
			})
	}

	return (
		<>
			{podcastData && (
				<main className="podcast-details">
					<section className="podcast-info">
						<h2>{podcastData.title}</h2>
						<div className="image-stack">
							<img
								className="podcast-banner"
								src={podcastData.bannerUrl}
								alt={podcastData.title}
							/>
							<img
								className="podcast-thumbnail"
								src={podcastData.thumbnailUrl}
								alt={podcastData.title}
							/>
						</div>
						<p>{podcastData.description}</p>
					</section>
					<section className="episodes">
						<div className="episodes-header">
							<h2>Episodes</h2>
							{/* ANCHOR AddNewEpisode */}
							{podcastData.createdBy === auth.currentUser.uid && (
								<PopupForm
									formRef={formRef}
									handleAddNewEpisode={handleAddNewEpisode}
									disabled={episodesData.isLoading}
								/>
							)}
						</div>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
							{episodesData.isLoading ? (
								Array.from({ length: 8 }).map((_, index) => <CardWithTextSkeleton key={index} />)
							) : episodesData.list.filter((episode) => episode.podcastId === params.id) <= 0 ? (
								<h3>No Episodes Found.</h3>
							) : (
								episodesData.list
									.filter((episode) => episode.podcastId === params.id)
									.map((episode) => {
										return (
											<Card
												key={episode.id}
												episode={episode}
												onClick={() => {
													dispatch(setPlayingEpisode(episode))
												}}
											/>
										)
									})
							)}
						</div>
					</section>
				</main>
			)}
		</>
	)
}

export default DetailsPage

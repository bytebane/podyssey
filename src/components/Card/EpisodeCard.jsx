import React from 'react'
import PlayIcon from '../../assets/play.svg'

import './Card.css'
import ProgressiveImage from 'react-progressive-graceful-image'
import { ImageSkeleton } from '../Skeletons/Skeletons'

function EpisodeCard({ episode, onClick }) {
	return (
		<div className="episode-card">
			<ProgressiveImage
				src={episode.thumbnailUrl}
				placeholder="">
				{(src, loading) => {
					return loading ? (
						<div>
							<ImageSkeleton
								className={'episode-thumbnail'}
								width={'110px'}
								height={'110px'}
							/>
						</div>
					) : (
						<img
							className="episode-thumbnail"
							src={src}
							alt={episode.title}
						/>
					)
				}}
			</ProgressiveImage>

			<img
				className="eposode-play"
				src={PlayIcon}
				onClick={onClick}
				alt=""
			/>
			<div className="episode-meta">
				<h4>{episode.title}</h4>
				<p>{episode.description}</p>
			</div>
		</div>
	)
}

export default EpisodeCard

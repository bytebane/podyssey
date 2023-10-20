import React from 'react'
import PlayIcon from '../../assets/play.svg'

import './Card.css'

function EpisodeCard({ episode, onClick }) {
	return (
		<div className="episode-card">
			<img
				className="episode-thumbnail"
				src={episode.thumbnailUrl}
				alt={episode.title}
			/>
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

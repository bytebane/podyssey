import React from 'react'
import ProgressiveImage from 'react-progressive-graceful-image'

import { ImageSkeleton } from '../Skeletons/Skeletons'

import { PlayIcon } from '../../assets'

import './Card.css'

const PodcastCard = ({ cardImage, cardTitle, cardOnClick, cardActionOnClick }) => {
	return (
		<div
			style={{ cursor: `${cardOnClick && 'pointer'}` }}
			className="card"
			onClick={cardOnClick}>
			<ProgressiveImage
				src={cardImage}
				placeholder="">
				{(src, loading) => {
					return loading ? (
						<div>
							<ImageSkeleton
								className={'card-image'}
								width={'20.8125rem'}
								height={'18.8125rem'}
							/>
						</div>
					) : (
						<img
							style={{
								height: `${!cardActionOnClick && '90%'}`,
							}}
							className="card-image"
							src={src}
							alt={cardTitle}
						/>
					)
				}}
			</ProgressiveImage>

			<div className="card-content">
				<h4>{cardTitle}</h4>
			</div>
			{cardActionOnClick && (
				<>
					<div className="card-action">
						<div
							className="card-action-button"
							onClick={cardActionOnClick}>
							{PlayIcon}
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default PodcastCard

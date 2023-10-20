import React from 'react'
import './Card.css'

const PodcastCard = ({ cardImage, cardTitle, cardOnClick, cardActionOnClick }) => {
	return (
		<div
			style={{ cursor: `${cardOnClick && 'pointer'}` }}
			className="card"
			onClick={cardOnClick}>
			<img
				style={{
					height: `${!cardActionOnClick && '90%'}`,
				}}
				className="card-image"
				src={cardImage}
				alt={cardTitle}
			/>

			<div className="card-content">
				<h4>{cardTitle}</h4>
			</div>
			{cardActionOnClick && (
				<>
					<div className="card-action">
						<div
							className="card-action-button"
							onClick={cardActionOnClick}>
							<svg
								stroke="#fff"
								fill="#fff"
								strokeWidth="0"
								viewBox="0 0 1024 1024"
								height="2em"
								width="2em"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
								<path d="M719.4 499.1l-296.1-215A15.9 15.9 0 0 0 398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 0 0 0-25.8zm-257.6 134V390.9L628.5 512 461.8 633.1z"></path>
							</svg>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default PodcastCard

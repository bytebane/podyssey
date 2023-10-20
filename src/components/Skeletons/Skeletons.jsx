import React from 'react'
import './Skeleton.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Skeleton Loader for Button
export const ButtonSkeleton = () => {
	return (
		<SkeletonTheme
			baseColor="rgba(65, 48, 90, 0.01)"
			// baseColor="rgba(58, 129, 191, 0.3)"
		>
			<div className="skeleton-button">
				<Skeleton
					inline
					style={{ width: '100%', padding: '1rem', borderRadius: '0.625rem' }}
					count={1}
				/>
				<p className="skeleton-text">Loading...</p>
			</div>
		</SkeletonTheme>
	)
}

export const ImageSkeleton = ({ className, dp, width, height }) => {
	return (
		<SkeletonTheme
			highlightColor="#20062e60"
			baseColor="rgba(58, 129, 191, .15)">
			<div className={className ?? 'image-skeleton'}>
				<Skeleton
					style={{ borderRadius: `${dp && '100%'}` }}
					width={width ?? '100%'}
					height={height ?? '100%'}
				/>
			</div>
		</SkeletonTheme>
	)
}
// Skeleton Loader for Card
export const CardSkeleton = () => {
	return (
		<SkeletonTheme
			highlightColor="#20062e60"
			baseColor="rgba(58, 129, 191, .15)">
			<div className="card-skeleton">
				<Skeleton
					width={'85%'}
					height={'85%'}
					style={{ position: 'absolute', left: 25, top: 25 }}
				/>
			</div>
		</SkeletonTheme>
	)
}

// Skeleton Loader for Card with Title and button
export const CardWithTextSkeleton = () => {
	return (
		<SkeletonTheme
			highlightColor="#20062e60"
			baseColor="rgba(58, 129, 191, .15)">
			<div className="card-skeleton">
				<Skeleton
					width={'85%'}
					height={'75%'}
					style={{ position: 'absolute', left: 25, top: 25 }}
				/>
				<Skeleton
					width={'70%'}
					height={'1.5rem'}
					style={{ marginLeft: 25, position: 'absolute', left: 0, bottom: 24 }}
				/>

				<Skeleton
					circle
					width={40}
					height={40}
					style={{ position: 'absolute', right: 25, bottom: 15 }}
				/>
			</div>
		</SkeletonTheme>
	)
}

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { closePlayingEpisode } from '../../services/redux/slices/appSlice'

import PlayIcon from '../../assets/play.svg'
import PauseIcon from '../../assets/pause.svg'
import SeekIcon from '../../assets/seek.svg'
import RewindIcon from '../../assets/rewind.svg'
import MuteIcon from '../../assets/volume-mute.svg'
import VolumeLowIcon from '../../assets/volume-low.svg'
import VolumeFullIcon from '../../assets/volume-full.svg'

import './Audio.css'

const Audio = () => {
	const audioRef = React.useRef()
	const dispatch = useDispatch()

	const episode = useSelector((state) => state.app.episodePlaying)

	const [playing, setPlaying] = React.useState(true)
	const [progress, setProgress] = React.useState(0)
	const [volume, setVolume] = React.useState(1)
	const [isMuted, setIsMuted] = React.useState(false)

	// Adding Event Listners [Timeupdate, Ended]
	useEffect(() => {
		const audio = audioRef.current
		audio.addEventListener('timeupdate', handleProgressChange)
		audio.addEventListener('ended', handleEnded)

		// Removing Event Listners
		return () => {
			audio.removeEventListener('timeupdate', handleProgressChange)
			audio.removeEventListener('ended', handleEnded)
		}
	}, [])

	// Play/Pause Audio
	useEffect(() => {
		if (playing) {
			audioRef.current.play()
		} else {
			audioRef.current.pause()
		}
	}, [playing])

	const togglePlaying = () => {
		setPlaying((prevPlaying) => !prevPlaying)
	}

	// To play new/change episode while already playing
	useEffect(() => {
		setPlaying(true)
		audioRef.current.play()
	}, [episode])

	// Update Progress
	const handleProgressSeek = (e) => {
		setProgress(Number(e.target.value))
		audioRef.current.currentTime = Number(e.target.value)
	}

	const handleProgressChange = () => {
		setProgress(Number(audioRef.current.currentTime))
	}

	// Mute/Unmute Audio
	useEffect(() => {
		audioRef.current.muted = isMuted
	}, [isMuted])

	const toggleMute = () => {
		setIsMuted((prevIsMuted) => !prevIsMuted)
	}
	const handleVolumeChange = (e) => {
		setVolume(Number(e.target.value))
		audioRef.current.volume = Number(e.target.value)
	}

	// Handle Playing End
	const handleEnded = () => {
		setPlaying(false)
		setProgress(0)
	}

	// Format Time in seconds to Minutes:Seconds
	function formatTime(timeInSec) {
		let min = Math.floor(timeInSec / 60)
		min = min >= 10 ? min : '0' + min
		let sec = Math.floor(timeInSec % 60)
		sec = sec >= 10 ? sec : '0' + sec
		return min + ':' + sec
	}

	return (
		<footer className="audio-player">
			<audio
				ref={audioRef}
				src={episode.audioUrl}
				style={{ display: 'none' }}
			/>
			<img
				className="thumbnail"
				src={episode.thumbnailUrl}
				alt=""
			/>
			<div className="player-controls">
				<img
					className="rewind"
					src={RewindIcon}
					onClick={() => {
						audioRef.current.currentTime -= 10
					}}
				/>
				<img
					className="play-pause"
					src={playing ? PauseIcon : PlayIcon}
					onClick={togglePlaying}
				/>
				<img
					className="seek"
					src={SeekIcon}
					onClick={() => {
						audioRef.current.currentTime += 10
					}}
				/>
			</div>
			{audioRef.current && (
				<div className="progress-container">
					<p>{audioRef.current.duration ? formatTime(audioRef.current.duration) : '00:00'}</p>

					<input
						className="progress-slider"
						type="range"
						name="progress"
						id="progress"
						min="0"
						max={audioRef.current.duration}
						step={0.01}
						value={progress}
						onChange={handleProgressSeek}
					/>

					<p>-{audioRef.current.duration ? formatTime(audioRef.current.duration - progress) : '00:00'}</p>
				</div>
			)}
			<div className="volume-container">
				<img
					className="volume-icon"
					src={volume === 0 || isMuted ? MuteIcon : volume <= 0.4 ? VolumeLowIcon : VolumeFullIcon}
					onClick={toggleMute}
				/>
				<input
					className="volume-slider"
					type="range"
					name="volume"
					id="volume"
					min="0"
					max="1"
					step="0.1"
					value={isMuted ? 0 : volume}
					onChange={handleVolumeChange}
				/>
			</div>
			<button
				className="close-player"
				onClick={() => dispatch(closePlayingEpisode())}>
				X
			</button>
		</footer>
	)
}

export default Audio

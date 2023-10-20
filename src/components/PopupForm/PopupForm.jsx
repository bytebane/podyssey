import React from 'react'
import Popup from 'reactjs-popup'
import InputBox from '../InputBox'

import './PopupForm.css'
import { ButtonSkeleton } from '../Skeletons'

export function PopupForm({ formRef, handleAddNewEpisode, disabled }) {
	return (
		<Popup
			ref={formRef}
			trigger={
				<button
					style={{
						color: 'white',
						backgroundColor: 'transparent',
					}}>
					Add new Episode
				</button>
			}
			modal>
			{(close) => (
				<>
					<h2>Add new Episode</h2>
					<button
						disabled={disabled}
						className="close"
						onClick={close}>
						&times;
					</button>
					<form
						className="episode-form"
						onSubmit={handleAddNewEpisode}>
						<label>
							Select an Audio File
							<InputBox
								type="file"
								accept="audio/*"
								name="audio"
								required
							/>
						</label>
						<InputBox
							type="text"
							name="title"
							placeholder="Episode Title"
							required
						/>
						<InputBox
							type="textarea"
							name="description"
							placeholder="Episode Description"
							required
						/>
						{disabled ? (
							<ButtonSkeleton />
						) : (
							<InputBox
								type="submit"
								name="submit"
								value="Add Episode"
							/>
						)}
					</form>
				</>
			)}
		</Popup>
	)
}

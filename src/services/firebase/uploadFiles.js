import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from './firebase'
import { toast } from 'react-toastify'

export const uploadFile = async (file) => {
	const storageRef = ref(storage, file.uploadPath)

	toast.loading(`Uploading ${file.name}`, {
		toastId: 'uploading',
	})

	const uploadTask = uploadBytesResumable(storageRef, file.data)

	return new Promise((resolve, reject) => {
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
				toast.update('uploading', {
					render: `Uploading ${file.name} ${progress}%`,
					type: 'info',
					isLoading: true,
					autoClose: false,
				})
			},
			(error) => {
				toast.update('uploading', {
					render: 'Upload failed ' + error.code,
					type: 'error',
					isLoading: false,
					autoClose: 2000,
				})
				return reject(error)
			},
			() => {
				toast.update('uploading', {
					render: 'Upload complete',
					type: 'success',
					isLoading: false,
					autoClose: 1000,
				})
				toast.done('uploading')
				getDownloadURL(uploadTask.snapshot.ref)
					.then((downloadURL) => {
						resolve(downloadURL)
					})
					.catch((error) => {
						toast.update('uploading', {
							render: 'Upload failed ' + error,
							type: 'error',
							isLoading: false,
							autoClose: 2000,
						})
						reject(error)
					})
			}
		)
	})
}

const uploadFiles = async (files) => {
	const imagePromises = Array.from(files, (file) => uploadFile(file))

	const imageRes = await Promise.all(imagePromises)

	return imageRes // list of url like ["https://..", ...]
}

export default uploadFiles

import React from 'react'

import './InputBox.css'

const InputBox = ({ className, type, name, placeholder, value, width = '100%', style, onChange, accept, required, maxLength }) => {
	return type === 'textarea' ? (
		<textarea
			className={`input-box ${className}`}
			style={{ width: width, ...style }}
			name={name}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			required={required}
			maxLength={maxLength ?? 250}
		/>
	) : (
		<input
			accept={accept}
			className={`input-box ${className}`}
			style={{ width: width, ...style }}
			type={type}
			name={name}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			required={required}
		/>
	)
}

export default InputBox

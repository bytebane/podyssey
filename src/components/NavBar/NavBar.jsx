import React from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { navOptions } from '../../services/routing'
import { signoutUser } from '../../services/redux/slices/userSlice'

import { NavBG } from '../../assets'

import './NavBar.css'

const NavBar = () => {
	const appState = useSelector((state) => state.app)
	const userState = useSelector((state) => state.user)
	const dispatch = useDispatch()

	const NavItem = ({ route }) => {
		return (
			<NavLink
				to={route.path}
				className="navbar-link"
				activeclassname="active">
				{route.name}
			</NavLink>
		)
	}
	return (
		<nav>
			<img
				className="navbar-bg"
				src={NavBG}
				alt="bg"
			/>
			<div className="navbar">
				{userState.isAuthenticated && <h2>Hi, {userState.data.displayName && userState.data.displayName.split(' ')[0]}</h2>}
				{navOptions.map((route, index) => {
					if (!route.isProtected && route.isMenu) {
						return (
							<NavItem
								key={index}
								route={route}
							/>
						)
					} else if (userState.isAuthenticated && route.isMenu) {
						return (
							<NavItem
								key={index}
								route={route}
							/>
						)
					} else {
						return null
					}
				})}
				{userState.isAuthenticated ? (
					<div
						to="#"
						onClick={() => dispatch(signoutUser())}
						className="navbar-link">
						Sign Out
					</div>
				) : (
					<NavLink
						to="/"
						className="navbar-link"
						style={{ cursor: 'none' }}
						activeclassname="">
						{appState.isForgetPasswordPage ? 'Forget Password? No worries!' : appState.isSignupPage ? 'Welcome Stranger! Signup to become a Podyseer.' : 'Hello Podyseer! Welcome Back'}
					</NavLink>
				)}
			</div>
		</nav>
	)
}

export default NavBar

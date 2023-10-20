import React from 'react'
import { AddPodcastPage, AuthPage, DetailsPage, PodcastsPage, ProfilePage } from '../../pages'

export const navOptions = [
	{
		name: 'Sign In',
		path: '/',
		element: <AuthPage />,
		isMenu: false,
		isProtected: false,
	},
	{
		name: 'Podcasts',
		path: '/podcasts',
		element: <PodcastsPage />,
		isMenu: true,
		isProtected: true,
	},
	{
		name: 'Profile',
		path: '/profile',
		element: <ProfilePage />,
		isMenu: true,
		isProtected: true,
	},
	{
		name: 'Start a Podcast',
		path: '/create-podcast',
		element: <AddPodcastPage />,
		isMenu: true,
		isProtected: true,
	},
	{
		name: 'Podcast',
		path: '/podcast/:id',
		element: <DetailsPage />,
		isMenu: false,
		isProtected: true,
	},
]

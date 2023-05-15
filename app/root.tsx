import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'Lens Recommendation',
	viewport: 'width=device-width,initial-scale=1',
	// Open Graph tags
	'og:title': 'Lens Profile Rankings - by Karma3 Labs',
	'og:type' : 'website',
	'og:url'  : 'https://lens.k3l.io/',
	'og:image': 'https://lens.k3l.io/karma3-lens-og.jpg',
    'og:description': 'Lens Profile Rankings - Powered by configurable open-sourced algorithms',
	// Twitter tags
	'twitter:card': 'summary_large_image',
	'twitter:title' : 'website',
	'twitter:url'  : 'https://lens.k3l.io/',
	'twitter:image': 'https://lens.k3l.io/karma3-lens-og.jpg',
    'twitter:description': 'Lens Profile Rankings - Powered by configurable open-sourced algorithms',
})

export const links: LinksFunction = () => [
	{
		rel: 'stylesheet',
		href: '/main.css',
	},
]

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />

				<script
					async
					src="https://www.googletagmanager.com/gtag/js?id=G-DBN8023PFS"
				></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-DBN8023PFS');`,
					}}
				></script>
			</body>
		</html>
	)
}

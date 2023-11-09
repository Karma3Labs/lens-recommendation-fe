import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'
import { json } from "@remix-run/node"

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'Lens Recommendation',
	viewport: 'width=device-width,initial-scale=1',
	// Open Graph tags
	'og:title': 'Profile Rankings on Lens Protocol — by Karma3 Labs',
	'og:type' : 'website',
	'og:url'  : 'https://lens.k3l.io/',
	'og:image': 'https://lens.k3l.io/karma3-lens-og.jpg',
    'og:description': 'Powered by configurable open-sourced algorithms',
	// Twitter tags
	'twitter:card': 'summary_large_image',
	'twitter:title' : 'Profile Rankings on Lens Protocol — by Karma3 Labs',
	'twitter:url'  : 'https://lens.k3l.io/',
	'twitter:image': 'https://lens.k3l.io/karma3-lens-og.jpg',
    'twitter:description': 'Powered by configurable open-sourced algorithms',
})

export const links: LinksFunction = () => [
	{
		rel: 'stylesheet',
		href: '/main.css',
	},
]

export async function loader() {
	return json({
	  ENV: {
		PROFILE_URL: process.env.PROFILE_URL,
		CONTENT_URL: process.env.CONTENT_URL,
	  },
	});
  }

export default function App() {
	const data = useLoaderData<typeof loader>()
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

gtag('config', 'G-DBN8023PFS');

window.ENV = ${JSON.stringify(data.ENV)};
`,
					}}
				></script>
			</body>
		</html>
	)
}

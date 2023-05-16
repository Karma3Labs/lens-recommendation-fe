import { LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData, useNavigate } from '@remix-run/react'
import { personalisedRankings } from '~/api'
import LoadingIndicator from '~/components/LoadingIndicator'
import HeaderLinks from '~/components/HeaderLinks'

export const loader = async ({ request }: LoaderArgs) => {
	const url = new URL(request.url)
	const handle = url.searchParams.get('handle')

	const page = url.searchParams.get('page')
		? Number(url.searchParams.get('page'))
		: 1

	if (!handle) {
		return {
			results: [],
			page,
			handle: null,
		}
	}

	const results = await personalisedRankings(handle, page)

	return {
		results,
		page,
		handle,
	}
}

export default function Suggest() {
	const data = useLoaderData<typeof loader>()
	const navigate = useNavigate()

	return (
		<main>
			<LoadingIndicator />
			<header>
				<div className="logos">
					<div className='logo-container-1'>
						<a href="https://k3l.io" target="_blank">
							<img
								width="180px"
								src="/logo.svg"
								draggable="false"
								alt="Karma3Labs Logo"
							/>
						</a>
					</div>
					<div className="line"></div>
					<div className='logo-container-2'>
						<a href="https://www.lens.xyz/" target="_blank">
							<img
								width="50px"
								src="/lens.svg"
								draggable="false"
								alt="Karma3Labs Logo"
							/>
						</a>
					</div>
				</div>

				<HeaderLinks />

				<div className="title">
					<h1>Lens Personalized Recommendation</h1>
					<h6>Powered by configurable open-sourced algorithms</h6>
				</div>
			</header>

			<div className="container">
				<Form method="get" className="search personalized-search">
					<input
						type="text"
						name="handle"
						className="btn btn-search"
						placeholder="Search by handle"
						defaultValue={data.handle || ''}
					/>
					{/* <button className="btn" type="submit">
						Search
					</button> */}
{/* 
					{data.handle && (
						<button
							className="btn"
							type="button"
							onClick={() => navigate(`/suggest`)}
						>
							Clear
						</button>
					)} */}
				</Form>

				<div className="profiles-grid">
					<div>
						<strong>Rank</strong>
						<strong>Profile Handle</strong>
						<strong>Followers</strong>
					</div>
					{data.results.map((p) => (
						<div key={p.id}>
							<span>{p.rank}</span>
							<span>{p.handle}</span>
							<span>{p.followersCount}</span>
						</div>
					))}
					{data.handle && data.results.length === 0 && (
						<div>No results</div>
					)}
				</div>
			</div>
		</main>
	)
}

export function ErrorBoundary({ error }: { error: Error }) {
	return (
		<main>
			<div className="container">
				<h1>Error</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		</main>
	)
}

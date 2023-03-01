import { LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData, useNavigate } from '@remix-run/react'
import { personalisedRankings } from '~/api'
import LoadingIndicator from '~/components/LoadingIndicator'

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

			<a href="https://k3l.io" target="_blank">
				<img
					width="180px"
					className="logo"
					src="/logo.svg"
					draggable="false"
					alt="Karma3Labs Logo"
				/>
			</a>

			<div className="container">
				<header>
					<div className="title">
						<h1>Lens Personalized Search</h1>
					</div>

					<Form method="get" className="search">
						<input
							type="text"
							name="handle"
							placeholder="Search by profile handle"
							defaultValue={data.handle || ''}
						/>
						<button className="btn" type="submit">
							Search
						</button>

						{data.handle && (
							<button
								className="btn"
								type="button"
								onClick={() => navigate(`/suggest`)}
							>
								Clear
							</button>
						)}
					</Form>
				</header>

				<div className="profiles-grid">
					<div>
						<strong>Rank</strong>
						<strong>Profile Handle</strong>
						<strong>Followers</strong>
					</div>
					{data.results.map((p) => (
						<div key={p.id}>
							<span>{p.rank + 1}</span>
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

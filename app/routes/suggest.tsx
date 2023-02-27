import { LoaderArgs } from '@remix-run/node'
import { Form, useLoaderData, useSearchParams } from '@remix-run/react'
import { personalisedRankings } from '~/api'

export const loader = async ({ request }: LoaderArgs) => {
	const url = new URL(request.url)
	const handle = url.searchParams.get('q')

	const page = url.searchParams.get('page')
		? Number(url.searchParams.get('page'))
		: 0

	if (!handle) {
		return {
			results: [],
			page,
		}
	}

	const results = await personalisedRankings(handle, page)

	return {
		results,
		page,
	}
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	const [searchParams] = useSearchParams()

	return (
		<main>
			<div className="container">
				<header>
					<Form method="get">
						<input
							type="text"
							name="q"
							placeholder="handle"
							defaultValue={searchParams.get('q') as string}
						/>
						<button type="submit">Search</button>
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

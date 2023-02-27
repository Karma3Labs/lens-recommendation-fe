import { LoaderArgs } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { globalRankings, rankingCounts } from '~/api'
import Pagination from '~/components/Pagination'

const DEFAULT_STRATEGY = '1'

export const loader = async ({ request }: LoaderArgs) => {
	const url = new URL(request.url)
	const strategy = url.searchParams.get('strategy') || DEFAULT_STRATEGY
	const page = url.searchParams.get('page')
		? Number(url.searchParams.get('page'))
		: 0

	const [results, count] = await Promise.all([
		globalRankings(strategy, page),
		rankingCounts(strategy),
	])

	return {
		results,
		page,
		strategy,
		count,
	}
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	const navigate = useNavigate()

	return (
		<main>
			<div className="container">
				<header>
					<div className="title">
						<h1>Lens Global Trust Index</h1>
					</div>

					<div className="strategies">
						<button
							className="btn"
							onClick={() => navigate('?strategy=1')}
						>
							Strategy 1
						</button>
						<button
							className="btn"
							onClick={() => navigate('?strategy=2')}
						>
							Strategy 2
						</button>
						<button
							className="btn"
							onClick={() => navigate('?strategy=3')}
						>
							Strategy 3
						</button>
						<button
							className="btn"
							onClick={() => navigate('?strategy=4')}
						>
							Strategy 4
						</button>
					</div>
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

				<Pagination numberOfPages={data.count} />
			</div>
		</main>
	)
}

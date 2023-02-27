import { LoaderArgs } from '@remix-run/node'
import { NavigateFunction, useLoaderData, useNavigate, useSubmit } from '@remix-run/react'
import { globalRankings, strategies, Strategy } from '~/api'
import Pagination from '~/components/Pagination'

const DEFAULT_STRATEGY = '1'

export const loader = async ({ request }: LoaderArgs) => {
	const url = new URL(request.url)
	const strategy = url.searchParams.get('strategy') || DEFAULT_STRATEGY
	const page = url.searchParams.get('page')
		? Number(url.searchParams.get('page'))
		: 0

	const results = await globalRankings(strategy, page)

	return {
		results,
		page,
		strategy,
	}
}

const getStrategyButtons = (strategies: Strategy[], navigate: NavigateFunction) => {
	return strategies.map((strategy: Strategy) => {
		return (
			<button
				className="btn tooltip"
				key={strategy.id}
				onClick={() => navigate(`?strategy=${strategy.id}`)}
			>
				{strategy.name}
				<span className="tooltiptext">{strategy.description}</span>
			</button>
		)
	});
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	const submit = useSubmit()
	const navigate = useNavigate()

	return (
		<main>
			<div className="container">

				<header>
					<div className="title">
						<h1>Lens Global Trust Index</h1>
					</div>

					<div className='strategies'>
						{getStrategyButtons(strategies, navigate)}
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

				<Pagination numberOfPages={25} />
			</div>
		</main>
	)
}

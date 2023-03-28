import { LoaderArgs } from '@remix-run/node'
import {
	Form,
	useLoaderData,
	useNavigate,
	useSearchParams,
} from '@remix-run/react'
import { useEffect } from 'react'
import {
	globalRankByHandle,
	globalRankings,
	PER_PAGE,
	rankingCounts,
	strategies,
	Strategy,
} from '~/api'
import LoadingIndicator from '~/components/LoadingIndicator'
import Pagination from '~/components/Pagination'

const DEFAULT_STRATEGY = '6'

export const loader = async ({ request }: LoaderArgs) => {
	const url = new URL(request.url)
	const strategy = url.searchParams.get('strategy') || DEFAULT_STRATEGY
	let page = url.searchParams.get('page')
		? Number(url.searchParams.get('page'))
		: 1

	const handle = url.searchParams.get('handle')
	const handleRank = handle
		? await globalRankByHandle(strategy, handle)
		: null

	if (handleRank) {
		page = Math.ceil(handleRank / PER_PAGE)
	}

	const [results, count] = await Promise.all([
		globalRankings(strategy, page),
		rankingCounts(strategy),
	])

	// Profile not found
	if (handle && !handleRank) {
		return {
			results: [],
			page,
			strategy,
			count,

			handle,
			handleRank,
		}
	}

	return {
		results,
		page,
		strategy,
		count,

		handle,
		handleRank,
	}
}

export default function Index() {
	const data = useLoaderData<typeof loader>()
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	useEffect(() => {
		if (data.handle) {
			document
				.querySelector(`[data-profile-handle="${data.handle}"]`)
				?.scrollIntoView(true)
		}
	}, [data.handle, data.strategy])

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
						<h1>Lens Global Profile Rankings</h1>
						<p>
							<small>
								Four different profile rankings based on social
								graph data and EigenTrust algorithm.
							</small>
						</p>
					</div>

					<div className="strategies">
						{strategies.map((strategy: Strategy) => {
							const sp = new URLSearchParams(
								searchParams.toString(),
							)
							sp.set('strategy', strategy.id)

							return (
								<button
									className="btn tooltip"
									style={
										strategy.id === data.strategy
											? {
													backgroundColor:
														'var(--c-naples-yellow)',
											  }
											: undefined
									}
									key={strategy.id}
									onClick={() =>
										navigate(`?${sp.toString()}`)
									}
								>
									{strategy.name}
									<span className="tooltiptext">
										{strategy.description}
									</span>
								</button>
							)
						})}
					</div>

					<Form method="get" className="search">
						<input
							type="text"
							name="handle"
							placeholder="Search by profile handle"
							defaultValue={data.handle || ''}
						/>
						<input
							type="hidden"
							name="strategy"
							value={data.strategy}
						/>

						<button className="btn" type="submit">
							Search
						</button>

						{data.handle && (
							<button
								className="btn"
								type="button"
								onClick={() => navigate(`/`)}
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
						<div
							className={
								p.handle === data.handle ? 'active-row' : ''
							}
							key={p.id}
						>
							<span>{p.rank + 1}</span>
							<span data-profile-handle={p.handle}>
								{p.handle}
							</span>
							<span>{p.followersCount}</span>
						</div>
					))}
					{data.results.length === 0 && <div>No results</div>}
				</div>

				<Pagination
					numberOfPages={Math.ceil(data.count / PER_PAGE)}
					currentPage={data.page}
				/>
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

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
import HeaderLinks from '~/components/HeaderLinks'
import getEnv from '../getEnv'

const env = getEnv();

const DEFAULT_STRATEGY = 'followship'

export const loader = async ({ request }: LoaderArgs) => {
	const url = new URL(request.url)
	const strategy = url.searchParams.get('strategy') || DEFAULT_STRATEGY
	let page = url.searchParams.get('page')
		? Number(url.searchParams.get('page'))
		: 1

	let handle = url.searchParams.get('handle')

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
			<header>
				<div className="header-links">
					<a className='header-link current-link' href={env.PROFILE_URL}>Profiles</a>
					<a className='header-link' href={env.CONTENT_URL}>Contents</a>
				</div>
				<div className="logos logos-grid">
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
				<div className="title">
					<h1>Lens Profile Rankings</h1>
					<h6>Powered by configurable open-sourced algorithms</h6>
				</div>
			</header>
			<div className="container">
				<div className="tools"> 
					<div className="strategies">
						{strategies.map((strategy: Strategy) => {
							const sp = new URLSearchParams(
								searchParams.toString(),
							)
							sp.set('strategy', strategy.name)

							const capitalizeFirst = (str: string) => 
								str.charAt(0).toUpperCase() + str.slice(1);

							return (
								<button
									className="btn tooltip strategy-btn"
									style={
										strategy.name === data.strategy
													? { backgroundColor: 'rgb(51 120 233)',  color: 'white', fontWeight: 'bold' }
											: undefined
									}
									key={strategy.name}
									onClick={() =>
										navigate(`?${sp.toString()}`)
									}
								>
									{capitalizeFirst(strategy.name)}
									<span className="tooltiptext">
										{strategy.description}
									</span>
								</button>
							)
						})}
					</div>
					<div className="search">
						<Form method="get">
							<input 
								type="text"
								name="handle"
								placeholder="Search by handle"
								className='btn btn-search'
								defaultValue={data.handle || ''}
							/>
							<input
								type="hidden"
								name="strategy"
								value={data.strategy}
							/>

							{/* <button className="btn" type="submit">
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
							)} */}
						</Form>
					</div>
				</div> 

				<div className="profiles-grid">
					<div className='column-names'>
						<strong>Rank</strong>
						<strong>Profile Handle</strong>
						<strong className="right-align">Followers</strong>
					</div>

					{data.results.map((p) => (
						<div
							className={
								p.handle === data.handle ? 'active-row' : ''
							}
							key={p.id}
						>
							<span>{p.rank}</span>
							<span data-profile-handle={p.handle}>
								<a href={
									"https://lenster.xyz/u/" + encodeURI(p.handle)
								} target="_blank">{p.handle}</a>
							</span>
							<span className="right-align">{p.followersCount}</span>
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

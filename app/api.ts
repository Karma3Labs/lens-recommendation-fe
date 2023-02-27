export interface Profile {
	id: string
	rank: number
	handle: string
	followersCount: string
}

export interface Strategy {
	id: string
	name: string
}

export const strategies = [
	{ id: '1', name: 'Strategy 1'},
	{ id: '2', name: 'Strategy 2'},
	{ id: '3', name: 'Strategy 3'},
	{ id: '4', name: 'Strategy 4'},
] satisfies Strategy[]

const API_URL = 'https://lens.k3l.io'
const PER_PAGE = 50

export async function globalRankings(sId: Strategy['id'], page: number) {
	const url = new URL(`${API_URL}/rankings`)
	url.searchParams.set('strategy_id', sId)
	url.searchParams.set('offset', String(page * PER_PAGE))
	url.searchParams.set('limit', String(PER_PAGE))

	const resp = await fetch(url.toString(), {
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if(resp.ok !== true) {
		console.error(`API response for url=${url.toString()}: ${await resp.text()}`)
		throw new Error('Error fetching the profile global rankings')
	}

	const data = await resp.json() as Profile[]
	
	return data
}

export async function rankingCounts(sId: Strategy['id']) {
	const url = new URL(`${API_URL}/rankings_count`)
	url.searchParams.set('strategy_id', sId)

	const resp = await fetch(url.toString(), {
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if(resp.ok !== true) {
		console.error(`API response for url=${url.toString()}: ${await resp.text()}`)
		throw new Error('Error fetching rankings count')
	}

	const { count } = await resp.json() as { count: number }
	
	return count
}

export async function personalisedRankings(handle: string, page: number) {
	const url = new URL(`${API_URL}/suggest`)
	url.searchParams.set('handle', handle)
	// url.searchParams.set('strategy_id', sId)
	url.searchParams.set('offset', String(page * PER_PAGE))
	url.searchParams.set('limit', String(PER_PAGE))

	const resp = await fetch(url.toString(), {
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if(resp.ok !== true) {
		console.error(`API response for url=${url.toString()}: ${await resp.text()}`)
		throw new Error('Error fetching personalised profiles')
	}

	const data = await resp.json() as Profile[]
	
	return data
}
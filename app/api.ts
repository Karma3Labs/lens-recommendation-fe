export interface Profile {
	id: string
	rank: number
	handle: string
	followersCount: string
}

export interface Strategy {
	id: string
	name: string
	description: string
}

export const strategies = [
	{ id: '1', name: 'Lens OG Follows', description: 'Based on who Lens popular profiles (OGs) follow'},
	{ id: '3', name: 'Lens OG Engagement', description: `Based on who's content Lens popular profiles (OGs) engage with.`},
	{ id: '585', name: 'Global Follows', description: 'Based on who everyone follows on Lens.'},
	{ id: '587', name: 'Global Engagement', description: 'Based on who everyone engages with.'},
] satisfies Strategy[]

const API_URL = 'https://lens-api.k3l.io'
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
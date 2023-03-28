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
	{ id: '6', name: 'OG Follow', description: 'Based on who Lens popular profiles (OGs) follow'},
	{ id: '3', name: 'OG Engagement', description: `Based on who's content Lens popular profiles (OGs) engage with.`},
	{ id: '5', name: 'OG Collect', description: 'Based on who Lens popular profiles (OGs) engage with (including CollectNFT)'},
] satisfies Strategy[]

const API_URL = 'https://lens-api.k3l.io'
export const PER_PAGE = 50

export async function globalRankings(sId: Strategy['id'], page: number) {
	const url = new URL(`${API_URL}/rankings`)
	url.searchParams.set('strategy_id', sId)
	url.searchParams.set('offset', String((Math.max(page - 1, 0)) * PER_PAGE))
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

export async function globalRankByHandle(sId: Strategy['id'], handle: string) {
	const url = new URL(`${API_URL}/ranking_index`)
	url.searchParams.set('strategy_id', sId)
	url.searchParams.set('handle', handle)

	const resp = await fetch(url.toString(), {
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if (resp.ok !== true) {
		const text = await resp.text()
		if(text === 'Handle does not exist') {
			return null
		}

		console.error(`API response for url=${url.toString()}: ${text}`)
		throw new Error('Error fetching ranking index')
	}

	const { rank } = await resp.json() as { rank: number }
	
	return rank
}

export async function personalisedRankings(handle: string, page: number) {
	const url = new URL(`${API_URL}/suggest`)
	url.searchParams.set('handle', handle)
	// url.searchParams.set('strategy_id', sId)
	url.searchParams.set('offset', String((page -1) * PER_PAGE))
	url.searchParams.set('limit', String(PER_PAGE))

	const resp = await fetch(url.toString(), {
		headers: {
			'Content-Type': 'application/json'
		}
	})

	if(resp.ok !== true) {
		const text = await resp.text()
		if(text === 'Handle does not exist') {
			return []
		}

		console.error(`API response for url=${url.toString()}: ${text}`)
		throw new Error('Error fetching personalised profiles')
	}

	const data = await resp.json() as Profile[]
	
	return data
}
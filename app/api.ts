export interface Profile {
	id: string
	rank: number
	handle: string
	followersCount: string
}

export interface Strategy {
	name: string
	description: string
	id: string
}

export const strategies = [
	{ name: 'followship', 
		description: 'This strategy emphasizes only the relevant and meaningful follows as peer-to-peer attestations, disregarding mirrors and comments.',
		id: 'followship'},
	{ name: 'engagement', 
		description: 'This strategy emphasizes social engagements as attestations, combining follows, mirrors and comments.',
		id: 'engagement'},
	{ name: 'creator', 
		description: 'Similar to the engagement strategy, but adds NFT collects to the consideration.',
		id: 'creator'},
		{ name: 'photographers & Artists', 
		description: 'Similar to the creator strategy with a focus on the Photography & Artists community',
		id: 'photoart'},
] satisfies Strategy[]

const API_URL = 'https://lens-api.k3l.io'
export const PER_PAGE = 100

const getStrategyId = (sName: string): string => {
	for (const { name, id } of strategies) {
		if (name === sName) {
			return id;
		}
	}
	return '';
};

export async function globalRankings(sName: Strategy['name'], page: number) {
	const url = new URL((process.env.API_URL || API_URL) + `/profile/scores`)
	url.searchParams.set('strategy', String(getStrategyId(sName)))
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

export async function rankingCounts(sName: Strategy['name']) {
	const url = new URL((process.env.API_URL || API_URL) + `/profile/count`)
	url.searchParams.set('strategy', String(getStrategyId(sName)))

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

export async function globalRankByHandle(sName: Strategy['name'], handle: string) {
	const url = new URL((process.env.API_URL || API_URL) + `/profile/rank`)

		console.log('handle', handle)

		url.searchParams.set('strategy', String(getStrategyId(sName)))
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
	const url = new URL((process.env.API_URL || API_URL) + `/suggest`)
	url.searchParams.set('handle', handle)
	// url.searchParams.set('strategy', sName)
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
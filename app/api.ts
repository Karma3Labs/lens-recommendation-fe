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
	{ name: 'og01f1c3m8col12PriceTimed',
		description: 'This strategy emphasizes social engagements as attestations, combining follows, mirrors, comments and collects.',
		id: 'og01f1c3m8col12PriceTimed'
	},
	{ name: 'og01f1c8m3col12PriceTimed',
		description: 'Similar to the engagement strategy, but adds another datapoint where posts can be turned into NFT collections by influencers.',
		id: 'og01f1c8m3col12PriceTimed'
	},
	{ name: 'og05f1c3m8col12PriceTimed',
		description: 'Similar to the influencer strategy, we add another datapoint where NFT collections have a price associated in secondary markets.',
		id: 'og05f1c3m8col12PriceTimed'
	},
	{ name: 'og05f1c8m3col12PriceTimed',
		description: 'This strategy emphasizes social engagements as attestations, combining follows, mirrors, replies and comments. The DeFi community heavily influences this ranking',
		id: 'og05f1c8m3col12PriceTimed'
	},
	{ name: 'cur01f1c3m8col12PriceTimed',
		description: 'Similar to the engagement strategy, but adds another datapoint where posts can be turned into NFT collections by influencers.',
		id: 'cur01f1c3m8col12PriceTimed'
	},
	{ name: 'cur01f1c8m3col12PriceTimed',
		description: 'Similar to the influencer strategy, we add another datapoint where NFT collections have a price associated in secondary markets.',
		id: 'cur01f1c8m3col12PriceTimed'
	},
	{ name: 'cur05f1c3m8col12PriceTimed',
		description: 'This strategy emphasizes social engagements as attestations, combining follows, mirrors, replies and comments. The Anime community heavily influences this ranking',
		id: 'cur05f1c3m8col12PriceTimed'
	},
	{ name: 'cur05f1c8m3col12PriceTimed',
		description: 'Similar to the engagement strategy, but adds another datapoint where posts can be turned into NFT collections by influencers.',
		id: 'cur05f1c8m3col12PriceTimed'
	},
] satisfies Strategy[]

const API_URL = 'https://lens-api.k3l.io'
export const PER_PAGE = 100

const getStrategyId = (sName: string):string => {
	for (const {name, id} of strategies) {
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
	if (handle && !handle.endsWith('.lens')) {
		handle = `${handle}.lens`
	}
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
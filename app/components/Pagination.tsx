import { useSearchParams, useNavigate, useNavigation } from '@remix-run/react'

export default function Pagination({
	numberOfPages,
}: {
	numberOfPages: number
}) {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const navigation = useNavigation()
	const currentPage = Number(searchParams.get('page') || '1')

	const goTo = (n: number) => {
		const sp = new URLSearchParams(searchParams.toString())
		if (String(n) === sp.get('page')) {
			return
		}
		sp.set('page', String(n))
		navigate(`?${sp.toString()}`)
	}

	const pages = [
		1,
		2,
		currentPage - 1,
		currentPage,
		currentPage + 1,
		numberOfPages - 1,
		numberOfPages,
	]
		// min max
		.filter((n) => {
			return n > 0 && n <= numberOfPages
		})
		// unique
		.filter((n, idx, list) => list.indexOf(n) === idx)

	return (
		<section>
			<button
				disabled={currentPage === 1}
				onClick={() => goTo(currentPage - 1)}
			>
				Previous
			</button>
			<button
				disabled={currentPage === numberOfPages}
				onClick={() => goTo(currentPage + 1)}
			>
				Next
			</button>

			{pages.map((p, idx, list) => {
				const showDivider = idx > 0 && list[idx] - list[idx - 1] > 1

				return (
					<span key={p}>
						{showDivider && <span>...</span>}
						<button
							style={{
								border:
									p === currentPage
										? '1px solid red'
										: 'none',
							}}
							onClick={() => goTo(p)}
						>
							{p}
						</button>
					</span>
				)
			})}

			<span>{navigation.state === 'loading' ? 'Loading...' : ''}</span>
		</section>
	)
}

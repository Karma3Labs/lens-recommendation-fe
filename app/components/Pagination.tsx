import { useSearchParams, useNavigate, useNavigation } from '@remix-run/react'
import { Fragment } from 'react'

export default function Pagination({
	numberOfPages,
	currentPage,
}: {
	numberOfPages: number
	currentPage: number
}) {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const navigation = useNavigation()

	const goTo = (n: number) => {
		const sp = new URLSearchParams(searchParams.toString())
		if (String(n) === sp.get('page')) {
			return
		}
		sp.delete('handle')
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
		<div>
			<section className="pagination">
				<button
					disabled={currentPage === 1}
					onClick={() => goTo(currentPage - 1)}
				>
					Previous
				</button>

				{pages.map((p, idx, list) => {
					const showDivider = idx > 0 && list[idx] - list[idx - 1] > 1

					return (
						<Fragment key={p}>
							{showDivider && <span>...</span>}
							<button
								style={{
									fontWeight:
										p === currentPage ? 'bold' : 'normal',
								}}
								onClick={() => goTo(p)}
							>
								{p}
							</button>
						</Fragment>
					)
				})}

				<button
					disabled={currentPage === numberOfPages}
					onClick={() => goTo(currentPage + 1)}
				>
					Next
				</button>
			</section>
			<strong style={{ marginLeft: '1em' }}>
				{navigation.state === 'loading' ? 'Loading...' : ''}
			</strong>
		</div>
	)
}

import { useNavigation } from '@remix-run/react'

export default function LoadingIndicator() {
	const navigation = useNavigation()

	if (navigation.state === 'loading') {
		return <span className="loader" />
	}

	return null
}

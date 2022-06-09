import Cookies from "js-cookie"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

interface Props {
	children: React.ReactNode
}
export const IsAuthenticated: React.FC<Props> = ({ children }) => {
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const cookieAddress =
		!Cookies.get("user_id") || Cookies.get("user_id") === "null" ? undefined : Cookies.get("user_id")
	useEffect(() => {
		if (!cookieAddress) {
			router.push(`/registration?page=${router.pathname}`)
		} else {
			setLoading(false)
		}
	}, [])
	if (loading) {
		return <div></div>
	}
	return <>{children}</>
}

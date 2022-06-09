import { styled } from "@mui/material"
import Button from "@mui/material/Button"
import Cookies from "js-cookie"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useMoralis } from "react-moralis"

const registration: NextPage = () => {
	const router = useRouter()
	const { authenticate, account } = useMoralis()

	const authentication = async () => {
		const user = await authenticate()
		if (!user) return

		Cookies.set("user_id", user.attributes.ethAddress, { expires: 1 })
		const path = router.query.page

		if (!path) return router.push(`/user/account`)
		router.push(`/${path}`)
	}
	useEffect(() => {
		if (Cookies.get("user_id") && Cookies.get("user_id") !== "null") {
			router.push(`/user/account`)
		}
	}, [])
	return (
		<Main>
			<p>To continue use app you have to authenticate</p>
			<Button variant="contained" onClick={authentication}>
				authenticate
			</Button>
		</Main>
	)
}

export default registration

const Main = styled("main")({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	marginTop: "50px",
	"& p": {
		marginBottom: "20px",
	},
})

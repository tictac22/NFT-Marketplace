import "@fontsource/roboto"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import { Header } from "../components/header"
import { Layout } from "../components/layout"
import { APP_ID, SERVER_URL } from "../constants"
import "../styles/globals.css"

const theme = createTheme({
	palette: {
		primary: {
			main: "#0052cc",
			light: "#ffeded",
		},
	},
})
const serverUrl = SERVER_URL!
const appId = APP_ID!

const MyApp = ({ Component, pageProps }: AppProps) => {
	return (
		<MoralisProvider appId={appId} serverUrl={serverUrl}>
			<Layout>
				<ThemeProvider theme={theme}>
					<div className="wrapper">
						<Header />
						<Component {...pageProps} />
					</div>
				</ThemeProvider>
			</Layout>
		</MoralisProvider>
	)
}
export default MyApp

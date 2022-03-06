
//import type { AppProps } from 'next/app'
import { MoralisProvider } from "react-moralis";

import '../styles/globals.css'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import "@fontsource/roboto"; 
import Header from '../components/header';
import {styled} from '@mui/system';

const theme = createTheme({
	palette: {
		primary: {
			main: "#0052cc",
			light: "#ffeded"
		},
	},
});
const serverUrl = "https://jhsndpxpj1yf.usemoralis.com:2053/server";
const appId = "OBnmAvzndhouxIGXhgJYgLSYoxpkmLJGjDd4N0Yd";


const MyApp = ({ Component, pageProps }) => {
	return (
		<MoralisProvider appId={appId} serverUrl={serverUrl}>
			<ThemeProvider theme={theme}>
				<div className="wrapper">
					<Header/>
					<Component {...pageProps} />
				</div>
			</ThemeProvider>
		</MoralisProvider>
    )
}
const Container = styled("div")({
	display: "flex",
	minHeight:"100vh",
	flexDirection:"column"
})
export default MyApp

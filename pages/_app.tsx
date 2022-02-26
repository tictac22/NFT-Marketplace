import '../styles/globals.css'
import type { AppProps } from 'next/app'
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

const MyApp = ({ Component, pageProps }: AppProps) => {
	return (
		<ThemeProvider theme={theme}>
			<div className="wrapper">
				<Header/>
				<Component {...pageProps} />
			</div>
		</ThemeProvider> 
    )
}
const Container = styled("div")({
	display: "flex",
	minHeight:"100vh",
	flexDirection:"column"
})
export default MyApp

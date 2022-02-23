import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "@fontsource/roboto"; 
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
			<Component {...pageProps} />
		</ThemeProvider> 
    )
}

export default MyApp

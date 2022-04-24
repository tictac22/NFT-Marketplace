

import { NextPage } from 'next';
import { useMoralis } from 'react-moralis';

import Cookies from 'js-cookie'

import Button from '@mui/material/Button';
import { styled } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const registration:NextPage = () => {
	const router = useRouter();
	const {authenticate} = useMoralis();
	
	const authentication = async () => {
		const user = await authenticate();
		if(!user) return;

		const ethAdrress = user.attributes.ethAddress;
		Cookies.set('user_id', ethAdrress, { expires: 7 })
		const path = router.query.page;

		if(!path) return router.push(`/user/account`);
		router.push(`/${path}`)
	}
	useEffect(() => {
		if(Cookies.get('user_id') && Cookies.get('user_id') !== "null") {
			router.push(`/user/account`)
		}
	},[])
	return (
		<Main>
			<p>To continue use app you have to authenticate</p>
			<Button variant="contained" onClick={authentication}>authenticate</Button>
		</Main>
	)
}

export default registration

const Main = styled("main")({
	display: "flex",
	flexDirection:"column",
	justifyContent:"center",
	alignItems:"center",
	marginTop:"50px",
	"& p": {
		marginBottom:"20px"
	}
})
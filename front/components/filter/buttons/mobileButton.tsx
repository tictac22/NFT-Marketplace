
import React from "react"

import Button from '@mui/material/Button';
import { styled } from "@mui/material";
import { useRouter } from 'next/router';

interface Props {
	handleMenuOpen:() => void,
}
export const MobileButton:React.FC<Props> = ({handleMenuOpen}) => {
	const router = useRouter()
	const filterCount = counterFilters(router.query)
	return (
		<Wrapper>
			<WrapperButton onClick={handleMenuOpen} fullWidth={true} variant="contained">
			Filter 
			{filterCount >= 1 && 
				<Counts>
					{filterCount}
				</Counts>
			}
			</WrapperButton>
		</Wrapper>

	)
}

const Wrapper = styled("div")({
	'@media (min-width:700px)': {
		display:"none"
	},
	position:"fixed",
	bottom:"20px",
	width:"50%",
	left:"50%",
	transform: "translateX(-50%)",
	zIndex:"50",
	boxShadow: "rgb(0 0 0 / 25%) 0px 1px 20px",
	borderRadius: "25px",
	
})
const WrapperButton = styled(Button)({
	borderRadius: "25px",
})
const Counts = styled("div")({
	display: "flex",
	alignItems:"center",
	justifyContent:"center",
	backgroundColor: "white",
	color: "rgb(32, 129, 226)",
	borderRadius:"15px",
	height: "24px",
	width:"24px",
	marginLeft:"10px"
})
const counterFilters = obj => {
	const queries = {
		min:true,
		max:true,
		status:true,
	}
	let filters = 0;
	for(let key in obj) {
		if(queries[key]) {
			filters++;
		}
	}
	console.log(filters)
	return filters

}
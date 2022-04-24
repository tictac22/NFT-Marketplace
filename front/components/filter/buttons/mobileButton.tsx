
import React from "react"

import Button from '@mui/material/Button';
import { styled } from "@mui/material";

interface Props {
	handleMenuOpen:() => void,
}
export const MobileButton:React.FC<Props> = ({handleMenuOpen}) => {

	return (
		<Wrapper>
			<WrapperButton onClick={handleMenuOpen} fullWidth={true} variant="contained">Filter</WrapperButton>
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
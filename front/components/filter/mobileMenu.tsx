
import React from "react"

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import { Status } from "./status";
import { Price } from "./price";

import { styled } from "@mui/material";
import { useRouter } from 'next/router';

interface Props {
	openMenu:boolean,
	handleMenuOpen: () => void
}

export const MobileMenu:React.FC<Props> = ({openMenu,handleMenuOpen}) => {
	const router = useRouter();
	const list = () => (
	<Box
		sx={{ width: "auto" }}
		role="presentation">
		
		<div style={{top:"72px",width:"100%",position:"absolute"}}>
			<TextWrapper>
					<p style={{fontWeight:"bold"}}>Clear All</p>
					<p style={{fontWeight:"bold",cursor:"pointer"}} onClick={handleMenuOpen} >Done</p>
			</TextWrapper>
				<Status/>
				<Price/>				
		</div>
	</Box>
	);

	return (
	<div>
		<>
			<Drawer
			anchor="left"
			open={openMenu}
			onClose={handleMenuOpen}
			sx={{
				zIndex:"100",
				"& .MuiPaper-root": {
					boxShadow:"none",
					width:"100%"
				},
				"& .MuiBackdrop-root": {
				},
			}}
			>
			{list()}
			</Drawer>
		</>
	</div>
	);
}

const TextWrapper = styled("div")({
	display:"flex",
	alignItems:"center",
	justifyContent:"space-between",
	padding:"16px 16px",
	color: "rgb(32, 129, 226)",
	borderBottom: "1px solid rgb(229, 232, 235)"
})
/**
 * <List>
		{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
			<ListItem button key={text}>
			<ListItemIcon>
				{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
			</ListItemIcon>
			<ListItemText primary={text} />
			</ListItem>
		))}
		</List>
 * 


			onClick={handleMenuOpen}
		onKeyDown={handleMenuOpen}
 */
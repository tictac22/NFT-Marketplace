
import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExploreIcon from '@mui/icons-material/Explore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CreateIcon from '@mui/icons-material/Create';
import Link from 'next/link';
interface Props {
	handleOpen: () => void,
	open:boolean
}

interface LinkProps {
	number:number,
	text:string
}
const LinkWrapper:React.FC<LinkProps> = ({number,text}) => {
	const href = number === 0 ? "/" : number === 1 ? "/user/account" : "/createnft"
	return (
		<Link href={href}>
			<a>
				<ListItem button key={text}>
					<ListItemIcon>
						{
							number === 0 ? <ExploreIcon /> : 
							number === 1 ? <PersonOutlineIcon/> :
							<CreateIcon/>
						}					
					</ListItemIcon>
					<ListItemText primary={text} />
				</ListItem>
			</a>
		</Link>
	)
}
export const Menu:React.FC<Props> = ({handleOpen,open}) => {

	const list = () => (
		<Box
			sx={{ width: 250}}
			role="presentation"
			onClick={handleOpen}
			onKeyDown={handleOpen}
		>
			<List>
			{['All NFTs', 'Your NFTs', 'Create', ].map((text, index) => (
				<LinkWrapper key={text} number={index} text={text}/>
			))}
			</List>
		</Box>
	);
	return (
	<div>
		<>
			<Drawer
			anchor="right"
			open={open}
			onClose={handleOpen}
			sx={{
				zIndex:"100",
				"& .MuiPaper-root": {
					top:"72px",
					boxShadow:"none"
				},
				"& .MuiBackdrop-root": {
					top:"72px"
				}
			}}
			>
			{list()}
			</Drawer>
		</>
	</div>
	);
}
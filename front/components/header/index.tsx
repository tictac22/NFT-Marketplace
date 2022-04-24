
import React,{ useState } from "react"

import Link from 'next/link';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
const DynamicSearchBar = dynamic(() => import("./searchBar"))
import { Menu } from './burger';

import { styled } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export const Header:React.FC = () => {
	const router = useRouter()
	const path = router.query.user && `/user/${router.query.user}`
	const [open,setOpen] = useState<boolean>(false);
	const handleOpen = () => {
		setOpen(!open);
	}
	
	return (
		<HeaderWrapper boxshadow={open ? 1 : 0}>
			<div className="container" style={{height:"100%"}}>
				<HeaderInner>
					<DynamicSearchBar/>
					<LinkWrapper>
						<Link href="/">
							<LinkTo opacity={router.asPath === "/" ? 1 : 0 }>All NFTs</LinkTo>
						</Link>
						<Link href={`/user/account`}>
							<LinkTo opacity={path === `/user/${router.query.user}` ? 1 : 0 }>Your NFTs</LinkTo>
						</Link>
						<Link href="/createnft">
							<LinkTo opacity={router.asPath === "/createnft" ? 1 : 0 }>Create</LinkTo>
						</Link>
					</LinkWrapper>
					<BurgerWrapper>
						{ open ?  <IconClose style={{cursor:"pointer"}} onClick={handleOpen}/> : 
								<IconMenu style={{cursor:"pointer"}}  onClick={handleOpen}/> 
						}
					</BurgerWrapper>
					<Menu open={open} handleOpen={handleOpen}/>
				</HeaderInner>
			</div>
		</HeaderWrapper>
	)
}
const HeaderWrapper = styled("header")<{boxshadow:number}>(props =>({
	boxShadow:`${props.boxshadow === 0 ? "rgb(4 17 29 / 25%) 0px 0px 8px 0px" : "none"}`,
	height: "72px",
	position:"relative",
	zIndex:"2000"
}))
const HeaderInner = styled("div")({
	display:"flex",
	alignItems:"center",
	height: "100%"
})
const LinkWrapper = styled("div")({
	height:"100%",
	display: "none",
	flex:"1 1 auto",
	cursor: "pointer",
	justifyContent:"end",
	"@media (min-width:700px)": {
		display: "flex"
	}
})
const LinkTo = styled("a")<{opacity:number}>((props)=>({
	display: "flex",
	alignItems:"center",
	color:"#2C3741",
	fontWeight:`${props.opacity === 1 ? "bold" : "400"}`,
	padding: "15px 0px",
	margin:"0px 15px",
	height: "100%",
	position: "relative",
	"&:before" : {
		content:'""',
		position:"absolute",
		bottom:"0",
		left:"0",
		width:"100%",
		"height":"1px",
		backgroundColor: "rgb(32, 129, 226)",
		opacity:props.opacity,
		transition:"all 0.5s linear"
	},
	"&:hover:before": {
		opacity:"1"
	}
}))
const BurgerWrapper = styled("div")({
	display:"flex",
	flex:"1 1 auto",
	justifyContent:"flex-end",
	marginLeft:"10px"
})
const IconClose = styled(CloseIcon)({
	color:"#a69eac",
	"@media (min-width:700px)": {
		display: "none",
	}
})
const IconMenu = styled(MenuIcon)({
	color:"#a69eac",
	"@media (min-width:700px)": {
		display: "none",
	}
})
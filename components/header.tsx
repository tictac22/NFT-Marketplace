
import React from "react"
import Link from 'next/link';
import { useRouter } from 'next/router'
import { styled } from "@mui/material";
const Header:React.FC = () => {
	const router = useRouter()
	return (
		<HeaderWrapper>
			<div className="container">
				<HeaderInner>
					<LinkWrapper>
						<Link href="/">
							{
								router.asPath == "/" ? <LinkTo>All NFTs</LinkTo> : <LinkToFake>All NFTs</LinkToFake>
							}
						</Link>
					</LinkWrapper>
					<LinkWrapper>
						<Link href="/usernft">
							{
								router.asPath == "/usernft" ? <LinkTo>Your NFTs</LinkTo> : <LinkToFake>Your NFTs</LinkToFake>
							}
						</Link>
					</LinkWrapper>
					<LinkWrapper>
						<Link href="/createnft">
							{
								router.asPath == "/createnft" ? <LinkTo>Create NFT</LinkTo> : <LinkToFake>Create NFT</LinkToFake>
							}
						</Link>
					</LinkWrapper>
				</HeaderInner>
			</div>
		</HeaderWrapper>
	)
}
const HeaderWrapper = styled("header")({
	backgroundColor:"var(--main)",
	padding: "15px 0px",
})
const HeaderInner = styled("div")({
	display:"flex",
	alignItems:"center",
	justifyContent:"center",
})
const LinkWrapper = styled("div")({
	margin:"0px 15px"
})
const LinkTo = styled("a")((props)=>({
	position: "relative",
	"&:before" : {
		content:'""',
		position:"absolute",
		bottom:"0",
		left:"0",
		width:"100%",
		"height":"1px",
		backgroundColor:"var(--third)",
		opacity:"1",
		transition:"all 0.5s linear"
	},
	"&:hover:before": {
		opacity:"1"
	}
}))
const LinkToFake = styled("a")({
	position: "relative",
	"&:before" : {
		content:'""',
		position:"absolute",
		bottom:"0",
		left:"0",
		width:"100%",
		"height":"1px",
		backgroundColor:"var(--third)",
		opacity:"0",
		transition:"all 0.5s linear"
	},
	"&:hover:before": {
		opacity:"0.6"
	}

})
export default Header
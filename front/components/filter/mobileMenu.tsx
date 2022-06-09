import { styled } from "@mui/material"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import { useRouter } from "next/router"
import React from "react"
import { Price } from "./price"
import { Status } from "./status"

interface Props {
	openMenu: boolean
	handleMenuOpen: () => void
}

const MobileMenu: React.FC<Props> = ({ openMenu, handleMenuOpen }) => {
	const router = useRouter()
	const clearAll = () => {
		router.push(`/user/${router.query.user}`)
	}
	const list = () => (
		<Box sx={{ width: "auto" }} role="presentation">
			<div style={{ top: "72px", width: "100%", position: "absolute" }}>
				<TextWrapper>
					<p onClick={clearAll} style={{ fontWeight: "bold", cursor: "pointer" }}>
						Clear All
					</p>
					<p style={{ fontWeight: "bold", cursor: "pointer" }} onClick={handleMenuOpen}>
						Done
					</p>
				</TextWrapper>
				<Status />
				<Price />
			</div>
		</Box>
	)

	return (
		<div>
			<>
				<Drawer
					anchor="left"
					open={openMenu}
					onClose={handleMenuOpen}
					sx={{
						zIndex: "100",
						"& .MuiPaper-root": {
							boxShadow: "none",
							width: "100%",
						},
						"& .MuiBackdrop-root": {},
					}}
				>
					{list()}
				</Drawer>
			</>
		</div>
	)
}
export default MobileMenu

const TextWrapper = styled("div")({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	padding: "16px 16px",
	color: "rgb(32, 129, 226)",
	borderBottom: "1px solid rgb(229, 232, 235)",
})

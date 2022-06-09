import styled from "@emotion/styled"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import FilterListIcon from "@mui/icons-material/FilterList"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import Typography from "@mui/material/Typography"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { MobileButton } from "./buttons/mobileButton"
import { Price } from "./price"
import { Status } from "./status"

const DynamicMobileMenu = dynamic(() => import("./mobileMenu"))

export const Filter: React.FC = () => {
	const router = useRouter()
	const [open, setOpen] = useState<boolean>(true)
	const [openMenu, setOpenMenu] = useState<boolean>(false)
	const handleMobileMenu = () => {
		const header = document.querySelector("header")
		const body = document.querySelector("body")
		header!.style.boxShadow = `${openMenu ? "none" : "rgb(4 17 29 / 25%) 0px 0px 8px 0px"}`
		body!.style.paddingRight = `${openMenu ? "17px" : "none"}`
		setOpenMenu(!openMenu)
	}
	return (
		<>
			<Wrapper style={{ width: `${open ? "300px" : "60px"}` }}>
				<Accordion disableGutters={true}>
					<AccordionSummary
						aria-controls="panel1a-content"
						id="panel1a-header"
						onClick={() => {
							setOpen(!open)
						}}
					>
						{open && (
							<Typography
								style={{
									display: "flex",
									alignItems: "center",
									flex: "1 1 auto",
								}}
							>
								<FilterListIcon sx={{ marginRight: "5px" }} />
								Filter
							</Typography>
						)}
						{open ? <ArrowForwardIcon /> : <ArrowBackIcon />}
					</AccordionSummary>
				</Accordion>
				{open && (
					<>
						<Status />
						<Price />
					</>
				)}
			</Wrapper>
			<>
				<MobileButton handleMenuOpen={handleMobileMenu} />
				{openMenu && <DynamicMobileMenu openMenu={openMenu} handleMenuOpen={handleMobileMenu} />}
			</>
		</>
	)
}
const Wrapper = styled("div")({
	position: "sticky",
	top: "0",
	alignSelf: "flex-start",
	minHeight: "100vh",
	backgroundColor: "#FBFDFF",
	borderRight: "1px solid rgb(229, 232, 235)",
	borderRadius: "4px",
	display: "none",
	"@media (min-width:700px)": {
		display: "block",
	},
})

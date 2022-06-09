import { styled } from "@mui/material"
import Chip from "@mui/material/Chip"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface Props {
	name: string
	url: string
	price: string
	id: string
	sold: boolean
}
export const NftUser: React.FC<Props> = ({ name, url, price, id, sold }) => {
	return (
		<Link href={`/nft/${id}`} prefetch={false}>
			<a style={{ display: "flex" }}>
				<Wrapper>
					<div style={{ position: "relative", height: "306px" }}>
						<Img layout="fill" src={url} alt={name} />
					</div>
					<Desciption>
						<div style={{ flex: "1 1 auto" }}>
							<p>{name}</p>
							{!sold && <p>Price: {price} matic</p>}
						</div>
						<Status>
							<p>Status:</p>
							<Chip label={`${sold ? "sold" : "on sale"}`} />
						</Status>
					</Desciption>
				</Wrapper>
			</a>
		</Link>
	)
}

const Wrapper = styled("div")({
	width: "100%",
	transition: "all 0.1s linear",
	border: "1px solid rgb(229, 232, 235)",
	borderRadius: "10px",
	"&:hover": {
		boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
	},
	display: "flex",
	cursor: "pointer",
	flexDirection: "column",
	position: "relative",
})
const Desciption = styled("div")({
	padding: "15px",
	display: "flex",
	flexDirection: "column",
	flex: "1 1 auto",
})
const Img = styled(Image)({
	borderTopLeftRadius: "10px",
	borderTopRightRadius: "10px",
	width: "100%",
	height: "100%",
	objectFit: "cover",
})

const Status = styled("div")({
	display: "flex",
	alignItems: "center",
	marginTop: "10px",
	"& p": {
		marginRight: "8px",
	},
})

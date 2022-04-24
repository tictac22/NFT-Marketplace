
import Link from 'next/link'
import Image from 'next/image'

import { styled } from "@mui/material"

interface Props {
	name:string,
	url:string,
	price:string,
	id:string
}
export const NftMain:React.FC<Props> = ({name,url,price,id}) => {
	return (
		<Link href={`/nft/${id}`}>
			<Wrapper>
				<div style={{flex:"1 1 auto",position:"relative",height:"306px"}}>
					<Img layout='fill' src={url} alt={name}/>
				</div>
				<Desciption>
					<p>{name}</p>
					<p>Price: {price} matic</p>
				</Desciption>
			</Wrapper>
		</Link>
	)
}

const Wrapper = styled("a")({
	width: "100%",
	transition: "all 0.1s linear",
	border: "1px solid rgb(229, 232, 235)",
	borderRadius:"10px",
	"&:hover": {
		boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"
	},
	display:"flex",
	cursor: "pointer",
	flexDirection:"column",
	position: "relative"
})
const Desciption = styled("div")({
	padding:"15px",
})
const Img = styled(Image)({
	borderTopLeftRadius: "10px",
	borderTopRightRadius: "10px",
	width:"100%",
	height:"100%",
	objectFit:"cover"
})
import { styled } from "@mui/material"
import { GetServerSideProps, NextPage } from "next"
import { useEffect, useState } from "react"
import { Filter } from "../../components/filter"
import { QueryFilter } from "../../components/filter/queryFilters"
import { NftUser } from "../../components/nfts/nftUser"
import { Observable } from "../../components/observable"
import { APP_ID } from "../../constants"
import { FilterContext } from "../../context/statusContext"
import { NFT } from "../../interfaces/nft"

interface Props {
	nfts: NFT[]
	query: [{ type: string; value: string; query: string }]
	pageOwner: string
}

const userNFT: NextPage<Props> = ({ nfts, query, pageOwner }) => {
	const [data, setData] = useState(nfts)
	useEffect(() => {
		setData(nfts)
	}, [nfts])
	return (
		<FilterContext>
			<div style={{ display: "flex", marginTop: "20px" }}>
				<Filter />
				<div style={{ flex: "1 1 auto" }}>
					<div className="container">
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								flexWrap: "wrap",
							}}
						>
							{query.map((item) => (
								<QueryFilter query={item.query} key={item.type} type={item.type} value={item.value} />
							))}
						</div>
						<Grid>
							{data &&
								data.map((item) => (
									<NftUser
										sold={item.sold}
										key={item.objectId}
										url={item.nftData[0].imageUrl}
										name={item.nftData[0].title}
										id={item.objectId}
										price={item.price}
									/>
								))}
						</Grid>
						<Observable setData={setData} functionName="getUserNFTs" address={pageOwner} />
					</div>
				</div>
			</div>
		</FilterContext>
	)
}
export default userNFT

export const getServerSideProps: GetServerSideProps = async ({ params, req, res, query }) => {
	const address = params?.user
	const userId = req.cookies?.user_id

	const userAddress = address === "account" ? userId : address
	if (address === "account" && (userId === "null" || !userId)) {
		return {
			redirect: {
				permanent: false,
				destination: "/registration?page=user/account",
			},
		}
	}
	const request = await fetch(
		`https://jhsndpxpj1yf.usemoralis.com:2053/server/functions/getUserNFTs?_ApplicationId=${APP_ID}&address=${userAddress}&page=0` +
			concat(query, true)
	)
	const response: { result: [] } = await request.json()
	const queriesConverted = convert(query)
	return {
		props: {
			nfts: response.result,
			query: queriesConverted,
			pageOwner: userAddress,
		},
	}
}

const Grid = styled("div")({
	display: "grid",
	gap: "20px",
	gridTemplateColumns: "repeat(auto-fit,minmax(200px,333px))",
	justifyContent: "center",
	marginBottom: "20px",
})

const convert = (obj) => {
	const keys = Object.keys(obj)
	const values = Object.values(obj)
	let newArr = []
	keys.forEach((item) => {
		if (item == "status") {
			newArr.push({ query: "status", type: item, value: obj["status"] })
		} else if (item == "priceType") {
			let min = obj["min"] || ""
			let max = obj["max"] || ""
			let concat = min && max ? `${min} - ${max}` : min && !max ? `> ${min}` : max && !min ? `< ${max}` : ""
			const priceType = obj["priceType"]
			const query = min && max ? "minmax" : min && !max ? `min` : max && !min ? `max` : null
			newArr.push({ query, type: priceType, value: concat })
		}
	})
	return newArr
}

const concat = (obj, isQuery?: boolean) => {
	const user = obj["user"]
	let string = "/user" + "/" + user + "?"
	isQuery ? (string = "&") : ""

	for (let key in obj) {
		if (key != "user" && obj[key] != undefined) {
			string = string + key + "=" + obj[key] + "&"
		}
	}
	return string
}

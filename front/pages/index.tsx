import { styled } from "@mui/material"
import { GetStaticProps, NextPage } from "next"
import { useState } from "react"
import { NftMain } from "../components/nfts/nftMain"
import { Observable } from "../components/observable"
import { APP_ID } from "../constants"
import { NFT } from "./../interfaces/nft"

interface Props {
	nfts: NFT[]
}

const Home: NextPage<Props> = ({ nfts }) => {
	const [data, setData] = useState(nfts)
	return (
		<main style={{ flex: "1 1 auto" }}>
			<div className="container">
				<Grid>
					{data &&
						data.map((item) => (
							<NftMain
								key={item.objectId}
								url={item.nftData[0].imageUrl}
								name={item.nftData[0].title}
								id={item.objectId}
								price={item.price}
							/>
						))}
				</Grid>
				<Observable functionName="getAllNFTs" setData={setData} />
			</div>
		</main>
	)
}
export const getStaticProps: GetStaticProps = async () => {
	const request = await fetch(
		`https://jhsndpxpj1yf.usemoralis.com:2053/server/functions/getAllNFTs?_ApplicationId=${APP_ID}&page=0`
	)
	const response: { result: [] } = await request.json()
	return {
		props: {
			nfts: response.result,
		},
		revalidate: 30,
	}
}
export default Home

const Grid = styled("div")({
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(200px, 333px))",
	justifyContent: "center",
	gap: "20px",
	marginTop: "20px",
	marginBottom: "20px",
})

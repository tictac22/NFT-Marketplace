import { styled } from "@mui/material"
import Button from "@mui/material/Button"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useMoralis } from "react-moralis"
import { ResellModal } from "../../components/modals/resell"
import { APP_ID } from "../../constants"
import { useContract } from "../../context/contractContext"
import { usePrice } from "./../../hooks/getTokenPrice"
import { NFT } from "./../../interfaces/nft"

interface Props {
	nftData: NFT
}
const Nft: NextPage<Props> = ({ nftData }) => {
	console.log(nftData)
	const { tokenPrice } = usePrice()
	const {
		Moralis,
		account,
		user,
		authenticate,
		isAuthenticated,
		isWeb3Enabled,
		isInitialized,
	} = useMoralis()
	const { abi, marketAddress } = useContract()
	const [balance, setBalance] = useState(0)
	const [open, setOpen] = useState<boolean>(false)
	const handleClose = () => {
		setOpen(!open)
	}
	const buyNFT = async () => {
		if (!isAuthenticated || !isWeb3Enabled) {
			const user = await authenticate()
			if (!user) return
		}
		const sendOptions = {
			contractAddress: marketAddress,
			functionName: "buyMarketItem",
			abi: abi,
			params: {
				_itemId: nftData.itemId,
			},
			msgValue: Moralis.Units.ETH(parseFloat(nftData.price) + 0.02),
		}

		await Moralis.executeFunction(sendOptions)
		const Item = Moralis.Object.extend("ItemCreated")
		const query = new Moralis.Query(Item)
		query.equalTo("objectId", nftData.objectId)
		const results = await query.find()
		const nft = results[0]
		nft.set("sold", true)
		nft.set("owner", account)
		nft.set("seller", "0x0000000000000000000000000000000000000000")
		await nft.save()
	}
	useEffect(() => {
		const getBalance = async () => {
			const options = {
				chain: "mumbai",
				address: account,
			}
			const balance = await Moralis.Web3API.account.getNativeBalance(
				options
			)
			return balance
		}
		if (isInitialized && isWeb3Enabled) {
			getBalance().then((data) => {
				let tokenValue: string | number = Moralis.Units.FromWei(
					data.balance
				)
				tokenValue = parseFloat(tokenValue)
				setBalance(tokenValue)
			})
		}
	}, [isWeb3Enabled, account])
	return (
		<div className="container">
			<Wrapper>
				<div style={{ position: "relative", marginRight: "30px" }}>
					<ImageWrapper
						style={{ maxHeight: "685px", maxWidth: "750px" }}
						alt={nftData.nftData[0].title}
						src={nftData.nftData[0].imageUrl}
					/>
				</div>
				<Description>
					<p>{nftData.nftData[0].title}</p>
					<p style={{ overflow: "auto" }}>
						{nftData.nftData[0].description}
					</p>
					{!nftData.sold && (
						<div>
							<p>Current Price:</p>
							<p>
								{nftData.price} matic, or{" "}
								{(
									parseFloat(nftData.price) * tokenPrice
								).toFixed(2)}
								€
							</p>
						</div>
					)}
					<div style={{ marginTop: "5px" }}>
						{account === nftData.seller ? (
							<p style={{ textDecoration: "underline" }}>
								you are currently selling
							</p>
						) : nftData.sold ? (
							"Currently sold"
						) : (
							<>
								<Button
									onClick={buyNFT}
									variant="contained"
									disabled={
										parseFloat(nftData.price) > balance &&
										isWeb3Enabled
											? true
											: false
									}
								>
									Buy now
								</Button>
								{parseFloat(nftData.price) > balance && (
									<p>
										You can't buy this nft because your
										balance is low
									</p>
								)}
								<p>
									Seller:
									<Link
										href={`/user/[user]`}
										as={`/user/${nftData.seller}`}
									>
										<a
											style={{
												textDecoration: "underline",
											}}
										>
											{nftData.seller}
										</a>
									</Link>
								</p>
							</>
						)}
					</div>
					{nftData.owner === account && nftData.sold && (
						<div style={{ marginTop: "10px" }}>
							<Button
								variant="contained"
								onClick={handleClose}
								sx={{ textTransform: "capitalize" }}
							>
								Resell
							</Button>
							<ResellModal
								objectId={nftData.objectId}
								address={account}
								itemId={nftData.itemId}
								show={open}
								handleClose={handleClose}
							/>
						</div>
					)}
				</Description>
			</Wrapper>
		</div>
	)
}
export default Nft

export const getServerSideProps: GetServerSideProps = async (context) => {
	const id = context.params?.id
	try {
		const request = await fetch(
			`https://jhsndpxpj1yf.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=${APP_ID}&id=${id}`
		)
		const response = await request.json()
		return {
			props: {
				nftData: response.result[0],
			},
		}
	} catch (e) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		}
	}
}

const Wrapper = styled("div")({
	display: "flex",
	marginTop: "20px",
	flexWrap: "wrap",
})

const ImageWrapper = styled("img")({
	maxHeight: "685px",
	maxWidth: "750px",
	width: "100%",
})
const Description = styled("div")({
	"& p ": {
		marginTop: "10px",
	},
})
const DecoratedLink = styled("a")({
	cursor: "pointer",
	color: "blue",
	"&:hover": {
		textDecoration: "underline",
	},
})


import { GetServerSideProps, NextPage } from 'next';

import { useContract } from '../../context/contractContext';
import { useMoralis } from 'react-moralis';
import { usePrice } from './../../hooks/getTokenPrice';

import Button from '@mui/material/Button';
import { styled } from "@mui/material"
import { APP_ID } from '../../constants';
import { NFT } from './../../interfaces/nft';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ResellModal } from '../../components/modals/resell';

interface Props {
	nftData	: NFT
}
const Nft:NextPage<Props> = ({nftData}) => {
	const {tokenPrice} = usePrice();
	const {Moralis,account,user,authenticate,isAuthenticated,isWeb3Enabled,enableWeb3} = useMoralis();
	const {abi,marketAddress} = useContract();
	
	const [open,setOpen] = useState<boolean>(false);
	const handleClose = () => {
		setOpen(!open)
	}
	const buyNFT = async () => {
		if(!isAuthenticated || !isWeb3Enabled){
			const user = await authenticate()
			if(!user) return;
		}
		const sendOptions = {
			contractAddress: marketAddress,
			functionName: "buyMarketItem",
			abi:abi,
			params: {
				_itemId: nftData.itemId,
			},
			msgValue: Moralis.Units.ETH(parseFloat(nftData.price)+0.02)
		};
		
		await Moralis.executeFunction(sendOptions);
		const Item = Moralis.Object.extend("ItemCreated");
		const query = new Moralis.Query(Item);
		query.equalTo("objectId", nftData.objectId);
		const results = await query.find();
		const nft  = results[0];
		nft.set("sold",true);
		nft.set("owner",account);
		nft.set("seller","0x0000000000000000000000000000000000000000");
		await nft.save();
	}
	return (
		<div className="container">
			<Wrapper>
					<div style={{position:'relative',marginRight:"30px"}}>
						<ImageWrapper style={{maxHeight:"685px",maxWidth:"750px"}} alt={nftData.dataImg.description}  src={nftData.dataImg.image} />
					</div>
				<Description>
					<p>{nftData.dataImg.name}</p>
					<p style={{overflow:"auto"}}>{nftData.dataImg.description}</p>
					{!nftData.sold && 
						<div>
							<p>Current Price:</p>
							<p>{nftData.price} matic, or  	{(parseFloat(nftData.price) * tokenPrice).toFixed(2)}€</p>
						</div>
					}
					<div style={{marginTop:"5px"}}>
						{ account === nftData.seller ? <p style={{textDecoration:"underline"}}>you are currently selling</p> : 
							nftData.sold ? "Currently sold" :  
							<Button onClick={buyNFT} variant="contained">Buy now</Button>
						}
					</div>
					<p>Owned By: </p>
					{nftData.owner === "0x20fec673dc31fdcdea88b7b33473134329da1939" ? "market" : 
						<Link href={`/user/${account === nftData.owner ? "account" : nftData.owner}`}>
							<DecoratedLink>
								{account === nftData.owner ? "you" : nftData.owner}
							</DecoratedLink>
						</Link>
					}
					{nftData.owner === account && nftData.sold &&
						<div style={{marginTop:"10px"}}>
							<Button variant="contained" onClick={handleClose} sx={{textTransform:"capitalize"}}>Resell</Button>
							<ResellModal objectId={nftData.objectId} address={account} itemId={nftData.itemId} show={open} handleClose={handleClose}/>
						</div>
					}
				</Description>
			</Wrapper>
		</div>
	)
}
export default Nft

export const getServerSideProps:GetServerSideProps  = async (context) => {
	const id = context.params?.id
	try {
		const request = await fetch(`https://jhsndpxpj1yf.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=${APP_ID}&id=${id}`);
		const response = await request.json();
		return {
			props : {
				nftData:response.result[0]
			}
		}
	} catch(e) {
		console.log(e.message)
		return {
			redirect: {
				permanent: false,
				destination: '/'
			}
		}
	}
}  


const Wrapper = styled("div")({
	display: "flex",
	marginTop:"20px",
	flexWrap:"wrap"
})

const ImageWrapper = styled("img")({
	maxHeight:"685px",
	maxWidth:"750px",
	width:"100%"
})
const Description = styled("div")({
	"& p ": {
		marginTop:"10px"
	}
})
const DecoratedLink = styled("a")({
	cursor: "pointer",
	color:"blue",
	"&:hover": {
		textDecoration:"underline"
	}
})
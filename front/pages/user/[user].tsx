
import { GetServerSideProps, NextPage } from 'next';
import {useState,useRef} from "react"
import { APP_ID } from '../../constants';

import { NFT } from '../../interfaces/nft';

import { styled } from '@mui/material';
import { NftUser } from '../../components/nfts/nftUser';
import { Filter } from '../../components/filter';
import { QueryFilter } from '../../components/filter/queryFilters';
import { FilterContext } from '../../context/statusContext';
import { Observable } from '../../components/observable';

interface Props {
	nfts:NFT[],
	query: [{type:string,value:string,query:string}],
	pageOwner:string
}
const test =[
	{ type:"status",value:"false" },
	{ type:"priceType",value:'Polygon' },
	{ type:"min",value:'1.00' },
	{ type:"max",value:'4.00' }
]
export const userNFT:NextPage<Props> = ({nfts,query,pageOwner}) => {
	const [data,setData] = useState(nfts);
	return (
		<FilterContext>
			<div style={{display:"flex",marginTop:"20px"}}>
				<Filter/>
				<div style={{flex:"1 1 auto"}}>
					<div className="container">
						<div style={{display:"flex",justifyContent:"center",flexWrap:"wrap"}}>
							{query.map(item =>
								<QueryFilter query={item.query} key={item.type} type={item.type} value={item.value}/>
							)}
						</div>
						<Grid>
							{data && data.map(item=><NftUser sold={item.sold} key={item.objectId} url={item.dataImg.image} name={item.dataImg.name} id={item.objectId} price={item.price}/>)}
						</Grid>
						<Observable setData={setData} functionName="getUserNFTs" address={pageOwner}/>
					</div>
				</div>
			</div>
		</FilterContext>

	)
}
export default userNFT

/*
{
  priceType: 'Polygon',
  min: '2.00',
  max: '3.00',
  status: 'true',
  user: 'account'
}

*/ 
export const getServerSideProps:GetServerSideProps  = async ({params,req,res,query}) => {
	console.log(query)
	const address = params?.user;
	const userId = req.cookies.user_id;
	const userAddress = address === "account" ? req.cookies.user_id : address;
	if( (!userId || userId === "null") && address === "account" ) {
		return {
			redirect: {
				destination:"/registration?page=user/account",
				permanent:false,
			}
		}
	}
	const request = await fetch(`https://jhsndpxpj1yf.usemoralis.com:2053/server/functions/getUserNFTs?_ApplicationId=${APP_ID}&address=${userAddress}&page=0`);
	const response:{result:[]} = await request.json();
	res.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59'
	)
	const queriesConverted = convert(query)
	return {
		props : {
			nfts:response.result,
			query:queriesConverted,
			pageOwner:userAddress
		}
	}
}  


const Grid = styled("div")({
	display: "grid",
	gap:"20px",
	gridTemplateColumns:"repeat(auto-fit,minmax(200px,333px))",
	justifyContent:"center",
})

const convert = obj => {
	const keys = Object.keys(obj);
	const values = Object.values(obj);
	let newArr = []
	 keys.forEach(item => {
	  if(item == "status") {
		newArr.push({query:"status",type:item,value:obj["status"]})
	  } else if (item == "priceType") {

		let min = obj["min"] || ""
		let max = obj["max"] || ""
		let concat = min && max ? `${min} - ${max}` : min && !max ? `> ${min}` : max && !min ? `< ${max}` : ""
		const priceType = obj["priceType"]
		const query = min && max ? "minmax" : min && !max ? `min` : max && !min ? `max` : null
		newArr.push({query,type:priceType,value:concat})

	  }
	})
	return newArr
  }
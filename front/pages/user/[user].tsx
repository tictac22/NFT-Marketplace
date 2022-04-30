
import { GetServerSideProps, NextPage, GetStaticProps } from 'next';
import {useState, useEffect, Suspense} from "react"
import { APP_ID } from '../../constants';

import { NFT } from '../../interfaces/nft';

import { styled } from '@mui/material';
import { NftUser } from '../../components/nfts/nftUser';
import { Filter } from '../../components/filter';
import { QueryFilter } from '../../components/filter/queryFilters';
import { FilterContext } from '../../context/statusContext';
import { Observable } from '../../components/observable';
import dynamic from 'next/dynamic';
import { IsAuthenticated } from '../../components/privatePage';

const DynamicFilter = dynamic<{}>(() => import("../../components/filter").then(comp => comp.Filter))

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
const userNFT:NextPage<Props> = ({nfts,query,pageOwner}) => {
	const [data,setData] = useState(nfts);
	useEffect(() => {
		setData(nfts)
	},[nfts])
	const filteredData = () => {}
	return (
		<IsAuthenticated>
			<FilterContext>
				<div style={{display:"flex",marginTop:"20px"}}>
					<DynamicFilter/>
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
		</IsAuthenticated>
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
	const address = params?.user;
	const userId = req.cookies?.user_id;

	const userAddress = address === "account" ? userId : address;
	if(!userId || userId === "null" ) {
		return {
			redirect: {
				permanent:false,
				destination:"/registration?page=user/account"
			}
		}
	}
	const request = await fetch(`https://jhsndpxpj1yf.usemoralis.com:2053/server/functions/getUserNFTs?_ApplicationId=${APP_ID}&address=${userAddress}&page=0` + concat(query,true));
	const response:{result:[]} = await request.json();
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
	marginBottom:"20px"
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

  const concat = (obj,isQuery?:boolean) => {
	const user = obj["user"]
    let string = "/user" + "/" + user + "?"
    isQuery ? string = "&" : ""

	for(let key in obj) {
		if(key != "user" && obj[key] != undefined) {
		string = string + key + "=" + obj[key] + "&"
		} 
	}
	return string
}
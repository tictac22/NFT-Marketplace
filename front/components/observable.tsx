
import React,{useState,useRef,useEffect} from "react"
import { NFT } from './../interfaces/nft';
import { APP_ID } from './../constants/index';
import { useRouter } from 'next/router';
interface Props {
	setData:React.Dispatch<React.SetStateAction<NFT[]>>,
	functionName:string,
	address?:string
}
export const Observable:React.FC<Props> = ({setData,functionName,address}) => {
	const {query} = useRouter();
	const [hasMore,setHasMore] = useState<boolean>(true);
	const datasElements = useRef<HTMLDivElement>(null!);
	const [page,setPage] = useState<number>(0);

	useEffect(() => {
		setPage(0)
	},[query])

	useEffect(() => {
		const observer = new IntersectionObserver((entries,observer) => {
			entries.forEach( async (entry) => {
				if(!entry.isIntersecting && hasMore) return

				const nextPage = page + 1
				const isAddress = address && '&address='+address || "";
				const queries = functionName === "getUserNFTs" ? concat(query,true) : ""
				const request = await fetch(`https://jhsndpxpj1yf.usemoralis.com:2053/server/functions/${functionName}?_ApplicationId=${APP_ID}&page=${nextPage}${isAddress}${queries}`);
				const response = await request.json();
				if(!response.result) {
					setHasMore(false);
					observer.unobserve(entry.target)
					return
				}
				setData(prev => [...prev,...response.result])
				setPage(nextPage);
				observer.unobserve(entry.target)
				
			})
		}, 
		{
			rootMargin:'1000px'
		})
		observer.observe(datasElements.current)
	},[page,query])
	return (
		<div ref={datasElements}> </div>
	)
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
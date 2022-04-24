
import React,{useState,useRef,useEffect} from "react"
import { NFT } from './../interfaces/nft';
import { APP_ID } from './../constants/index';
interface Props {
	setData:React.Dispatch<React.SetStateAction<NFT[]>>,
	functionName:string,
	address?:string
}
export const Observable:React.FC<Props> = ({setData,functionName,address}) => {
	const [hasMore,setHasMore] = useState<boolean>(true);
	const datasElements = useRef<HTMLDivElement>(null!);
	const [page,setPage] = useState<number>(0);
	useEffect(() => {
		const observer = new IntersectionObserver((entries,observer) => {
			entries.forEach( async (entry) => {
				if(entry.isIntersecting && hasMore) {
					const nextPage = page + 1
					const request = await fetch(`https://jhsndpxpj1yf.usemoralis.com:2053/server/functions/${functionName}?_ApplicationId=${APP_ID}&page=${nextPage}${address && '&address='+address || ""}`);
					const response = await request.json();
					if(!response.result) {
						setHasMore(false);
						observer.unobserve(entry.target)
						return
					}
					setData(prev => [...prev,...response.result])
					setPage(nextPage);
					observer.unobserve(entry.target)
				}
			})
		}, 
		{
			rootMargin:'1000px'
		}
		);
		observer.observe(datasElements.current)
	},[page])
	return (
		<div ref={datasElements}> </div>
	)
}
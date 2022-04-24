

import { useEffect, useState } from "react"

const getPrice = async ():Promise<number> => {
	const request = await fetch("https://min-api.cryptocompare.com/data/price?fsym=matic&tsyms=USD,JPY,EUR&api_key=504ba0a009fd2a78aee6d891f3452f1aeb09d070324159f6d3ce686f073c2605")
	const response = await request.json()
	return response.EUR
}

export const usePrice = () => {
	const [price,setPrice] = useState<number>(0);
	useEffect(() => {
		(async() => {
			try {
				const price = await getPrice();
				setPrice(price);
			} catch(e) {
				setPrice(0);
			}
		})()
	},[])
	return {
		tokenPrice:price
	}
}
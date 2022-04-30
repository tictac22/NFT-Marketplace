
import React,{useEffect, useRef} from 'react';
import { useMoralis} from "react-moralis";
import { Context } from '../context/contractContext';

import { marketAddress } from '../constants';
import ABI from "../MarketPlace.json";
interface LayoutProps {
	children: React.ReactNode;
}
import Cookies from 'js-cookie'

export const Layout = ({children}:LayoutProps) => {
	const {account,isInitialized,user,isWeb3Enabled,enableWeb3,isAuthenticated} = useMoralis();
	const notInitialRender = useRef(false)
	
	useEffect(() => {
		const cookieAddress = !Cookies.get("user_id") || Cookies.get("user_id") === "null" ? undefined : Cookies.get("user_id");
		if(cookieAddress) enableWeb3()
		Cookies.set('user_id', account || "null", { expires: 1 })
	},[account,isWeb3Enabled])
	return (
		<Context.Provider value={{abi:ABI.abi,marketAddress}}>
			{children}
		</Context.Provider>
	)
}
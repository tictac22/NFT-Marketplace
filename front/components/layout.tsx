
import React,{useEffect} from 'react';
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
	useEffect(() => {
		if(isInitialized) {
			const cookieAddress = Cookies.get("user_id") || Cookies.get("user_id") === "null" ? undefined : Cookies.get("user_id");
			if(cookieAddress && account) {
				Cookies.set('user_id', account, { expires: 7 })
			}
			if(account) {
				enableWeb3();
			}
			
		}
	},[account,isInitialized,isWeb3Enabled,enableWeb3])
	return (
		<Context.Provider value={{abi:ABI.abi,marketAddress}}>
			{children}
		</Context.Provider>
	)
}
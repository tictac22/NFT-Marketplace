import React, { useState,useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from '@mui/material/Alert';

import { useContract } from '../../context/contractContext';
import { useMoralis } from 'react-moralis';
import { usePrice } from './../../hooks/getTokenPrice';

interface Props {
	show:boolean,
	handleClose:() => void,
	itemId:number,
	address:string,
	objectId:string,
}
export const ResellModal:React.FC<Props> = ({show,handleClose,itemId,address:account,objectId}) => {
	const {Moralis,authenticate,isAuthenticated,isWeb3Enabled} = useMoralis();
	
	const {marketAddress,abi}= useContract()
	const {tokenPrice}= usePrice();
	
	const [price,setPrice] = useState<string>("");
	const [balance,setBalance] = useState<number>(0);

	const resell = async () => {
		if(!isAuthenticated || !isWeb3Enabled){
			const user = await authenticate()
			if(!user) return;
		}
		const weiPrice = Moralis.Units.ETH(parseFloat(price))
		const sendOptions = {
			contractAddress: marketAddress,
			functionName: "resellMarketItem",
			abi:abi,
			params: {
				_itemId: itemId,
				price:weiPrice
			},
			msgValue: Moralis.Units.ETH(0.02)
		};
		
		await Moralis.executeFunction(sendOptions);

		const Item = Moralis.Object.extend("ItemCreated");
		const query = new Moralis.Query(Item);
		query.equalTo("objectId", objectId);
		const results = await query.find();
		const nft  = results[0];
		nft.set("sold",false);
		nft.set("price",weiPrice);
		nft.set("owner",marketAddress.toLowerCase());
		nft.set("seller",account);
		await nft.save();
	}
	useEffect(() => {
		const getBalance = async () => {
			const options = {
				chain: "mumbai",
				address: account,
			};
			const balance = await Moralis.Web3API.account.getNativeBalance(options);
			return balance
		}
		getBalance().then(data => {
			let tokenValue:string | number = Moralis.Units.FromWei(data.balance)
			tokenValue = parseFloat(tokenValue)
			setBalance(tokenValue)
		})
		
	},[])
	return (
		<div>
			<Dialog
			open={show}
			onClose={handleClose}
			fullWidth={true}
			>
				<DialogTitle id="alert-dialog-title">
					ReSelling NFT
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description" style={{marginBottom:"20px"}}>
					Type your price for the NFT in matic
					</DialogContentText>
							<OutlinedInput 
								value={price} 
								onChange={(e) => setPrice(e.target.value)} 
								sx={{width:"100%"}} 
								placeholder="Price" 
								id="outlined-basic"
								type="number"					  
								endAdornment={<InputAdornment position="end">{price ? (parseFloat(price) * tokenPrice).toFixed(2) : "0"}€</InputAdornment>}			
							/>
				{ balance < 0.02 && <Alert severity="warning" style={{marginTop:"10px"}}>Not enough money on balance, should be at least 0.02</Alert>}
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose}>Disagree</Button>
					<Button onClick={resell} disabled={price ? false : true}>
					Agree
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
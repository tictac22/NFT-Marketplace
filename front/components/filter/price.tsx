
import React, {useState,useEffect} from "react"

import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useQueryParams } from './../../context/statusContext';
import { useRouter } from 'next/router';

export const Price = () => {
	const {query,push} = useRouter();
	const {min,max,currency = "Euro"} = useQueryParams();
	const [minPrice,setMinPrice] = useState(min || "");
	const [maxPrice,setMaxPrice] = useState(max || "");
	const [priceType, setPriceType] = useState(currency);
	const [error,setError] = useState(false);
	const [accordeonStatus,setAccordeonStatus] = useState(min || max ? true : false)
	
	const handleChange = (event: SelectChangeEvent) => {
		setPriceType(event.target.value);
	};
	const handleWrapper = (type:string) => {
		return (event:React.ChangeEvent<HTMLInputElement>) => {
			let string = event.target.value
			const value = checkString(string)
			if(!value) return
			
			type === "min" ? setMinPrice(string) : setMaxPrice(string)
			if(parseFloat(type ==="min" ? string : minPrice) >= parseFloat(type ==="max" ? string : maxPrice)) return setError(true)
			setError(false)
		}
	}
	const apply = () => {
		let parsedMinPrice = convert(minPrice || "")
		let parsedMaxPrice = convert(maxPrice || "")
		if(!parsedMinPrice && !parsedMaxPrice) return
		setMinPrice(parsedMinPrice)
		setMaxPrice(parsedMaxPrice)
		const path = concat({
			...query,
			priceType,
			min:parsedMinPrice,
			max:parsedMaxPrice
		});
		push(path)
	}
	useEffect(() => {
		const isMin = min === null ? "" : min
		const isMax = max === null ? "" : max
		setMinPrice(isMin)
		setMaxPrice(isMax) 
		if(!isMin && !isMax) setAccordeonStatus(false);
	},[min,max])
	return (
		<Accordion disableGutters={true} expanded={accordeonStatus} onChange={() => {setAccordeonStatus(!accordeonStatus)}}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel2a-content"
				id="panel2a-header">
				<Typography>Price</Typography>
			</AccordionSummary>
			<AccordionDetails>
					<FormControl fullWidth>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={priceType}
							onChange={handleChange}
							>
							<MenuItem value={"Polygon"}>Polygon</MenuItem>
							<MenuItem value={"Euro"}>Euro</MenuItem>
						</Select>
					</FormControl>
					<div style={{display:"flex",alignItems:'center',margin:"10px 0px"}}>
						<TextField value={minPrice} type="number" onChange={handleWrapper("min")} id="outlined-basic" placeholder="Min" variant="outlined" sx={{"& fieldset":{borderRadius:"10px"}}} />
						<p style={{margin:"10px"}}>to</p>
						<TextField value={maxPrice}  type="number" onChange={handleWrapper("max")} id="outlined-basic" placeholder="Max" variant="outlined" sx={{"& fieldset":{borderRadius:"10px"}}}/>
					</div>
					{error && <p style={{color:'rgb(235, 87, 87)',fontSize:"12px"}}>Minimum must be less than maximum</p>}
					<Button disabled={error} onClick={apply} sx={{display:"flex",margin:"0 auto",marginTop:'10px'}} variant="outlined">Apply</Button>
			</AccordionDetails>
		</Accordion>
	)
}

const checkString = (string:string) => {
	const value = string
	if(value == "") return true
	const arrValue = value.split("")
	if(arrValue.length >= 2 && arrValue[0] == "0" && arrValue[1] != ".") return false;
	return value
}
const convert = (string:string):string => {
	if(string == "") return ""
	let splitedString = string.split(".")
	const pattern2 = /\.../
	
	if(splitedString.length == 1) {
		return string + ".00"
	}
	if(pattern2.test(string)) {
		return string
	}
	if(splitedString[1].length == 1) {
		return string + "0"
	}
	
}

const concat = (obj) => {
	const user = obj["user"]
	let string = "/user" + "/" + user + "?"
	for(let key in obj) {
		if(key != "user" && obj[key] != undefined) {
		string = string + key + "=" + obj[key] + "&"
		} 
	}
	return string
}
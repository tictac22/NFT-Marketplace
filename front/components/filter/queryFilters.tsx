
import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material';
import { useRouter } from 'next/router';
import { useQueryParams } from './../../context/statusContext';

interface Props {
	type:string,
	value:string,
	query:string
}
const test =[
	{ type:"status",value:"false" },
	{ type:"priceType",value:'Polygon' },
	{ type:"min",value:'1.00' },
	{ type:"max",value:'4.00' }
]
export const QueryFilter:React.FC<Props> = ({type,value,query}) => {
	const router = useRouter()
	let status = ""
	if(type == "status") {
		status = value === "true" ? "Sold" : "On sale"
	} else if (type == "Polygon" || "Euro") {
		status = status + `${type}: ${value}`
	}
	const deleteFilter = () => {
		if(query === "status") {
			const path = concat({...router.query,status:undefined});
			return router.push(path)
		} else if (query == "min") {
			const path = concat({...router.query,priceType:undefined,min:undefined});
			return router.push(path)
		} else if (query == "max") {
			const path = concat({...router.query,priceType:undefined,max:undefined});
			return router.push(path)
		} else {
			const path = concat({...router.query,priceType:undefined,max:undefined,min:undefined});
			return router.push(path)
		}
	}
	return (
		<Wrapper onClick={deleteFilter}>
			<p>
				{status}
			</p>
			<CloseIcon style={{color: "rgb(112, 122, 131)"}}/>
		</Wrapper>
	)
}

const Wrapper = styled("div")({
	backgroundColor: "rgba(21, 178, 229, 0.06)",
	padding: "10px 20px",
	borderRadius: "10px",
	border: "1px solid rgb(21, 178, 229)",
	display: "flex",
	alignItems:'center',
	cursor: "pointer",
	marginRight:"10px",
	marginBottom:"10px",
	"&:hover": {
		boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"
	},
})

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
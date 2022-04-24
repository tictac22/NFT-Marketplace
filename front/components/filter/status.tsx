
import React,{memo, useState, useEffect} from "react"
import { FilterButton } from './buttons/filterButton';
import { useRouter } from 'next/router';
import { useQueryParams } from "../../context/statusContext";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const Status:React.FC = memo(() => {
	const {push,query} = useRouter();
	const {status} = useQueryParams()
	const [accordeonStatus,setAccordeonStatus] = useState(status != null ? true : false)
	const handleStatus = (text:string) => {
		const statusType = text === "sold" ? true : false
		if(status === statusType) {
			const path = concat({...query,status:undefined});
			console.log(path)
			return push(path)
		}
		const path = concat({...query,status:`${statusType}`});
		return push(path)
	}
	useEffect(() => {
		if(status === null) setAccordeonStatus(false)
	},[status])
	return (
		<Accordion disableGutters={true} expanded={accordeonStatus} onChange={() => {setAccordeonStatus(!accordeonStatus)}}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography>Status</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<FilterButton handleStatus={handleStatus} status={`${status}`} marginRight={"30px"} text={"on sale"}/>
					<FilterButton handleStatus={handleStatus} status={`${status}`} text={"sold"}/>
				</AccordionDetails>
		</Accordion>
	)
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
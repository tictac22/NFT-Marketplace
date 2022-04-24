
import React, {useState} from 'react';
import Button from '@mui/material/Button';

interface Props {
	text:string,
	marginRight?:string,
	status:string,
	handleStatus:(text:string) => void
}
const convertedStatus = {
	true:"sold",
	false:"on sale",
	null: ""
}

export const FilterButton:React.FC<Props> = ({text,marginRight = "0px",status,handleStatus}) => {
	return (
		<Button 
			style={{
				marginRight:`${marginRight}`,
				backgroundColor:`${text === convertedStatus[status] ? "#b0d0ff" : "white"}`
			}} 
			variant="outlined"
			onClick={() => {handleStatus(text)}}
		>
			{text}
		</Button>
	)
}
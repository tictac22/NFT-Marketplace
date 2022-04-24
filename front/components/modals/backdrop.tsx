import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

interface Props {
	show:boolean
}
export const BackDrop:React.FC<Props> = ({show}) => {
	return (
			<Backdrop
			sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
			open={show}
			>
			<CircularProgress color="inherit" />
			</Backdrop>
	);
}
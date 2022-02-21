import type { NextPage } from 'next'

import { useState,useRef } from 'react';

import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Home: NextPage = () => {
	const [img,setImg] = useState(null);
	const ref = useRef(null)
	const nftToupload = (e:React.ChangeEvent<HTMLInputElement>):void => {
		const file = e.target.files![0];
		if(!file) return;
		let types = ["image/jpeg", "image/png"];
		if(types.indexOf(file.type)  == -1) return;
		if(file.size > 100 * 1024**2) return;
		ref.current.src = URL.createObjectURL(file)

	}
	return (
		<Container>
			<Form>
				<FormElement>
					<p>Name</p>
					<TextField sx={{width:"100%"}} placeholder="Item name" id="outlined-basic" variant="outlined" />
				</FormElement>
				<FormElement>
					<p>Description</p>
					<p>The description will be included on the item's detail page underneath its image</p>
					<TextArea placeholder="Provide a detailed description of your item"/>
				</FormElement>
				<FileSelect>
					<p>File types supported: JPG, PNG</p>
					<Button variant="contained">Chose image</Button>
					<InputFile onChange={nftToupload} type="file" accept="image/png, image/jpeg" multiple/>
				</FileSelect>
				<ImagePreview ref={ref} src="" alt="#" title=" "/>
				<Button sx={{marginTop:"30px"}} variant="contained">Upload</Button>
			</Form>
		</Container>
	)
}

export default Home

const Container = styled("div")({
	display: "flex",
	alignItems:"center",
	justifyContent:"center",
	minHeight:"100vh",
})
const Form = styled("div")({
	display: "flex",
	flexDirection:"column",
	alignItems:"center",
	gap:"13px",
	maxWidth:"1024px",
	width: "100%",
	margin: "15px 15px"

})
const FormElement = styled("div")({
	width: "100%",
	"& p": {
		marginBottom:"10px",
	}
})
const TextArea = styled("textarea")({
	width: "100%",
	resize: "vertical",
	height: "250px",
	maxHeight:"250px",
	border: "1px solid rgba(0, 0, 0, 0.87)",
	borderRadius:"4px",
	padding: "10px",
})
const FileSelect = styled("div")({
	position:"relative",
	textAlign:"center",
	"& p": {
		marginBottom:"10px"
	}
})
const InputFile = styled("input")({
	position: "absolute",
	top: 0,
	left: 0,
	width:"100%",
	height:"100%",
	opacity: "0",
	fontSize:"0",
	cursor: "pointer"
})

const ImagePreview = styled("img")({
	maxWidth: "350px",
	height: "257px",
	width: "100%",
	height: "100%",
	objectFit:"cover"
})
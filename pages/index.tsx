import type { NextPage } from 'next'

import { useState,useRef } from 'react';

import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface Form {
	name:string,
	description:string,
}

const Home: NextPage = () => {
	const [form,setForm] = useState<Form>({name:"",description:""});
	const [img,setImg] = useState();
	const ref = useRef(null)
	const isDisabled = form.name.trim() && form.description.trim() && ref.current.src.replace("http://localhost:3000/","") ? false : true;
	//console.log(isDisabled)
	const ChangeForm = (e,field:string):void => {
		let value = e.target.value;
		if(value.length <= 1) value = value.trimStart();
		setForm(prevState =>({...prevState,[field]:value}))
	}
	const nftToupload = (e:React.ChangeEvent<HTMLInputElement>):void => {
		const file = e.target.files![0];
		if(!file) return;
		let types = ["image/jpeg", "image/png"];
		if(types.indexOf(file.type)  == -1) return;
		if(file.size > 100 * 1024**2) return;
		ref.current.src = URL.createObjectURL(file)
		setImg(URL.createObjectURL(file))
	}
	const createNft = ():void => {
		console.log(form,img)
	}
	return (
		<main>
			<div className="container">
				<Form>
					<FormElement>
						<p>Name</p>
						<TextField value={form.name} onChange={e=>{ChangeForm(e,"name")}} sx={{width:"100%"}} placeholder="Item name" id="outlined-basic" variant="outlined" />
					</FormElement>
					<FormElement>
						<p>Description</p>
						<p>The description will be included on the item's detail page underneath its image</p>
						<TextArea value={form.description} onChange={e=>{ChangeForm(e,"description")}} placeholder="Provide a detailed description of your item"/>
					</FormElement>
					<FileSelect>
						<p>File types supported: JPG, PNG</p>
						<Button variant="contained">Chose image</Button>
						<InputFile onChange={nftToupload} type="file" accept="image/png, image/jpeg" multiple/>
					</FileSelect>
					<ImagePreview ref={ref} src="" alt="#" title=" "/>
					<Button onClick={createNft} disabled={isDisabled} variant="contained">Upload</Button>
				</Form>
			</div>
		</main>
	)
}

export default Home

const Form = styled("div")({
	display: "flex",
	flexDirection:"column",
	alignItems:"center",
	gap:"13px",
	marginTop:"20px",
	"& > div": {
		marginTop:"10px"
	}

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
import type { GetServerSideProps, NextPage } from 'next'

import { useState,useRef, useEffect } from 'react';

import { styled } from '@mui/system';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';

interface Form {
	name:string,
	description:string,
	price:string,
	img:{
		url:string,
		data:File
	}
}
interface Props {
	response: {
		EUR:number
	}
}
const Home: NextPage<Props> = ({response}) => {
	const [form,setForm] = useState<Form>({name:"",description:"",price:"",img:{url:"",data:{}}});
	const ref = useRef(null)
	const isDisabled = form.name.trim() && form.description.trim() && form.price && form.img.url && form.img.data ? false : true;
	const ChangeForm = (field:string) => {
		return (e:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			let value = e.target.value;
			if(value.length <= 1) value = value.trimStart();
			setForm(prevState =>({...prevState,[field]:value}))
		}
	}
	const nftToupload = (e:React.ChangeEvent<HTMLInputElement>):void => {
		const file = e.target.files![0];
		if(!file) return;
		let types = ["image/jpeg", "image/png"];
		if(types.indexOf(file.type)  == -1) return;
		if(file.size > 100 * 1024**2) return;
		ref.current.src = URL.createObjectURL(file)
		setForm(prevState =>(
			{...prevState,
				img:{
					url:URL.createObjectURL(file),
					data:file
				}
		}))
	}
	const createNft = ():void => {
		console.log(form)
	}
	return (
		<main>
			<div className="container">
				<Form>
					<FormElement>
						<p>Name</p>
						<TextField value={form.name} onChange={ChangeForm("name")} sx={{width:"100%"}} placeholder="Item name" id="outlined-basic" variant="outlined" />
					</FormElement>
					<FormElement>
						<p>Description</p>
						<p>The description will be included on the item's detail page underneath its image</p>
						<TextArea value={form.description} onChange={ChangeForm("description")} placeholder="Provide a detailed description of your item"/>
					</FormElement>
					<FormElement>
						<p>Set price in matic</p>
						<OutlinedInput 
							value={form.name} 
							onChange={ChangeForm("price")} 
							sx={{width:"100%"}} 
							placeholder="Price" 
							id="outlined-basic"
							value={form.price}
							type="number"					  
							endAdornment={<InputAdornment position="end">{form.price ? (parseFloat(form.price) * response.EUR).toFixed(2) : "0"}€</InputAdornment>}				
						/>
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

export const getServerSideProps:GetServerSideProps = async () => {
	const request = await fetch("https://min-api.cryptocompare.com/data/price?fsym=matic&tsyms=USD,JPY,EUR&api_key=504ba0a009fd2a78aee6d891f3452f1aeb09d070324159f6d3ce686f073c2605")
	const response = await request.json()
	return {
		props : {
			response
		}
	}
}

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
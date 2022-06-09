import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import OutlinedInput from "@mui/material/OutlinedInput"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import { styled } from "@mui/system"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { useMoralis } from "react-moralis"
import { BackDrop } from "../components/modals/backdrop"
import { IsAuthenticated } from "../components/privatePage"
import { useContract } from "../context/contractContext"
import { usePrice } from "./../hooks/getTokenPrice"

interface Form {
	name: string
	description: string
	price: string
	img: {
		url: string
		data: File
	}
}

const CreateNft: NextPage = () => {
	const router = useRouter()
	const { Moralis, account, isInitialized, isAuthenticated, isWeb3Enabled, authenticate } = useMoralis()
	const { abi, marketAddress } = useContract()
	const { tokenPrice } = usePrice()

	const [balance, setBalance] = useState<number>(0)
	const [backDrop, setBackDrop] = useState<boolean>(false)

	const [form, setForm] = useState<Form>({
		name: "",
		description: "",
		price: "",
		img: { url: "", data: {} },
	})
	const isDisabled =
		form.name.trim() && form.description.trim() && form.price && form.img.url && form.img.data && balance > 0.1
			? false
			: true

	const ref = useRef<HTMLImageElement>(null!)

	const ChangeForm = (field: string) => {
		return (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			let value = e.target.value
			if (value.length <= 1) value = value.trimStart()
			setForm((prevState) => ({ ...prevState, [field]: value }))
		}
	}
	const nftToupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files![0]
		if (!file) return
		let types = ["image/jpeg", "image/png"]
		if (types.indexOf(file.type) == -1) return
		if (file.size > 100 * 1024 ** 2) return
		ref.current.src = URL.createObjectURL(file)
		setForm((prevState) => ({
			...prevState,
			img: {
				url: URL.createObjectURL(file),
				data: file,
			},
		}))
	}
	const createNft = async () => {
		if (!isAuthenticated || !isWeb3Enabled) {
			const user = await authenticate()
			if (!user) return
		}
		setBackDrop(true)
		const formData = form.img.data
		const imageFile = new Moralis.File(formData.name, formData)
		await imageFile.saveIPFS()
		const imageIpfs = imageFile.ipfs()

		const nftMetadata = {
			name: form.name,
			description: form.description,
			image: imageIpfs,
		}
		const nftFile = new Moralis.File(nftMetadata.name, {
			base64: btoa(JSON.stringify(nftMetadata)),
		})
		await nftFile.saveIPFS()
		const nftIpfs = nftFile.ipfs()

		const ethInWei = Moralis.Units.ETH(form.price)
		try {
			const sendOptions = {
				contractAddress: marketAddress,
				functionName: "createToken",
				abi: abi,
				params: {
					_tokenURI: nftIpfs,
					price: ethInWei,
				},
			}
			const transaction = await Moralis.executeFunction(sendOptions)
			await transaction.wait()

			const ItemData = Moralis.Object.extend("itemCreatedData")
			const itemData = new ItemData()
			itemData.set("title", nftMetadata.name)
			itemData.set("description", nftMetadata.description)
			itemData.set("imageUrl", nftMetadata.image)
			itemData.set("tokenURI", nftIpfs)
			await itemData.save()

			const Item = Moralis.Object.extend("ItemCreated")
			const query = new Moralis.Query(Item)
			query.equalTo("tokenURI", nftIpfs)
			const results = await query.find()
			const result = results[0]
			router.push(`/nft/${result.id}`)
		} catch (error: any) {
			console.log(error.message)
		} finally {
			setBackDrop(false)
		}
	}
	useEffect(() => {
		const getBalance = async () => {
			const options = {
				chain: "mumbai",
				address: account!,
			}
			const balance = await Moralis.Web3API.account.getNativeBalance(options)
			return balance
		}
		if (isInitialized) {
			getBalance().then((data) => {
				let tokenValue: string | number = Moralis.Units.FromWei(data.balance)
				tokenValue = parseFloat(tokenValue)
				setBalance(tokenValue)
			})
		}
	}, [isWeb3Enabled, account])
	console.log(balance)
	return (
		<IsAuthenticated>
			<main style={{ flex: "1 1 auto" }}>
				<div className="container">
					<BackDrop show={backDrop} />
					<Form>
						<FormElement>
							<p>Name</p>
							<TextField
								value={form.name}
								onChange={ChangeForm("name")}
								sx={{ width: "100%" }}
								placeholder="Item name"
								id="outlined-basic"
								variant="outlined"
							/>
						</FormElement>
						<FormElement>
							<p>Description</p>
							<p>The description will be included on the item's detail page underneath its image</p>
							<TextArea
								value={form.description}
								onChange={ChangeForm("description")}
								placeholder="Provide a detailed description of your item"
							/>
						</FormElement>
						<FormElement>
							<p>Set price in matic</p>
							<OutlinedInput
								onChange={ChangeForm("price")}
								sx={{ width: "100%" }}
								placeholder="Price"
								id="outlined-basic"
								value={form.price}
								type="number"
								endAdornment={
									<InputAdornment position="end">
										{form.price ? (parseFloat(form.price) * tokenPrice).toFixed(2) : "0"}€
									</InputAdornment>
								}
							/>
						</FormElement>
						<FileSelect>
							<p>File types supported: JPG, PNG</p>
							<FileSelectWrapper>
								<DivFile></DivFile>
								<InputFile onChange={nftToupload} type="file" accept="image/png, image/jpeg" multiple />
								<ImagePreview ref={ref} src="" alt="#" title=" " />
							</FileSelectWrapper>
						</FileSelect>
						<Tooltip title={balance < 0.1 ? "Your eth wallet balance must more than 0.1 polygon" : ""}>
							<span>
								<Button onClick={createNft} disabled={isDisabled} variant="contained">
									Upload
								</Button>
							</span>
						</Tooltip>
					</Form>
				</div>
			</main>
		</IsAuthenticated>
	)
}
export default CreateNft

const Form = styled("div")({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "13px",
	margin: "20px 0px",
	"& > div": {
		marginTop: "10px",
	},
})
const FormElement = styled("div")({
	width: "100%",
	"& p": {
		marginBottom: "10px",
	},
})
const TextArea = styled("textarea")({
	width: "100%",
	resize: "vertical",
	height: "250px",
	maxHeight: "250px",
	border: "1px solid rgba(0, 0, 0, 0.87)",
	borderRadius: "4px",
	padding: "10px",
})
const FileSelect = styled("div")({
	position: "relative",
	textAlign: "center",
	width: "100%",
	maxWidth: "350px",
	"& p": {
		marginBottom: "10px",
	},
})
const DivFile = styled("div")({
	height: "257px",
})
const InputFile = styled("input")({
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	opacity: "0",
	fontSize: "0",
	cursor: "pointer",
	zIndex: "4",
})
const FileSelectWrapper = styled("div")({
	position: "relative",
	border: "3px dashed",
	color: "rgb(204, 204, 204)",
	borderRadius: "10px",
	transition: "color 0.1s linear",
	"&:hover": {
		color: "rgb(163, 159, 159)",
	},
})
const ImagePreview = styled("img")({
	maxWidth: "335px",
	height: "96%",
	width: "100%",
	objectFit: "cover",
	position: "absolute",
	zIndex: "3",
	left: "50%",
	borderRadius: "16px",
	top: "50%",
	transform: "translate(-50%,-50%)",
})

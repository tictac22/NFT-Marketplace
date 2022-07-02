export interface NFT {
	objectId: string
	price: string
	seller: string
	owner: string
	itemId: number
	sold: boolean
	nftData: NftData[]
}

export interface NFTByName {
	imageUrl: string
	title: string
	nftData: NftData[]
	objectId: string
}

interface NftData {
	title: string
	description: string
	imageUrl: string
	_id: string
}

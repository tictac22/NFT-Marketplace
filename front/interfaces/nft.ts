export interface NFT {
	objectId: string
	price: string
	seller: string
	owner: string
	itemId: number
	sold: boolean
	nftData: [
		{
			title: string
			description: string
			imageUrl: string
		}
	]
}

export interface NFTByName {
	imageUrl: string
	title: string
	nftData: [
		{
			_id: string
		}
	]
}


export interface NFT {
	dataImg: {
		name:string,
		description:string,
		image:string
	}
	objectId:string,
	price:string,
	seller:string,
	owner:string,
	itemId:number,
	sold:boolean,
}
const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("NFT and MarketPlace", () => {
	let NFT;
	let Market;
	let owner;
	let addr1;
	beforeEach(async () => {
		const market = await ethers.getContractFactory("MarketPlace");
		Market = await market.deploy();
		[owner,addr1] = await ethers.getSigners();

		const nft = await ethers.getContractFactory("NFT");
		NFT = await nft.deploy(Market.address);

	})
	describe("Deployment", () => {
		it("Market deploys succesfully", async () => {
			const _owner = await Market.owner();
			const listingPrice = await Market.listingPrice();
			expect(owner.address).to.equal(_owner);
			expect(ethers.utils.formatEther(listingPrice)).to.equal("0.025")
		})
		it("NFT deploys succesfully", async () => {
			expect(await NFT.name()).to.equal("MetaNFT");
			expect(await NFT.symbol()).to.equal("MFT");
			expect(await NFT.marketAddress()).to.equal(Market.address);
		})
	})
	describe("NFT", () => {
		it("creating nft", async () => {
			await NFT.createToken("test");
			expect(await NFT.balanceOf(owner.address)).to.equal(1);
			expect(await NFT.tokenURI(1)).to.equal("test");
			expect(await NFT.ownerOf(1)).to.equal(owner.address);
		})
	})
	describe("MarketPlace", () => {
		beforeEach(async () => {
			await NFT.createToken("test");
			await Market.createMarketItem(NFT.address,1,ethers.utils.parseEther("0.1"),{from:owner.address,value:ethers.utils.parseEther("0.025")});
		})
		it("creats market item", async () => {
			const marketItem = await Market.idToMarketItem(1);
			expect(marketItem.owner).to.equal(Market.address);	
			expect(marketItem.seller).to.equal(owner.address);	
			expect(await NFT.ownerOf(1)).to.equal(Market.address);
		})
		it("sells market item", async () => {
			console.log("Market",Market.address)
			console.log("NFT",NFT.address)
			console.log("owner",owner.address)
			const marketItem = await Market.idToMarketItem(1);
			console.log(marketItem);
			console.log("addr1",addr1.address)
			await Market.connect(addr1).sellMarketItem(NFT.address,1,{from:addr1.address,value:ethers.utils.parseEther("0.125")})
			console.log(await Market.idToMarketItem(1))
			expect(await NFT.ownerOf(1)).to.equal(addr1.address);
		})
	})
});
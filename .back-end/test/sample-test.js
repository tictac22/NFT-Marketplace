const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("MarketPlace", () => {
	let Market;
	let owner;
	let addr1;
	let addr2;
	let addr3;
	const standartPrice = ethers.utils.parseEther("0.02");
	beforeEach(async () => {
		[owner,addr1,addr2,addr3] = await ethers.getSigners();
		
		let market = await ethers.getContractFactory("MarketPlace");
		Market = await upgrades.deployProxy(market,[])
		await market.deploy();
	})
	it("should deploys correctly", async () => {
		expect(await Market.owner()).to.equal(owner.address);
		expect(await Market.name()).to.equal("MetaNFT");
		expect(await Market.symbol()).to.equal("MFT");
		expect((await Market.listingPrice()).toString()).to.equal(standartPrice.toString())
	})
	it("creates token and market item", async () => {
		await Market.createToken("test",standartPrice);
		const marketItem = await Market.idToMarketItem(1);
		
		expect(marketItem.itemId).to.equal(1)
		expect(marketItem.tokenURI).to.equal("test")
		expect(marketItem.owner).to.equal(Market.address)
		expect(marketItem.seller).to.equal(owner.address)
		expect(marketItem.price.toString()).to.equal(standartPrice.toString())
		expect(marketItem.sold).to.equal(false)
	});
	it("can buy token", async () => {
		await Market.connect(addr1).createToken("test",standartPrice);
		const addr1Balance = await ethers.provider.getBalance(addr1.address);
		const marketItem = await Market.idToMarketItem(1);
		await Market.connect(addr2).buyMarketItem(1,{from:addr2.address,value:marketItem.price.add(standartPrice)})

		const newMarketItem = await Market.idToMarketItem(1);
		expect(newMarketItem.owner).to.equal(addr2.address)
		expect(newMarketItem.seller).to.equal("0x0000000000000000000000000000000000000000")
		expect(newMarketItem.sold).to.equal(true)
		expect((await ethers.provider.getBalance(addr1.address)).toString()).to.equal((addr1Balance.add(standartPrice)).toString())
	})
	it('can resell token', async () => {
		await Market.connect(addr1).createToken("test",standartPrice);
		const marketItem = await Market.idToMarketItem(1);
		await Market.connect(addr2).buyMarketItem(1,{from:addr2.address,value:marketItem.price.add(standartPrice)})

		const newPrice = ethers.utils.parseEther("3");
		await Market.connect(addr2).resellMarketItem(1,newPrice,{from:addr2.address,value:standartPrice});
		const addr1Balance = await ethers.provider.getBalance(owner.address);
		const addr2Balance = await ethers.provider.getBalance(addr2.address);
		const newMarketItem = await Market.idToMarketItem(1);

		expect(newMarketItem.price.toString()).to.equal(newPrice.toString());
		expect(newMarketItem.owner).to.equal(Market.address)
		expect(newMarketItem.seller).to.equal(addr2.address)
		expect(newMarketItem.sold).to.equal(false);


		await Market.connect(addr3).buyMarketItem(1,{from:addr3.address,value:newMarketItem.price.add(standartPrice)});
		const newerMarketItem = await Market.idToMarketItem(1);

		expect(newerMarketItem.owner).to.equal(addr3.address)
		expect(newerMarketItem.seller).to.equal("0x0000000000000000000000000000000000000000")
		expect(newerMarketItem.sold).to.equal(true);
		expect((await ethers.provider.getBalance(addr2.address)).toString()).to.equal(addr2Balance.add(newMarketItem.price))
		expect((await ethers.provider.getBalance(owner.address)).toString()).to.equal(addr1Balance.add(standartPrice))
	})
	describe("checking requirements", () => {
		let marketItem;
		let priceToNeed;
		beforeEach( async()=> {
			await Market.connect(addr1).createToken("test",standartPrice);
			marketItem = await Market.idToMarketItem(1);
			priceToNeed = marketItem.price.add(standartPrice);;
		})
		it("buyMarketItem", async () => {
			await expect(Market.connect(addr1).buyMarketItem(1,{from:addr1.address,value:ethers.utils.parseEther("3")})).to.be.revertedWith("value should be equal price")
			await expect(Market.connect(addr1).buyMarketItem(1,{from:addr1.address,value:priceToNeed})).to.be.revertedWith("you can't buy nft from yourself")
			
			await Market.connect(addr2).buyMarketItem(1,{from:addr2.address,value:priceToNeed})
			await expect(Market.connect(addr1).buyMarketItem(1,{from:addr1.address,value:priceToNeed})).to.be.revertedWith("already sold")
		})
		it("resellMarketItem", async () => {
			await Market.connect(addr2).buyMarketItem(1,{from:addr2.address,value:priceToNeed})

			await expect(Market.connect(addr2).resellMarketItem(1,standartPrice,{from:addr2.address,value:ethers.utils.parseEther("3")})).to.be.revertedWith("value should be equal listingPrice")
			await expect(Market.connect(addr3).resellMarketItem(1,standartPrice,{from:addr3.address,value:standartPrice})).to.be.revertedWith("only owner")

		})
	})
});
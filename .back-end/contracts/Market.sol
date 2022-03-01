// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MarketPlace is ReentrancyGuard {
	using Counters for Counters.Counter;
	Counters.Counter private _itemIds;

	address payable owner;
	uint256 public listingPrice = 0.025 ether;
	mapping(uint256 => MarketItem) idToMarketItem;
	struct MarketItem {
		uint256 itemId;
		address nftContract;
		uint256 tokenId;
		address payable owner;
		address payable seller;
		uint256 price;
		bool sold;
	}
	event MarketItemCreated(uint256 indexed itemId,address indexed nftContract,uint256 indexed tokenId,address owner,address seller,uint256 price,bool sold);
	
	constructor() {
		owner = payable(msg.sender);
	}

	function createMarketItem(address nftContract,uint256 tokenId,uint256 price) public payable nonReentrant {
		require(price > 0);
		require(msg.value == listingPrice);

		_itemIds.increment();
		uint256 currentId = _itemIds.current();

		idToMarketItem[currentId] = MarketItem(currentId,nftContract,tokenId,payable(address(0)),payable(msg.sender),price,false);
		ERC721(nftContract).transferFrom(msg.sender,address(this),tokenId);
		emit MarketItemCreated(currentId, nftContract, tokenId, payable(address(0)), payable(msg.sender),price, false);
	}
	function sellMarketItem(address nftContract, uint256 itemId) public payable nonReentrant {
		uint256 price = idToMarketItem[itemId].price;
		address payable seller = idToMarketItem[itemId].seller;
		require(msg.value == price + listingPrice);

		ERC721(nftContract).transferFrom(address(this),msg.sender,itemId);

		seller.transfer(msg.value);
		owner.transfer(listingPrice);
		idToMarketItem[itemId].owner = payable(msg.sender);
		idToMarketItem[itemId].seller = payable(address(0));
		idToMarketItem[itemId].sold = true;
	}
	function resellMarketItem(address nftContract,uint256 itemId,uint256 price) public {
		require(idToMarketItem[itemId].owner == msg.sender);
		
		idToMarketItem[itemId].sold = false;
		idToMarketItem[itemId].price = price;
		idToMarketItem[itemId].owner = payable(address(this));
		idToMarketItem[itemId].seller = payable(msg.sender);

		ERC721(nftContract).transferFrom(msg.sender,address(this),itemId);
	}
}
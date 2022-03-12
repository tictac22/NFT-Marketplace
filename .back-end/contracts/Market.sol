// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";


contract MarketPlace is ERC721URIStorageUpgradeable {
	using CountersUpgradeable for CountersUpgradeable.Counter;
	CountersUpgradeable.Counter private _itemIds;

	address payable public owner;
	uint256 public listingPrice;
	mapping(uint256 => MarketItem) public idToMarketItem;
	struct MarketItem {
		uint256 itemId;
		string tokenURI;
		address payable owner;
		address payable seller;
		uint256 price;
		bool sold;
	}
	event MarketItemCreated(uint256 indexed itemId,string tokenURI,address owner,address indexed seller,uint256 price);
	function initialize() initializer public {
		owner = payable(msg.sender);
		listingPrice = 0.02 ether;
        __ERC721_init("MetaNFT", "MFT");
	}
    function createToken(string memory _tokenURI,uint256 price) public {
		_itemIds.increment();
		uint256 currentId = _itemIds.current();

		_mint(msg.sender,currentId);
		_setTokenURI(currentId,_tokenURI);
		createMarketItem(_tokenURI,price);
	}
	function createMarketItem(string memory _tokenURI, uint256 price) private {
		uint256 currentId = _itemIds.current();

		idToMarketItem[currentId] = MarketItem(currentId,_tokenURI,payable(address(this)),payable(msg.sender),price,false);
		setApprovalForAll(address(this),true);
		transferFrom(msg.sender,address(this),currentId);
		emit MarketItemCreated(currentId,_tokenURI,address(this),msg.sender,price);
		
	}
	function buyMarketItem(uint256 _itemId) public payable {
		MarketItem storage currentMarketItem = idToMarketItem[_itemId];
		
		require(msg.value == currentMarketItem.price + listingPrice, "value should be equal price");
		require(currentMarketItem.seller != msg.sender,"you can't buy nft from yourself");
		require(!currentMarketItem.sold,"already sold");

		currentMarketItem.seller.transfer(msg.value - listingPrice);
		owner.transfer(msg.value - currentMarketItem.price);

		currentMarketItem.owner = payable(msg.sender);
		currentMarketItem.seller = payable(address(0));
		currentMarketItem.sold = true;

		_transfer(address(this),msg.sender,_itemId);
		 
	}
	function resellMarketItem(uint256 _itemId,uint256 price) public payable {
		MarketItem storage currentMarketItem = idToMarketItem[_itemId];
		require(msg.value == listingPrice,"value should be equal listingPrice");
		require(currentMarketItem.owner == msg.sender,"only owner");
		require(currentMarketItem.owner != address(this));
		require(currentMarketItem.sold,"not sold");

		currentMarketItem.seller.transfer(msg.value);
		
		currentMarketItem.owner = payable(address(this));
		currentMarketItem.seller = payable(msg.sender);
		currentMarketItem.sold = false;
		currentMarketItem.price = price;
		_transfer(msg.sender,address(this),_itemId);

	}
}
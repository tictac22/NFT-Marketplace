
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;
	address public marketAddress;

	constructor(address _marketAddress) ERC721("MetaNFT","MFT") {
		marketAddress = _marketAddress;
	}

	function createToken(string memory _tokenURI) public returns(uint256) {
		_tokenIds.increment();
		uint256 currentId = _tokenIds.current();
		_mint(msg.sender,currentId);
		_setTokenURI(currentId,_tokenURI);
		setApprovalForAll(marketAddress, true);
		return currentId;	
	}
}
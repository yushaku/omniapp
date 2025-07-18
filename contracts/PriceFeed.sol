// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IPriceFeed {
    function getPrice() external view returns (uint256);
}

/**
 * @title PriceFeed
 * @notice A simple contract with a public state variable that can be read cross-chain.
 * @dev This contract would be deployed on target chains (e.g., Ethereum, Polygon, Arbitrum)
 *      and the ReadPublic contract can read its `price` value from any other supported chain.
 */
contract MyPriceFeed is Ownable, IPriceFeed {
    uint256 private price;

    constructor(uint256 _price) Ownable(msg.sender) {
        price = _price;
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }
}

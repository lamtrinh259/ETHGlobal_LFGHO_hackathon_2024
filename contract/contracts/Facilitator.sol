// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {GhoToken} from "./gho-contracts/GhoToken.sol";
import {IGhoToken} from "./gho-contracts/interfaces/IGhoToken.sol";

contract Facilitator {
    IGhoToken private ghoToken;

    constructor(address _ghoTokenAddress) {
        ghoToken = IGhoToken(_ghoTokenAddress);
        ghoToken.addFacilitator(address(this), "TestF", 1_000_000e18);
    }

    function mintGhoToken(address to, uint256 amount) external {
        ghoToken.mint(to, amount);
    }

    function depositFunds(
        uint256 depositAmount,
        uint256 borrowAmount,
        address to
    ) external {
        require(depositAmount * 2 >= borrowAmount * 3, "Not enough collateral");
        ghoToken.mint(to, borrowAmount);
    }
}

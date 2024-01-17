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
    }

    function mintGhoToken(address to, uint256 amount) external {
        ghoToken.mint(to, amount);
    }

    function testFacilitator() external {
        ghoToken.addFacilitator(address(this), "TestF", 1_000_000e18);
    }
}

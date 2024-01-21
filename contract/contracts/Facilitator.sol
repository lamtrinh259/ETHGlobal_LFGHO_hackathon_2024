// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {GhoToken} from "./gho-contracts/GhoToken.sol";
import {IGhoToken} from "./gho-contracts/interfaces/IGhoToken.sol";

contract Facilitator {
    IGhoToken private ghoToken;
    struct UserAccount {
        uint256 depositAmount;
        uint256 borrowedAmount;
    }
    mapping(address => UserAccount) public users;

    constructor(address _ghoTokenAddress) {
        ghoToken = IGhoToken(_ghoTokenAddress);
        ghoToken.addFacilitator(address(this), "TestF", 1_000_000e18);
    }

    function mintGhoToken(address to, uint256 amount) external {
        ghoToken.mint(to, amount);
    }

    function depositFunds(
        uint256 depositAmount,
        uint256 borrowAmount
    ) external {
        require(depositAmount * 2 >= borrowAmount * 3, "Not enough collateral");
        users[msg.sender].depositAmount += depositAmount;
        users[msg.sender].borrowedAmount += borrowAmount;
        ghoToken.mint(msg.sender, borrowAmount);
    }

    function withdrawFunds(
        uint256 withdrawAmount,
        uint256 paybackGhoAmount
    ) external {
        UserAccount storage account = users[msg.sender];

        require(
            account.depositAmount >= withdrawAmount,
            "Insufficient deposit"
        );
        require(
            paybackGhoAmount >= account.borrowedAmount,
            "Need to payback more"
        );

        account.depositAmount -= withdrawAmount;
        account.borrowedAmount -= paybackGhoAmount;

        bool sent = ghoToken.transfer(msg.sender, withdrawAmount);
        require(sent, "Token transfer failed");
    }
}

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require("@openzeppelin/test-helpers");

describe("GhoToken and Facilitator Contracts", () => {
  let GhoToken, Facilitator;
  let ghoTokenInstance, facilitatorInstance;
  let owner, facilitatorAddress;

  beforeEach(async () => {
    [owner, facilitatorAddress, ...others] = await ethers.getSigners();

    GhoToken = await ethers.getContractFactory("GhoToken");
    ghoTokenInstance = await GhoToken.deploy(owner.address);

    Facilitator = await ethers.getContractFactory("Facilitator");

    facilitatorInstance = await Facilitator.deploy(ghoTokenInstance.target);
  });

  describe("GhoToken Minting", () => {
    it("should mint tokens successfully", async () => {
      const amountToDeposit = ethers.parseUnits("100", 18);
      const amountToBorrow = ethers.parseUnits("40", 18);
      await facilitatorInstance.connect(facilitatorAddress).initFacilitator();

      await facilitatorInstance
        .connect(facilitatorAddress)
        .depositFunds(amountToDeposit, amountToBorrow, owner.address);

      const balance = await ghoTokenInstance.balanceOf(owner.address);
      expect(balance).to.equal(amountToBorrow);
    });
  });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require("@openzeppelin/test-helpers");

describe("GhoToken and Facilitator Contracts", () => {
  let GhoToken, Facilitator;
  let ghoTokenInstance, facilitatorInstance;
  let owner, facilitatorAddress;

  beforeEach(async () => {
    [owner, facilitatorAddress, ...others] = await ethers.getSigners();

    // Deploy GhoToken
    GhoToken = await ethers.getContractFactory("GhoToken");
    ghoTokenInstance = await GhoToken.deploy(owner.address);

    // Deploy Facilitator with GhoToken address
    Facilitator = await ethers.getContractFactory("Facilitator");

    facilitatorInstance = await Facilitator.deploy(ghoTokenInstance.target);
  });

  describe("GhoToken Minting", () => {
    it("should mint tokens successfully", async () => {
      const amountToMint = ethers.parseUnits("100", 18); // Mint 100 tokens
      await facilitatorInstance.connect(facilitatorAddress).testFacilitator();
      // // Facilitator mints tokens
      await facilitatorInstance
        .connect(facilitatorAddress)
        .mintGhoToken(owner.address, amountToMint);
      // // Check balance of owner
      const balance = await ghoTokenInstance.balanceOf(owner.address);
      expect(balance).to.equal(amountToMint);
    });

    // it("should fail minting if not called by facilitator", async () => {
    //   const amountToMint = ethers.utils.parseUnits("100", 18);

    //   // Attempt to mint from a non-facilitator address
    //   await expectRevert(
    //     facilitatorInstance
    //       .connect(others[0])
    //       .mintGhoToken(owner.address, amountToMint),
    //     "Caller is not a facilitator"
    //   );
    // });
  });
});

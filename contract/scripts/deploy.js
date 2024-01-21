async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  //   const GhoToken = await ethers.getContractFactory("GhoToken");
  //   const ghoTokenInstance = await GhoToken.deploy(deployer.address);

  //   console.log("GHO Token deployed to:", await ghoTokenInstance.getAddress());

  // Deploy the Facilitator contract
  const Facilitator = await ethers.getContractFactory("Facilitator");
  //   const facilitatorInstance = await Facilitator.deploy(
  //     await ghoTokenInstance.getAddress()
  //   );
  //0x48a7a26B259191711Ca48ee38F81d6639E08be56
  const facilitatorInstance = await Facilitator.deploy(
    "0x48a7a26B259191711Ca48ee38F81d6639E08be56"
  );
  console.log(
    "Facilitator deployed to:",
    await facilitatorInstance.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

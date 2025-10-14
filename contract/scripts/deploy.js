const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const NFTRewards = await ethers.getContractFactory("NFTRewards");
    const nftRewards = await NFTRewards.deploy(deployer.address);
    await nftRewards.deployed();

    console.log("NFTRewards deployed to:", nftRewards.address);
    console.log("Update client/src/utils/constants.js with this address if different");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

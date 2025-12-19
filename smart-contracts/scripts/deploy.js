const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy Token
  const SampattiToken = await hre.ethers.getContractFactory("SampattiToken");
  const token = await SampattiToken.deploy(deployer.address);
  await token.waitForDeployment();
  console.log("Sampatti Token deployed to:", await token.getAddress());

  // 2. Deploy Registry
  const PortfolioRegistry = await hre.ethers.getContractFactory("PortfolioRegistry");
  const registry = await PortfolioRegistry.deploy();
  await registry.waitForDeployment();
  console.log("Portfolio Registry deployed to:", await registry.getAddress());

  // 3. Deploy SIP Vault
  const SIPVault = await hre.ethers.getContractFactory("SIPVault");
  const vault = await SIPVault.deploy();
  await vault.waitForDeployment();
  console.log("SIP Vault deployed to:", await vault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
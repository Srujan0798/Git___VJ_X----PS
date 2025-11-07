const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("Deploying Vitini Jirai Smart Contracts...");

  // Deploy WorkspaceRegistry
  const WorkspaceRegistry = await hre.ethers.getContractFactory("WorkspaceRegistry");
  const workspaceRegistry = await WorkspaceRegistry.deploy();
  await workspaceRegistry.deployed();
  console.log("WorkspaceRegistry deployed to:", workspaceRegistry.address);

  // Deploy AccessManager, passing the WorkspaceRegistry address to its constructor
  const AccessManager = await hre.ethers.getContractFactory("AccessManager");
  const accessManager = await AccessManager.deploy(workspaceRegistry.address);
  await accessManager.deployed();
  console.log("AccessManager deployed to:", accessManager.address);

  // Verify contracts on explorers like Polygonscan or Arbiscan
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for 6 block confirmations before verification...");
    await workspaceRegistry.deployTransaction.wait(6);
    await accessManager.deployTransaction.wait(6);

    console.log("Verifying contracts...");
    try {
        await hre.run("verify:verify", {
            address: workspaceRegistry.address,
            constructorArguments: [],
        });
    } catch (e) {
        console.error("Verification failed for WorkspaceRegistry:", e.message);
    }
    try {
        await hre.run("verify:verify", {
            address: accessManager.address,
            constructorArguments: [workspaceRegistry.address],
        });
    } catch (e) {
        console.error("Verification failed for AccessManager:", e.message);
    }
  }

  // Save deployed addresses for frontend consumption
  const addresses = {
    workspaceRegistry: workspaceRegistry.address,
    accessManager: accessManager.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };
  fs.writeFileSync(
    './deployed-addresses.json',
    JSON.stringify(addresses, null, 2)
  );

  console.log("Deployment complete and addresses saved to deployed-addresses.json!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

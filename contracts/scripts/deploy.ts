import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  // Deploy Voting contract
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();
  console.log("Voting contract deployed to:", await voting.getAddress());

  // Deploy VoteCounter contract
  const VoteCounter = await ethers.getContractFactory("VoteCounter");
  const voteCounter = await VoteCounter.deploy();
  await voteCounter.waitForDeployment();
  console.log("VoteCounter contract deployed to:", await voteCounter.getAddress());

  // Deploy SimpleZKPVerifier contract
  const SimpleZKPVerifier = await ethers.getContractFactory("SimpleZKPVerifier");
  const zkpVerifier = await SimpleZKPVerifier.deploy();
  await zkpVerifier.waitForDeployment();
  console.log("SimpleZKPVerifier contract deployed to:", await zkpVerifier.getAddress());

  // Deploy ElectionManager contract
  const ElectionManager = await ethers.getContractFactory("ElectionManager");
  const electionManager = await ElectionManager.deploy();
  await electionManager.waitForDeployment();
  console.log("ElectionManager contract deployed to:", await electionManager.getAddress());

  console.log("All contracts deployed successfully!");

  // Return all contract addresses for use in scripts or frontend
  return {
    voting: await voting.getAddress(),
    voteCounter: await voteCounter.getAddress(),
    zkpVerifier: await zkpVerifier.getAddress(),
    electionManager: await electionManager.getAddress()
  };
}

// Execute the deployment
main()
  .then((addresses) => {
    console.log("Contract addresses:", addresses);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  });
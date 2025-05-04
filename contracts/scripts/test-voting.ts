import { count } from "console";
import { ethers } from "hardhat";

async function main() {

    const VOTING_ADDRESS = '0x638A246F0Ec8883eF68280293FFE8Cfbabe61B44';
    const ZKP_VERIFIER_ADDRESS = '0xFD6F7A6a5c21A3f503EBaE7a473639974379c351';

    // Get contract instances
    const voting = await ethers.getContractAt("Voting", VOTING_ADDRESS);
    const zkpVerifier = await ethers.getContractAt("SimpleZKPVerifier", ZKP_VERIFIER_ADDRESS);

    const electionId = "0";
    console.log(`Testing voting flow for election ID: ${electionId}`);

    // Step 2: Cast votes
    console.log("Casting votes...");

    // Simulate 3 voters casting votes
    for (let i = 0; i < 10; i++) {
        const voterHash = ethers.keccak256(ethers.toUtf8Bytes(`voter${i + 1}`));
        const candidateId = Math.floor(Math.random() * 5);
        const nullifierHash = await zkpVerifier.generateNullifier(voterHash);

        // Cast vote
        const voteTx = await voting.castVote(electionId, nullifierHash, candidateId);
        await voteTx.wait();

        console.log(`Vote casted by Voter ${i + 1} for candidate ${candidateId}`);
    }

    // Step 3: Close the election
    console.log("\nClosing the election...");

    // Step 4: Start the counting phase
    console.log("\nStarting the counting phase...\n");

    console.log("Election Results:");
    console.log("=================\n");

    await voting.getWinner(electionId);

    const events = await voting.queryFilter(voting.filters.CandidateVoteCount());

    console.log("\nVote Counts Per Candidate:");
    for (const e of events) {
        const { candidateId, name, voteCount } = e.args;
        console.log(`Candidate ${name} (ID: ${candidateId}) got ${voteCount} votes`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Test failed:", error);
        process.exitCode = 1;
    });
import { ethers } from "hardhat";

async function main() {

    const VOTING_ADDRESS = '0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f';
    const VOTE_COUNTER_ADDRESS = '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d';
    const ZKP_VERIFIER_ADDRESS = '0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6';
    const ELECTION_MANAGER_ADDRESS = '0x04C89607413713Ec9775E14b954286519d836FEf';

    // Get contract instances
    const voting = await ethers.getContractAt("Voting", VOTING_ADDRESS);
    const voteCounter = await ethers.getContractAt("VoteCounter", VOTE_COUNTER_ADDRESS);
    const zkpVerifier = await ethers.getContractAt("SimpleZKPVerifier", ZKP_VERIFIER_ADDRESS);
    const electionManager = await ethers.getContractAt("ElectionManager", ELECTION_MANAGER_ADDRESS);

    // Get election ID (assuming you know which election to test)
    const electionId = process.env.ELECTION_ID || "0";
    console.log(`Testing voting flow for election ID: ${electionId}`);

    // Step 2: Cast votes
    console.log("Casting votes...");

    // Simulate 3 voters casting votes
    for (let i = 0; i < 10; i++) {
        const voterHash = ethers.keccak256(ethers.toUtf8Bytes(`voter${i + 1}`));
        const secret = ethers.keccak256(ethers.toUtf8Bytes(`secret${i + 1}`));
        const candidateId = Math.floor(Math.random() * 5) + 1;
        const voteCommitment = ethers.keccak256(ethers.toUtf8Bytes(`${candidateId}${secret}`));
        const nullifierHash = await zkpVerifier.generateNullifier(voterHash, secret, electionId);

        // Cast vote
        const voteTx = await voting.castVote(electionId, nullifierHash, voteCommitment);
        await voteTx.wait();

        console.log(`Vote casted by Voter ${i + 1} for candidate ${candidateId}`);
    }

    // Step 3: Close the election
    console.log("\nClosing the election...");

    // Step 4: Start the counting phase
    console.log("\nStarting the counting phase...");


    // Step 5: Reveal votes
    console.log("\nRevealing votes...");

    // Reveal the 3 votes (using the same data as above)
    for (let i = 0; i < 10; i++) {
        const voterHash = ethers.keccak256(ethers.toUtf8Bytes(`voter${i + 1}`));
        const secret = ethers.keccak256(ethers.toUtf8Bytes(`secret${i + 1}`));
        const candidateId = Math.floor(Math.random() * 5) + 1;
        const nullifierHash = await zkpVerifier.generateNullifier(voterHash, secret, electionId);

        // Reveal vote
        const revealTx = await voteCounter.revealVote(
            electionId,
            nullifierHash,
            candidateId,
            secret
        );
        await revealTx.wait();

        console.log(`Vote revealed for candidate ${candidateId}`);
    }

    // Step 6: Finalize the count
    console.log("\nFinalizing the count...");
    const finalizeTx = await voteCounter.finalizeCount(electionId);
    await finalizeTx.wait();
    console.log("Vote count finalized");
    console.log("\nCompleting the election...");


    // Step 8: Get and display results
    console.log("\nElection Results:");
    console.log("=================");

    const totalVotes = await voteCounter.getTotalVotes(electionId);
    console.log(`Total votes cast: ${totalVotes}`);

    // Get election details to display candidate names
    const electionDetails = await voting.getElectionDetails(electionId);
    const candidateCount = electionDetails.candidateCount;

    console.log("\nVotes by candidate:");
    for (let i = 0; i < candidateCount; i++) {
        const candidate = await voting.getCandidate(electionId, i);
        const votes = await voteCounter.getCandidateVotes(electionId, i);
        console.log(`${candidate.name}: ${votes} votes`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Test failed:", error);
        process.exitCode = 1;
    });
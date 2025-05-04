import { ethers } from "hardhat";

async function main() {
    const VOTING_ADDRESS = '0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f';
    const VOTE_COUNTER_ADDRESS = '0x1fA02b2d6A771842690194Cf62D91bdd92BfE28d';
    const ZKP_VERIFIER_ADDRESS = '0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6';
    const ELECTION_MANAGER_ADDRESS = '0x04C89607413713Ec9775E14b954286519d836FEf';

    const voting = await ethers.getContractAt("Voting", VOTING_ADDRESS);
    const voteCounter = await ethers.getContractAt("VoteCounter", VOTE_COUNTER_ADDRESS);
    const zkpVerifier = await ethers.getContractAt("SimpleZKPVerifier", ZKP_VERIFIER_ADDRESS);
    const electionManager = await ethers.getContractAt("ElectionManager", ELECTION_MANAGER_ADDRESS);

    console.log("Setting up a new election...");
    const electionTitle = "India General Election 2025";
    const candidates = [
        "Candidate 1",
        "Candidate 2",
        "Candidate 3",
        "Candidate 4",
        "Candidate 5"
    ];

    // STEP 1: Create election in Voting contract
    console.log("Creating election in Voting contract...");
    const createTx = await voting.createElection(electionTitle, candidates);
    await createTx.wait();
    console.log("Election created in Voting contract");

    // STEP 2: Get election ID
    const electionCount = await voting.electionCount();
    const electionId = electionCount - 1n;
    console.log(`Election ID: ${electionId}`);

    // STEP 3: Register election in ElectionManager
    console.log("Registering election in ElectionManager...");
    const registerTx = await electionManager.registerElection(
        electionTitle,
        VOTING_ADDRESS,
        VOTE_COUNTER_ADDRESS
    );
    await registerTx.wait();
    console.log("Election registered in ElectionManager");

    // STEP 4: Add mock voters to ZKPVerifier
    console.log("Setting up voter verification...");

    const mockVoterHashes = [
        ethers.keccak256(ethers.toUtf8Bytes("voter1")),
        ethers.keccak256(ethers.toUtf8Bytes("voter2")),
        ethers.keccak256(ethers.toUtf8Bytes("voter3")),
        ethers.keccak256(ethers.toUtf8Bytes("voter4")),
        ethers.keccak256(ethers.toUtf8Bytes("voter5")),
        ethers.keccak256(ethers.toUtf8Bytes("voter6")),
        ethers.keccak256(ethers.toUtf8Bytes("voter7")),
        ethers.keccak256(ethers.toUtf8Bytes("voter8")),
        ethers.keccak256(ethers.toUtf8Bytes("voter9")),
        ethers.keccak256(ethers.toUtf8Bytes("voter10"))
    ];

    const addVotersTx = await zkpVerifier.addValidVoters(electionId, mockVoterHashes);
    await addVotersTx.wait();
    console.log("Mock voters added to ZKP verifier");

    // STEP 5: Print test voter secrets and nullifiers
    console.log("\nTest Voter Details (for demo purposes):");
    for (let i = 0; i < mockVoterHashes.length; i++) {
        const secret = ethers.keccak256(ethers.toUtf8Bytes(`secret${i + 1}`));
        const nullifier = await zkpVerifier.generateNullifier(mockVoterHashes[i], secret, electionId);

        console.log(`Voter ${i + 1}:`);
        console.log(`  - Voter Hash: ${mockVoterHashes[i]}`);
        console.log(`  - Secret: ${secret}`);
        console.log(`  - Nullifier Hash: ${nullifier}`);
    }

    console.log("\nElection setup complete!");
    console.log({
        electionId: electionId.toString(),
        title: electionTitle,
        numberOfCandidates: candidates.length,
        numberOfVoters: mockVoterHashes.length
    });
}

main().then(() => process.exit(0)).catch((error) => {
    console.error("Setup failed:", error);
    process.exitCode = 1;
});

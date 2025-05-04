import { ethers } from "hardhat";

async function main() {

    const VOTING_ADDRESS = '0x638A246F0Ec8883eF68280293FFE8Cfbabe61B44';
    const ZKP_VERIFIER_ADDRESS = '0xFD6F7A6a5c21A3f503EBaE7a473639974379c351';
    const ELECTION_MANAGER_ADDRESS = '0xa6e99A4ED7498b3cdDCBB61a6A607a4925Faa1B7';

    const voting = await ethers.getContractAt("Voting", VOTING_ADDRESS);
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
        VOTING_ADDRESS
    );
    await registerTx.wait();
    console.log("Election registered in ElectionManager");

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

    console.log("\nTest Voter Details (for demo purposes):");
    for (let i = 0; i < mockVoterHashes.length; i++) {
        const nullifier = await zkpVerifier.generateNullifier(mockVoterHashes[i]);

        console.log(`Voter ${i + 1}:`);
        console.log(`  - Voter Hash: ${mockVoterHashes[i]}`);
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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleZKPVerifier is Ownable {
    // Root hashes of the Merkle trees containing valid voter hashes
    mapping(uint256 => bytes32) public electionVoterMerkleRoots;

    // Mapping to store valid voter inclusion proofs
    // electionId => voterHash => isValid
    mapping(uint256 => mapping(bytes32 => bool)) public validVoters;

    event VoterAdded(uint256 indexed electionId, bytes32 voterHash);
    event MerkleRootSet(uint256 indexed electionId, bytes32 merkleRoot);

    constructor() Ownable(msg.sender) {}

    function setVoterMerkleRoot(
        uint256 _electionId,
        bytes32 _merkleRoot
    ) external onlyOwner {
        electionVoterMerkleRoots[_electionId] = _merkleRoot;
        emit MerkleRootSet(_electionId, _merkleRoot);
    }

    function addValidVoters(
        uint256 _electionId,
        bytes32[] calldata _voterHashes
    ) external onlyOwner {
        for (uint256 i = 0; i < _voterHashes.length; i++) {
            validVoters[_electionId][_voterHashes[i]] = true;
            emit VoterAdded(_electionId, _voterHashes[i]);
        }
    }

    function verifyVoter(
        uint256 _electionId,
        bytes32 _voterHash,
        bytes memory _proof
    ) external view returns (bool) {
        // For the MVP, we're just checking if the voter hash is in our valid voters mapping
        // In a real implementation, we would verify a Merkle proof or other ZKP here
        return validVoters[_electionId][_voterHash];
    }

    function generateNullifier(
        bytes32 _voterHash,
        bytes32 _secret,
        uint256 _electionId
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(_voterHash, _secret, _electionId));
    }

    function verifyVoteCommitment(
        bytes32 _nullifierHash,
        uint256 _candidateId,
        bytes32 _secret,
        bytes32 _commitment
    ) external pure returns (bool) {
        bytes32 calculatedCommitment = keccak256(
            abi.encodePacked(_nullifierHash, _candidateId, _secret)
        );
        return calculatedCommitment == _commitment;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VoteCounter is Ownable {
    struct VoteResult {
        uint256 electionId;
        bool isCounted;
        mapping(uint256 => uint256) candidateVotes; // candidateId => vote count
        uint256 totalVotes;
        uint256 timestamp;
    }

    // Election ID => Vote Result
    mapping(uint256 => VoteResult) public results;

    // Election ID => (Nullifier Hash => Candidate ID)
    mapping(uint256 => mapping(bytes32 => uint256)) private voteRegistry;

    // Events
    event VoteRevealed(
        uint256 indexed electionId,
        bytes32 nullifierHash,
        uint256 candidateId
    );
    event CountingCompleted(
        uint256 indexed electionId,
        uint256 totalVotes,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    function revealVote(
        uint256 _electionId,
        bytes32 _nullifierHash,
        uint256 _candidateId,
        bytes32 _secret
    ) external {
        VoteResult storage result = results[_electionId];
        require(
            voteRegistry[_electionId][_nullifierHash] == 0,
            "Vote already revealed"
        );
        bytes32 computedCommitment = keccak256(
            abi.encodePacked(_candidateId, _secret)
        );
        require(
            voteRegistry[_electionId][_nullifierHash] ==
                uint256(computedCommitment),
            "Vote commitment mismatch"
        );

        result.candidateVotes[_candidateId]++;
        result.totalVotes++;

        emit VoteRevealed(_electionId, _nullifierHash, _candidateId);
    }

    function finalizeCount(uint256 _electionId) external onlyOwner {
        VoteResult storage result = results[_electionId];
        require(!result.isCounted, "Count already finalized");

        result.isCounted = true;
        result.timestamp = block.timestamp;

        emit CountingCompleted(
            _electionId,
            result.totalVotes,
            result.timestamp
        );
    }

    function getCandidateVotes(
        uint256 _electionId,
        uint256 _candidateId
    ) external view returns (uint256) {
        return results[_electionId].candidateVotes[_candidateId];
    }

    function getTotalVotes(
        uint256 _electionId
    ) external view returns (uint256) {
        return results[_electionId].totalVotes;
    }

    function isVoteRevealed(
        uint256 _electionId,
        bytes32 _nullifierHash
    ) external view returns (bool) {
        return voteRegistry[_electionId][_nullifierHash] > 0;
    }

    function isCountFinalized(
        uint256 _electionId
    ) external view returns (bool) {
        return results[_electionId].isCounted;
    }
}

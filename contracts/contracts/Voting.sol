// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Voting is Ownable {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Election {
        uint256 id;
        string title;
        bool isActive;
        mapping(uint256 => Candidate) candidates;
        mapping(uint256 => uint256) candidateVotes;
        uint256 candidateCount;
        mapping(bytes32 => bool) hasVoted; // nullifier hash => has voted
    }

    mapping(uint256 => Election) public elections;
    uint256 public electionCount;

    event ElectionCreated(uint256 indexed electionId, string title);
    event VoteCast(uint256 indexed electionId, bytes32 nullifierHash);
    event ElectionEnded(uint256 indexed electionId);
    event CandidateVoteCount(
        uint256 candidateId,
        string name,
        uint256 voteCount
    );

    constructor() Ownable(msg.sender) {}

    function createElection(
        string memory _title,
        string[] memory _candidateNames
    ) external onlyOwner {
        require(
            _candidateNames.length >= 5 && _candidateNames.length <= 10,
            "Invalid candidate count"
        );

        uint256 electionId = electionCount++;
        Election storage election = elections[electionId];
        election.id = electionId;
        election.title = _title;
        election.isActive = true;

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            election.candidates[i] = Candidate({
                id: i,
                name: _candidateNames[i],
                voteCount: 0
            });
        }
        election.candidateCount = _candidateNames.length;

        emit ElectionCreated(electionId, _title);
    }

    function castVote(
        uint256 _electionId,
        bytes32 _nullifierHash,
        uint256 candidateToVote
    ) external {
        Election storage election = elections[_electionId];
        require(!election.hasVoted[_nullifierHash], "Already voted");

        // TODO: Add ZKP verification here
        // For MVP, we'll just record the vote commitment
        election.hasVoted[_nullifierHash] = true;
        election.candidateVotes[candidateToVote]++; // Increment vote for candidate 0 (for simplicity)
        election.candidates[candidateToVote].voteCount++;

        emit VoteCast(_electionId, _nullifierHash);
    }

    function endElection(uint256 _electionId) external onlyOwner {
        Election storage election = elections[_electionId];
        require(election.isActive, "Election already ended");

        election.isActive = false;
        emit ElectionEnded(_electionId);
    }

    function getElectionDetails(
        uint256 _electionId
    )
        external
        view
        returns (string memory title, bool isActive, uint256 candidateCount)
    {
        Election storage election = elections[_electionId];
        return (election.title, election.isActive, election.candidateCount);
    }

    function getCandidate(
        uint256 _electionId,
        uint256 _candidateId
    )
        external
        view
        returns (uint256 id, string memory name, uint256 voteCount)
    {
        Election storage election = elections[_electionId];
        Candidate storage candidate = election.candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    function getWinner(
        uint256 _electionId
    )
        external
        returns (
            uint256 winnerId,
            string memory winnerName,
            uint256 highestVoteCount
        )
    {
        Election storage election = elections[_electionId];

        uint256 maxVotes = 0;
        uint256 leadingCandidateId;

        for (uint256 i = 0; i < election.candidateCount; i++) {
            Candidate storage candidate = election.candidates[i];
            emit CandidateVoteCount(
                candidate.id,
                candidate.name,
                candidate.voteCount
            );

            if (candidate.voteCount > maxVotes) {
                maxVotes = candidate.voteCount;
                leadingCandidateId = i;
            }
        }

        Candidate storage winner = election.candidates[leadingCandidateId];
        return (winner.id, winner.name, winner.voteCount);
    }

    // function emitVoteCounts(uint256 _electionId) external {
    //     Election storage election = elections[_electionId];

    //     for (uint256 i = 0; i < election.candidateCount; i++) {
    //         Candidate storage candidate = election.candidates[i];
    //         emit CandidateVoteCount(
    //             candidate.id,
    //             candidate.name,
    //             candidate.voteCount
    //         );
    //     }
    // }
}

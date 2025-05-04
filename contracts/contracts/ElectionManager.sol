// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ElectionManager is Ownable {
    struct ElectionInfo {
        uint256 id;
        string title;
        address votingContract;
        address counterContract;
    }

    mapping(uint256 => ElectionInfo) public elections;
    uint256 public electionCount;

    event ElectionRegistered(
        uint256 indexed electionId,
        string title,
        address votingContract,
        address counterContract
    );

    constructor() Ownable(msg.sender) {}

    function registerElection(
        string memory _title,
        address _votingContract,
        address _counterContract
    ) external onlyOwner returns (uint256) {
        require(_votingContract != address(0), "Invalid voting contract");
        require(_counterContract != address(0), "Invalid counter contract");

        uint256 electionId = electionCount++;

        elections[electionId] = ElectionInfo({
            id: electionId,
            title: _title,
            votingContract: _votingContract,
            counterContract: _counterContract
        });

        emit ElectionRegistered(
            electionId,
            _title,
            _votingContract,
            _counterContract
        );

        return electionId;
    }

    // function startElection(uint256 _electionId) external onlyOwner {
    //     ElectionInfo storage election = elections[_electionId];
    //     ElectionState previousState = election.state;
    //     election.state = ElectionState.Active;
    //     emit ElectionStateChanged(_electionId, previousState, election.state);
    // }

    // function closeElection(uint256 _electionId) external onlyOwner {
    //     ElectionInfo storage election = elections[_electionId];
    //     ElectionState previousState = election.state;
    //     election.state = ElectionState.Closed;
    //     emit ElectionStateChanged(_electionId, previousState, election.state);
    // }

    // function startCounting(uint256 _electionId) external onlyOwner {
    //     ElectionInfo storage election = elections[_electionId];
    //     ElectionState previousState = election.state;
    //     election.state = ElectionState.Counting;
    //     emit ElectionStateChanged(_electionId, previousState, election.state);
    // }

    // function completeElection(uint256 _electionId) external onlyOwner {
    //     ElectionInfo storage election = elections[_electionId];
    //     ElectionState previousState = election.state;
    //     election.state = ElectionState.Completed;
    //     emit ElectionStateChanged(_electionId, previousState, election.state);
    // }

    function getElectionInfo(
        uint256 _electionId
    )
        external
        view
        returns (
            uint256 id,
            string memory title,
            address votingContract,
            address counterContract
        )
    {
        ElectionInfo storage election = elections[_electionId];
        return (
            election.id,
            election.title,
            election.votingContract,
            election.counterContract
        );
    }
}

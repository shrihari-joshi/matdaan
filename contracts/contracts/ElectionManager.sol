// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ElectionManager is Ownable {
    struct ElectionInfo {
        uint256 id;
        string title;
        address votingContract;
    }

    mapping(uint256 => ElectionInfo) public elections;
    uint256 public electionCount;

    event ElectionRegistered(
        uint256 indexed electionId,
        string title,
        address votingContract
    );

    constructor() Ownable(msg.sender) {}

    function registerElection(
        string memory _title,
        address _votingContract
    ) external onlyOwner returns (uint256) {
        require(_votingContract != address(0), "Invalid voting contract");

        uint256 electionId = electionCount++;

        elections[electionId] = ElectionInfo({
            id: electionId,
            title: _title,
            votingContract: _votingContract
        });

        emit ElectionRegistered(electionId, _title, _votingContract);

        return electionId;
    }

    function getElectionInfo(
        uint256 _electionId
    )
        external
        view
        returns (uint256 id, string memory title, address votingContract)
    {
        ElectionInfo storage election = elections[_electionId];
        return (election.id, election.title, election.votingContract);
    }
}

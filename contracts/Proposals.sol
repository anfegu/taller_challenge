// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proposals {
    struct Proposal {
        string title;
        string description;
    }

    Proposal[] public proposals;

    function createProposal(string memory _title, string memory _description) public {
        proposals.push(Proposal(_title, _description));
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WorkspaceRegistry {
    struct Workspace {
        address owner;
        string ipfsHash;
        uint256 version;
    }

    mapping(bytes32 => Workspace) public workspaces;
    bytes32[] public workspaceIds;

    event WorkspaceCreated(bytes32 indexed workspaceId, address indexed owner, string ipfsHash, uint256 version);
    event WorkspaceUpdated(bytes32 indexed workspaceId, address indexed owner, string ipfsHash, uint256 version);

    function createWorkspace(string memory _ipfsHash) public {
        require(bytes(_ipfsHash).length > 0, "ipfsHash cannot be empty");
        bytes32 workspaceId = keccak256(abi.encodePacked(msg.sender, _ipfsHash, block.timestamp));
        workspaces[workspaceId] = Workspace(msg.sender, _ipfsHash, 1);
        workspaceIds.push(workspaceId);
        emit WorkspaceCreated(workspaceId, msg.sender, _ipfsHash, 1);
    }

    function updateWorkspace(bytes32 _workspaceId, string memory _newIpfsHash) public {
        require(workspaces[_workspaceId].owner != address(0), "Workspace does not exist");
        require(workspaces[_workspaceId].owner == msg.sender, "Not owner");
        workspaces[_workspaceId].ipfsHash = _newIpfsHash;
        workspaces[_workspaceId].version++;
        emit WorkspaceUpdated(_workspaceId, msg.sender, _newIpfsHash, workspaces[_workspaceId].version);
    }
}

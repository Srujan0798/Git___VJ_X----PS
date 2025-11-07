// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./WorkspaceRegistry.sol";

contract AccessManager {
    WorkspaceRegistry public workspaceRegistry;

    constructor(address _workspaceRegistryAddress) {
        workspaceRegistry = WorkspaceRegistry(_workspaceRegistryAddress);
    }
}

// This test file is for the Hardhat environment and tests the Solidity smart contracts.
// It does not run as part of the frontend application.
const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('WorkspaceRegistry Contract', () => {
  let workspaceRegistry;
  let owner, user1, user2;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();
    
    const WorkspaceRegistryFactory = await ethers.getContractFactory('WorkspaceRegistry');
    workspaceRegistry = await WorkspaceRegistryFactory.deploy();
    // In Hardhat, `deployed()` is deprecated. The deployment transaction promise resolves when mined.
    await workspaceRegistry.waitForDeployment();
  });

  describe('Workspace Creation', () => {
    it('should create a workspace and emit an event', async () => {
      const ipfsHash = 'QmTest123';
      // The `createWorkspace` function should emit a `WorkspaceCreated` event.
      await expect(workspaceRegistry.connect(user1).createWorkspace(ipfsHash))
        .to.emit(workspaceRegistry, 'WorkspaceCreated');
    });

    it('should store workspace data correctly', async () => {
      const ipfsHash = 'QmTest123';
      const tx = await workspaceRegistry.connect(user1).createWorkspace(ipfsHash);
      const receipt = await tx.wait();
      
      // Manually find the event in the transaction receipt
      const event = receipt.logs.find(log => log.eventName === 'WorkspaceCreated');
      expect(event).to.not.be.undefined;

      const workspaceId = event.args.workspaceId;
      const workspace = await workspaceRegistry.workspaces(workspaceId);

      expect(workspace.owner).to.equal(user1.address);
      expect(workspace.ipfsHash).to.equal(ipfsHash);
      expect(workspace.version).to.equal(1);
    });
  });

  describe('Workspace Updates', () => {
    let workspaceId;

    beforeEach(async () => {
      const tx = await workspaceRegistry.connect(user1).createWorkspace('QmTest123');
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.eventName === 'WorkspaceCreated');
      workspaceId = event.args.workspaceId;
    });

    it('should allow owner to update workspace and emit an event', async () => {
      const newHash = 'QmTest456';
      await expect(workspaceRegistry.connect(user1).updateWorkspace(workspaceId, newHash))
        .to.emit(workspaceRegistry, 'WorkspaceUpdated')
        .withArgs(workspaceId, user1.address, newHash, 2);
      
      const workspace = await workspaceRegistry.workspaces(workspaceId);
      expect(workspace.ipfsHash).to.equal(newHash);
      expect(workspace.version).to.equal(2);
    });

    it('should prevent non-owners from updating', async () => {
      // The contract should revert with the specific error message "Not owner".
      await expect(
        workspaceRegistry.connect(user2).updateWorkspace(workspaceId, 'QmTest456')
      ).to.be.revertedWith('Not owner');
    });

    it('should fail to update a non-existent workspace', async () => {
        const nonExistentId = "0x" + "0".repeat(64); // A zero bytes32 hash
        await expect(
            workspaceRegistry.connect(user1).updateWorkspace(nonExistentId, 'QmTest456')
        ).to.be.revertedWith('Workspace does not exist');
    });
  });
});

const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('AccessManager Contract', () => {
  let workspaceRegistry;
  let accessManager;
  let owner, user1;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();

    const WorkspaceRegistryFactory = await ethers.getContractFactory('WorkspaceRegistry');
    workspaceRegistry = await WorkspaceRegistryFactory.deploy();
    await workspaceRegistry.waitForDeployment();

    const AccessManagerFactory = await ethers.getContractFactory('AccessManager');
    accessManager = await AccessManagerFactory.deploy(workspaceRegistry.target);
    await accessManager.waitForDeployment();
  });

  it('should set the workspace registry address correctly', async () => {
    expect(await accessManager.workspaceRegistry()).to.equal(workspaceRegistry.target);
  });
});

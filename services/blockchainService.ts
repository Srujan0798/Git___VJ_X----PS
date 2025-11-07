
class BlockchainService {
    // Pre-populate with mock data consistent with workspaceService.ts
    private workspaceStorage = new Map<string, string>([
        ['vj-ws-1', 'QmExampleHash1'],
        ['vj-ws-2', 'QmExampleHash2'],
    ]);
    private workspaceCounter = 2; // Start after pre-populated entries

    /**
     * Simulates registering a workspace on a blockchain.
     * @param owner The owner's address.
     * @param ipfsHash The IPFS hash of the workspace data.
     * @returns A promise that resolves to a unique blockchain identifier for the workspace.
     */
    async registerWorkspace(owner: string, ipfsHash: string): Promise<string> {
        console.log(`[Blockchain SIM] Registering workspace for ${owner} with hash ${ipfsHash}`);
        return new Promise(resolve => {
            setTimeout(() => {
                this.workspaceCounter++;
                const blockchainId = `vj-ws-${this.workspaceCounter}`;
                this.workspaceStorage.set(blockchainId, ipfsHash);
                console.log(`[Blockchain SIM] Workspace registered with ID: ${blockchainId}`);
                resolve(blockchainId);
            }, 800);
        });
    }

    /**
     * Simulates retrieving a workspace's IPFS URI from a blockchain.
     * @param blockchainId The unique blockchain identifier for the workspace.
     * @returns A promise that resolves to the IPFS hash.
     */
    async getWorkspaceURI(blockchainId: string): Promise<string> {
        console.log(`[Blockchain SIM] Fetching URI for workspace ID: ${blockchainId}`);
         return new Promise((resolve, reject) => {
            setTimeout(() => {
                const ipfsHash = this.workspaceStorage.get(blockchainId);
                if (ipfsHash) {
                    console.log(`[Blockchain SIM] Found IPFS hash: ${ipfsHash}`);
                    resolve(ipfsHash);
                } else {
                    console.error(`[Blockchain SIM] Workspace ID not found: ${blockchainId}`);
                    reject(new Error("Workspace not found on the blockchain."));
                }
            }, 500);
        });
    }
}

export const blockchainService = new BlockchainService();

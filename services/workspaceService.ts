/**
 * @summary Simulates all backend API calls related to workspace management.
 */
export type Permission = 'view' | 'edit';

export interface Workspace {
    id: string;
    name: string;
    description: string;
    blockchain_id: string;
    ipfs_hash: string;
    owner_address: string;
    created_at: string;
    updated_at: string;
}

// FIX: Export MOCK_WORKSPACES to be used in tests.
export const MOCK_WORKSPACES: Workspace[] = [
    {
        id: 'ws-1',
        name: 'Project Chimera Analysis',
        description: 'Investigation into offshore accounts and crypto transfers related to Case #734.',
        blockchain_id: 'vj-ws-1',
        ipfs_hash: 'QmExampleHash1',
        owner_address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // hardhat test account 0
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'ws-2',
        name: 'Market Fluctuation Report Q3',
        description: 'Tracking BTC and ETH movements in relation to macro economic events.',
        blockchain_id: 'vj-ws-2',
        ipfs_hash: 'QmExampleHash2',
        owner_address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

class WorkspaceService {
    /**
     * @summary Lists all workspaces for the authenticated user.
     * @description Simulates `GET /api/workspaces`.
     * @param {string} authToken - The user's authentication token.
     * @returns {Promise<Workspace[]>} A promise that resolves to an array of workspaces.
     * @throws Will throw an error if the user is not authenticated.
     */
    async listWorkspaces(authToken: string): Promise<Workspace[]> {
        if (!authToken) throw new Error("Authentication required.");
        console.log('[Workspace Service SIM] Listing workspaces');
        return Promise.resolve(MOCK_WORKSPACES);
    }

    /**
     * @summary Retrieves a single workspace by its blockchain ID.
     * @description Simulates `GET /api/workspaces/{blockchainId}`.
     * @param {string} authToken - The user's authentication token.
     * @param {string} blockchainId - The blockchain identifier of the workspace.
     * @returns {Promise<Workspace>} A promise that resolves to the requested workspace.
     * @throws Will throw an error if the workspace is not found or user is not authenticated.
     */
    async getWorkspace(authToken: string, blockchainId: string): Promise<Workspace> {
        if (!authToken) throw new Error("Authentication required.");
        console.log(`[Workspace Service SIM] Getting workspace ${blockchainId}`);
        const ws = MOCK_WORKSPACES.find(w => w.blockchain_id === blockchainId);
        if (ws) {
            return Promise.resolve(ws);
        }
        throw new Error("Workspace not found.");
    }
    
    /**
     * @summary Creates a new workspace.
     * @description Simulates `POST /api/workspaces/create`.
     * @param {string} authToken - The user's authentication token.
     * @param {object} data - The workspace data to create.
     * @returns {Promise<Workspace>} A promise that resolves to the newly created workspace.
     * @throws Will throw an error if the user is not authenticated.
     */
    async createWorkspace(authToken: string, data: Omit<Workspace, 'id' | 'owner_address' | 'created_at' | 'updated_at'>): Promise<Workspace> {
        if (!authToken) throw new Error("Authentication required.");
        console.log('[Workspace Service SIM] Creating workspace', data);
        const newWorkspace: Workspace = {
            id: `ws-${Date.now()}`,
            ...data,
            owner_address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Mock owner
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        MOCK_WORKSPACES.push(newWorkspace);
        return Promise.resolve(newWorkspace);
    }

    /**
     * @summary Shares a workspace with another user.
     * @description Simulates `POST /api/workspaces/{workspaceId}/share`.
     * @param {string} authToken - The user's authentication token.
     * @param {string} workspaceId - The ID of the workspace to share.
     * @param {object} shareData - The address and permission level to grant.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     * @throws Will throw an error if the user is not authenticated.
     */
    async shareWorkspace(authToken: string, workspaceId: string, shareData: { address: string, permission: Permission }): Promise<void> {
        if (!authToken) throw new Error("Authentication required.");
        console.log(`[Workspace Service SIM] Sharing workspace ${workspaceId} with ${shareData.address} (${shareData.permission})`);
        return Promise.resolve();
    }
}

export const workspaceService = new WorkspaceService();
import { initialNodes, initialEdges } from '../store/useStore';
import { NodeType } from '../types';

// Create mock data for the second workspace to ensure it's loadable
const workspace2Nodes = [
  { id: 'w2-1', type: NodeType.LiveFeed, position: { x: 100, y: 100 }, data: { title: 'BTC Price Feed', colorTheme: 'amber' } },
  { id: 'w2-2', type: NodeType.LiveFeed, position: { x: 100, y: 300 }, data: { title: 'ETH Price Feed', colorTheme: 'sky' } },
  { id: 'w2-3', type: NodeType.Chart, position: { x: 400, y: 150 }, data: { title: 'BTC/ETH Comparison', colorTheme: 'violet' } },
  { id: 'w2-4', type: NodeType.Note, position: { x: 400, y: 400 }, data: { title: 'Q3 Observations', text: 'Volatility increasing...', colorTheme: 'green' } },
];
const workspace2Edges = [
  { id: 'w2-e1-3', source: 'w2-1', target: 'w2-3', type: 'custom' },
  { id: 'w2-e2-3', source: 'w2-2', target: 'w2-3', type: 'custom' },
];
const workspace2Data = { nodes: workspace2Nodes, edges: workspace2Edges };


/**
 * @summary Simulates interactions with an IPFS node for uploading and downloading workspace data.
 */
class IPFSService {
    private isConfiguredStatus = true; // Simulate as configured
    private mockStorage = new Map<string, string>();

    constructor() {
        // Pre-populate the mock storage to match the mock data in other services.
        // This fixes the "Hash not found" error on load.
        this.mockStorage.set('QmExampleHash1', JSON.stringify({ nodes: initialNodes, edges: initialEdges }));
        this.mockStorage.set('QmExampleHash2', JSON.stringify(workspace2Data));
    }

    /**
     * @summary Checks if the IPFS service is properly configured.
     * @description In a real app, this would check for API keys or node connections.
     * @returns {boolean} True if the service is configured, false otherwise.
     */
    isConfigured(): boolean {
        return this.isConfiguredStatus;
    }

    /**
     * @summary "Uploads" a string of data to the simulated IPFS storage.
     * @description Simulates an IPFS upload by storing the data in a local map and generating a fake hash.
     * @param {string} data - The stringified workspace data to store.
     * @returns {Promise<string>} A promise that resolves to a unique, fake IPFS hash.
     */
    async upload(data: string): Promise<string> {
        console.log('[IPFS SIM] Uploading data...');
        return new Promise(resolve => {
            setTimeout(() => {
                const hash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
                this.mockStorage.set(hash, data);
                console.log(`[IPFS SIM] Data stored with hash: ${hash}`);
                resolve(hash);
            }, 1000);
        });
    }

    /**
     * @summary "Downloads" a string of data from the simulated IPFS storage using its hash.
     * @description Simulates an IPFS download by retrieving data from a local map.
     * @param {string} hash - The fake IPFS hash of the data to retrieve.
     * @returns {Promise<string>} A promise that resolves to the stored stringified data.
     * @throws Will reject if the hash is not found in the mock storage.
     */
    async download(hash: string): Promise<string> {
        console.log(`[IPFS SIM] Downloading data for hash: ${hash}`);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = this.mockStorage.get(hash);
                if (data) {
                    console.log(`[IPFS SIM] Download complete.`);
                    resolve(data);
                } else {
                    console.error(`[IPFS SIM] Hash not found: ${hash}`);
                    reject(new Error("IPFS hash not found."));
                }
            }, 1000);
        });
    }
}

export { IPFSService };
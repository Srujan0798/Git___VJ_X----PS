import { AppNode, AppEdge } from '../types';

export interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    downloads: number;
    rating: number;
    is_featured: boolean;
    node_count: number;
    edge_count: number;
    structure: { nodes: AppNode[]; edges: AppEdge[] };
    created_at: string;
}

const MOCK_TEMPLATES: Template[] = [
    {
        id: 'tpl-1',
        name: 'Crypto Fraud Investigation',
        description: 'A starter template for tracking illicit cryptocurrency flows between wallets and exchanges. Includes live feeds and analysis nodes.',
        category: 'Legal & Investigation',
        downloads: 1254,
        rating: 4.8,
        is_featured: true,
        node_count: 5,
        edge_count: 4,
        structure: {
            nodes: [
                { id: '1', type: 'databaseNode', position: { x: 50, y: 50 }, data: { title: 'Case Evidence DB' } },
                { id: '2', type: 'liveFeedNode', position: { x: 50, y: 250 }, data: { title: 'BTC Transaction Feed' } },
                { id: '3', type: 'noteNode', position: { x: 350, y: 50 }, data: { title: 'Initial Suspects', text: '- Wallet A\n- Exchange B' } },
                { id: '4', type: 'apiNode', position: { x: 350, y: 250 }, data: { title: 'Wallet Analysis API' } },
                { id: '5', type: 'aiAnalysisNode', position: { x: 650, y: 150 }, data: { title: 'Pattern Detection' } },
            ],
            edges: [
                { id: 'e1-3', source: '1', target: '3', type: 'custom', data: {} },
                { id: 'e2-4', source: '2', target: '4', type: 'custom', data: {} },
                { id: 'e3-5', source: '3', target: '5', type: 'custom', data: {} },
                { id: 'e4-5', source: '4', target: '5', type: 'custom', data: {} },
            ]
        },
        created_at: new Date().toISOString(),
    },
    {
        id: 'tpl-2',
        name: 'Market Arbitrage Monitor',
        description: 'Compare live prices from multiple exchanges to identify and visualize potential arbitrage opportunities.',
        category: 'Trading & Finance',
        downloads: 3280,
        rating: 4.9,
        is_featured: true,
        node_count: 4,
        edge_count: 3,
        structure: { nodes: [], edges: [] },
        created_at: new Date().toISOString(),
    },
    {
        id: 'tpl-3',
        name: 'Educational Resource Mapper',
        description: 'Visually organize and link learning materials, articles, and videos to create a personalized study guide.',
        category: 'Learning & Education',
        downloads: 890,
        rating: 4.6,
        is_featured: true,
        node_count: 3,
        edge_count: 2,
        structure: { nodes: [], edges: [] },
        created_at: new Date().toISOString(),
    }
];

class TemplateService {
    /**
     * @summary Lists all available templates.
     * @description Simulates `GET /api/templates`.
     * @param {string} authToken - The user's authentication token.
     * @returns {Promise<Template[]>} A promise that resolves to an array of templates.
     * @throws Will throw an error if the user is not authenticated.
     */
    async listTemplates(authToken: string): Promise<Template[]> {
        if (!authToken) throw new Error("Authentication required.");
        console.log('[Template Service SIM] Listing templates');
        return Promise.resolve(MOCK_TEMPLATES);
    }
    
    /**
     * @summary Creates a new template from a workspace structure.
     * @description Simulates `POST /api/templates/create`.
     * @param {string} authToken - The user's authentication token.
     * @param {object} data - The template data to create.
     * @returns {Promise<Template>} A promise that resolves to the newly created template.
     * @throws Will throw an error if the user is not authenticated.
     */
    async createTemplate(authToken: string, data: Omit<Template, 'id' | 'downloads' | 'rating' | 'is_featured' | 'created_at' | 'node_count' | 'edge_count'>): Promise<Template> {
        if (!authToken) throw new Error("Authentication required.");
        console.log('[Template Service SIM] Creating template');
        const newTemplate: Template = {
            id: `tpl-${Date.now()}`,
            ...data,
            downloads: 0,
            rating: 0,
            is_featured: false,
            node_count: data.structure.nodes.length,
            edge_count: data.structure.edges.length,
            created_at: new Date().toISOString()
        };
        MOCK_TEMPLATES.push(newTemplate);
        return Promise.resolve(newTemplate);
    }
    
    /**
     * @summary Retrieves the structure of a specific template to apply to a workspace.
     * @description Simulates `GET /api/templates/{templateId}/use`.
     * @param {string} authToken - The user's authentication token.
     * @param {string} templateId - The ID of the template to use.
     * @returns {Promise<{ nodes: AppNode[], edges: AppEdge[] }>} A promise that resolves to the template's node and edge structure.
     * @throws Will throw an error if the template is not found or user is not authenticated.
     */
    async useTemplate(authToken: string, templateId: string): Promise<{ nodes: AppNode[], edges: AppEdge[] }> {
         if (!authToken) throw new Error("Authentication required.");
        console.log(`[Template Service SIM] Using template ${templateId}`);
        const template = MOCK_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            template.downloads++; // Simulate download count increase
            return Promise.resolve(template.structure);
        }
        throw new Error("Template not found.");
    }
}

export const templateService = new TemplateService();
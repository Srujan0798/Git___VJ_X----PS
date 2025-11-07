export interface DataSource {
    id: string;
    name: string;
    type: 'postgresql' | 'mysql' | 'api';
    config: any;
    created_at: string;
}

const MOCK_DATA_SOURCES: DataSource[] = [
    {
        id: 'ds-1',
        name: 'Production DB (Read-only)',
        type: 'postgresql',
        config: { host: 'prod.db.example.com' },
        created_at: new Date().toISOString(),
    },
    {
        id: 'ds-2',
        name: 'CoinMarketCap API',
        type: 'api',
        config: { url: 'https://pro-api.coinmarketcap.com' },
        created_at: new Date().toISOString(),
    }
];

class DataSourceService {
    /**
     * @summary Lists all saved data sources for the authenticated user.
     * @description Simulates `GET /api/datasources`.
     * @param {string} authToken - The user's authentication token.
     * @returns {Promise<DataSource[]>} A promise that resolves to an array of data sources.
     * @throws Will throw an error if the user is not authenticated.
     */
    async listDataSources(authToken: string): Promise<DataSource[]> {
        if (!authToken) throw new Error("Authentication required.");
        return Promise.resolve(MOCK_DATA_SOURCES);
    }

    /**
     * @summary Creates a new saved data source.
     * @description Simulates `POST /api/datasources/create`.
     * @param {string} authToken - The user's authentication token.
     * @param {object} data - The data source configuration to save.
     * @returns {Promise<DataSource>} A promise that resolves to the newly created data source.
     * @throws Will throw an error if the user is not authenticated.
     */
    async createDataSource(authToken: string, data: Omit<DataSource, 'id' | 'created_at'>): Promise<DataSource> {
        if (!authToken) throw new Error("Authentication required.");
        const newSource: DataSource = {
            id: `ds-${Date.now()}`,
            ...data,
            created_at: new Date().toISOString()
        };
        MOCK_DATA_SOURCES.push(newSource);
        return Promise.resolve(newSource);
    }

    /**
     * @summary Deletes a saved data source.
     * @description Simulates `DELETE /api/datasources/{id}`.
     * @param {string} authToken - The user's authentication token.
     * @param {string} id - The ID of the data source to delete.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     * @throws Will throw an error if the user is not authenticated.
     */
    async deleteDataSource(authToken: string, id: string): Promise<void> {
        if (!authToken) throw new Error("Authentication required.");
        const index = MOCK_DATA_SOURCES.findIndex(ds => ds.id === id);
        if (index > -1) {
            MOCK_DATA_SOURCES.splice(index, 1);
        }
        return Promise.resolve();
    }
}

export const dataSourceService = new DataSourceService();
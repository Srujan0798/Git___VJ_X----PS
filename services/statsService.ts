export interface UserStats {
    totalWorkspaces: number;
    activeNodes: number;
    dataSources: number;
    sharedTemplates: number;
}

class StatsService {
    /**
     * @summary Fetches aggregate statistics for the authenticated user.
     * @description Simulates `GET /api/stats`.
     * @param {string} authToken - The user's authentication token.
     * @returns {Promise<UserStats>} A promise that resolves to an object containing user statistics.
     * @throws Will throw an error if the user is not authenticated.
     */
    async getUserStats(authToken: string): Promise<UserStats> {
        if (!authToken) throw new Error("Authentication required.");
        console.log('[Stats Service SIM] Fetching user stats');
        // In a real app, this would be a complex query. Here, we mock it.
        return Promise.resolve({
            totalWorkspaces: 5,
            activeNodes: 142,
            dataSources: 3,
            sharedTemplates: 1,
        });
    }
}

export const statsService = new StatsService();
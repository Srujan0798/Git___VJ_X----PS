export interface User {
    id: string;
    wallet_address: string;
    subscription_tier: 'free' | 'pro' | 'enterprise';
    created_at: string;
    last_login: string;
}

class UserService {
    private mockUser: User | null = null;

    /**
     * @summary Retrieves the user profile, creating one if it doesn't exist.
     * @description Simulates `POST /api/users/findOrCreate`.
     * @param {string} authToken - The user's authentication token.
     * @param {string} address - The user's wallet address.
     * @returns {Promise<User>} A promise that resolves to the user's profile.
     * @throws Will throw an error if the user is not authenticated.
     */
    async getOrCreateUser(authToken: string, address: string): Promise<User> {
        if (!authToken) throw new Error("Authentication required.");
        console.log('[User Service SIM] Getting or creating user for address:', address);
        if (this.mockUser && this.mockUser.wallet_address === address) {
            this.mockUser.last_login = new Date().toISOString();
            return Promise.resolve(this.mockUser);
        }
        this.mockUser = {
            id: `user-${Date.now()}`,
            wallet_address: address,
            subscription_tier: 'pro', // Default to pro for mock
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
        };
        return Promise.resolve(this.mockUser);
    }
    
    /**
     * @summary Retrieves the profile for the currently authenticated user.
     * @description Simulates `GET /api/users/me`.
     * @param {string} authToken - The user's authentication token.
     * @returns {Promise<User>} A promise that resolves to the user's profile.
     * @throws Will throw an error if the user is not found or not authenticated.
     */
    async getUser(authToken: string): Promise<User> {
        if (!authToken) throw new Error("Authentication required.");
        console.log('[User Service SIM] Getting current user');
        if (this.mockUser) {
            return Promise.resolve(this.mockUser);
        }
        throw new Error("User not found. Please log in again.");
    }
}

export const userService = new UserService();
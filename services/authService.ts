class AuthService {
  /**
   * @summary Generates a mock authentication token based on a user's signed message.
   * @description Simulates a backend `POST /api/auth/login` endpoint that would verify a signature.
   * @param {string} address - The user's wallet address.
   * @param {string} signature - The signature of the message.
   * @param {string} message - The original message that was signed.
   * @returns {Promise<string>} A promise that resolves to a mock JWT-like token.
   * @throws Will reject if the signature data is invalid.
   */
  async generateToken(
    address: string,
    signature: string,
    message: string
  ): Promise<string> {
    console.log('[Auth SIM] Validating signature and generating token...');
    // Mock validation
    if (address && signature && message) {
      // Create a mock JWT-like token (header.payload.signature)
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: address, exp: Date.now() + 3600 * 1000 }));
      const mockSignature = 'mock-signature';
      const token = `${header}.${payload}.${mockSignature}`;
      
      console.log('[Auth SIM] Token generated for address:', address);
      return Promise.resolve(token);
    } else {
      return Promise.reject(new Error('Authentication failed: Invalid signature data.'));
    }
  }
}

export const authService = new AuthService();
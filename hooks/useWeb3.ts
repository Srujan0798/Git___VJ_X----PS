import { create } from 'zustand';
import { ethers } from 'ethers';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { auditLogService } from '../services/auditLogService';

type Web3State = {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  isAuthenticated: boolean;
  authToken: string | null;
  isLoading: boolean;
  error: string | null;
};

type Web3Actions = {
  loginWithExternal: () => Promise<void>;
  loginWithMnemonic: (mnemonic: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
};

const initialState: Web3State = {
  provider: null,
  signer: null,
  account: null,
  isAuthenticated: false,
  authToken: null,
  isLoading: false,
  error: null,
};

export const useWeb3Store = create<Web3State & Web3Actions>((set, get) => ({
  ...initialState,

  initialize: () => {
    // This could be used to auto-reconnect on page load if a wallet is already connected
  },

  loginWithExternal: async () => {
    // Fix: Cast window to any to access the injected ethereum object from MetaMask.
    if (!(window as any).ethereum) {
      set({ error: "MetaMask not detected. Please install the browser extension.", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      
      const message = `Sign this message to log in to Vitini Jirai.\n\nTimestamp: ${Date.now()}`;
      const signature = await signer.signMessage(message);
      
      const authToken = await authService.generateToken(account, signature, message);
      await userService.getOrCreateUser(authToken, account);

      set({ provider, signer, account, isAuthenticated: true, authToken, isLoading: false });
      
      // Audit log integration
      auditLogService.logSecurityEvent(account, 'login', 'info', { method: 'external_wallet' });

    } catch (err: any) {
      console.error("External login failed:", err);
      set({ error: err.message || "Failed to connect with external wallet.", isLoading: false });
    }
  },
  
  loginWithMnemonic: async (mnemonic: string) => {
    set({ isLoading: true, error: null });
    try {
        if (!ethers.Mnemonic.isValidMnemonic(mnemonic)) {
            throw new Error("Invalid mnemonic phrase.");
        }
        const wallet = ethers.Wallet.fromPhrase(mnemonic);
        const account = wallet.address;
        
        // No provider/signer needed for in-app wallet in this simulation,
        // but a real one would connect to an RPC endpoint.
        // We just need the wallet to sign.
        const message = `Sign this message to log in to Vitini Jirai.\n\nTimestamp: ${Date.now()}`;
        const signature = await wallet.signMessage(message);
        
        const authToken = await authService.generateToken(account, signature, message);
        await userService.getOrCreateUser(authToken, account);

        // We'll set the account, but signer/provider will be null for app wallet
        set({ account, isAuthenticated: true, authToken, isLoading: false, signer: wallet, provider: null });
        
        // Audit log integration
        auditLogService.logSecurityEvent(account, 'login', 'info', { method: 'mnemonic' });

    } catch (err: any) {
        console.error("Mnemonic login failed:", err);
        set({ error: err.message || "Failed to log in with mnemonic.", isLoading: false });
    }
  },

  logout: () => {
    const { account } = get();
    if(account) {
        // Audit log integration
        auditLogService.logSecurityEvent(account, 'logout', 'info');
    }
    set(initialState);
  },
}));
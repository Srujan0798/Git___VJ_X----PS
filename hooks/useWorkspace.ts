import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useWeb3Store } from './useWeb3';
import { useViewStore } from '../store/useViewStore';
import { IPFSService } from '../services/ipfsService';
import { EncryptionService } from '../services/encryptionService';
import { blockchainService } from '../services/blockchainService';
import { workspaceService } from '../services/workspaceService';
import { templateService } from '../services/templateService';
import { analyticsService } from '../services/analyticsService';
import { auditLogService } from '../services/auditLogService';

// Initialize services
const ipfs = new IPFSService();

export const useWorkspace = () => {
    const { nodes, edges, setWorkspace, clearWorkspace, triggerFitView } = useStore(state => ({
        nodes: state.nodes,
        edges: state.edges,
        setWorkspace: state.setWorkspace,
        clearWorkspace: state.clearWorkspace,
        triggerFitView: state.triggerFitView
    }));
    const { account, signer, authToken } = useWeb3Store(state => ({
        account: state.account,
        signer: state.signer,
        authToken: state.authToken
    }));
    const { navigateToWorkspace } = useViewStore();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [status, setStatus] = useState<'success' | 'error' | null>(null);

    const _getEncryptionKey = async (): Promise<string> => {
        if (!account || !signer) throw new Error("Wallet not connected.");
        const signatureMessage = "Provide signature to access your encrypted workspace key.";
        const signature = await signer.signMessage(signatureMessage);
        return EncryptionService.generateKey(account, signature);
    };

    const saveWorkspace = async () => {
        if (!account || !authToken) {
            setMessage("You must be logged in to save.");
            setStatus('error');
            return;
        }

        setIsLoading(true);
        setMessage("Saving workspace...");
        setStatus(null);

        try {
            // NOTE: Encryption is disabled for now as in-app wallet doesn't have a full provider/signer context
            // const encryptionKey = await _getEncryptionKey();
            const workspaceData = { nodes, edges };
            // const encryptedData = EncryptionService.encrypt(workspaceData, encryptionKey);
            const stringifiedData = JSON.stringify(workspaceData);

            if (!ipfs.isConfigured()) {
                throw new Error("IPFS is not configured. Cannot save workspace.");
            }
            const ipfsHash = await ipfs.upload(stringifiedData);
            setMessage("Data uploaded to IPFS...");

            const blockchainId = await blockchainService.registerWorkspace(account, ipfsHash);
            setMessage("Registering on blockchain...");

            const newWorkspace = await workspaceService.createWorkspace(authToken, {
                name: `My Workspace ${new Date().toLocaleTimeString()}`,
                description: "A saved workspace.",
                blockchain_id: blockchainId,
                ipfs_hash: ipfsHash
            });

            setMessage("Workspace saved successfully!");
            setStatus('success');
            
            // Audit log integration
            auditLogService.logWorkspaceAccess(account, newWorkspace.id, 'save', { blockchainId, ipfsHash });

        } catch (error: any) {
            console.error("Save workspace error:", error);
            setMessage(error.message || "Failed to save workspace.");
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const saveAsTemplate = async () => {
        if (!authToken) {
            setMessage("You must be logged in to save a template.");
            setStatus('error');
            return;
        }
        setIsLoading(true);
        setMessage("Saving as template...");
        setStatus(null);
        try {
            const name = window.prompt("Enter a name for your template:", "My Custom Template");
            if (!name) {
                setIsLoading(false);
                return;
            }
            const description = window.prompt("Enter a short description:", "");
            await templateService.createTemplate(authToken, {
                name,
                description: description || "",
                category: 'Custom',
                structure: { nodes, edges }
            });
            setMessage("Template saved successfully!");
            setStatus('success');
        } catch (error: any) {
             setMessage(error.message || "Failed to save template.");
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    }

    const loadWorkspace = async (blockchainId: string) => {
        if (!account || !authToken) {
            setMessage("You must be logged in to load.");
            setStatus('error');
            return;
        }
        setIsLoading(true);
        setMessage("Loading workspace...");
        setStatus(null);

        try {
            const ipfsHash = await blockchainService.getWorkspaceURI(blockchainId);
            setMessage("Fetching data from IPFS...");

            const stringifiedData = await ipfs.download(ipfsHash);
            
            // NOTE: Decryption disabled for now.
            // const encryptionKey = await _getEncryptionKey();
            // const workspaceData = EncryptionService.decrypt(encryptedData, encryptionKey);
            const workspaceData = JSON.parse(stringifiedData);

            setWorkspace(workspaceData.nodes, workspaceData.edges);
            navigateToWorkspace(blockchainId);
            
            setTimeout(() => triggerFitView(), 100);

            setMessage("Workspace loaded.");
            setStatus('success');
            
            // Audit log integration
            const workspaceDetails = await workspaceService.getWorkspace(authToken, blockchainId);
            auditLogService.logWorkspaceAccess(account, workspaceDetails.id, 'load', { blockchainId, ipfsHash });

        } catch (error: any) {
            console.error("Load workspace error:", error);
            setMessage(error.message || "Failed to load workspace.");
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const createAndOpenWorkspace = () => {
        clearWorkspace();
        navigateToWorkspace(null);
        analyticsService.trackWorkspaceCreated('new-workspace', 0);
    };

    return {
        saveWorkspace,
        saveAsTemplate,
        loadWorkspace,
        createAndOpenWorkspace,
        isLoading,
        message,
        status,
    };
};
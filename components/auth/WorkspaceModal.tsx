import React, { useState, useEffect, useCallback } from 'react';
import { workspaceService, Workspace, Permission } from '../../services/workspaceService';
import { useWeb3Store } from '../../hooks/useWeb3';
import { useWorkspace } from '../../hooks/useWorkspace';
import { ShareIcon } from '../icons/Icons';

const WorkspaceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { authToken, account } = useWeb3Store(state => ({ authToken: state.authToken, account: state.account }));
    const { loadWorkspace, isLoading: isWorkspaceActionLoading } = useWorkspace();
    
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [shareView, setShareView] = useState<Workspace | null>(null);
    const [shareAddress, setShareAddress] = useState('');
    const [sharePermission, setSharePermission] = useState<Permission>('view');
    const [shareMessage, setShareMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchWorkspaces = useCallback(async () => {
        if (!authToken) return;
        setIsLoading(true);
        setError(null);
        try {
            const fetchedWorkspaces = await workspaceService.listWorkspaces(authToken);
            setWorkspaces(fetchedWorkspaces);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch workspaces.');
        } finally {
            setIsLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchWorkspaces();
    }, [fetchWorkspaces]);
    
    const handleLoad = async (blockchainId: string) => {
        await loadWorkspace(blockchainId);
        onClose();
    };

    const handleShare = async () => {
        if (!authToken || !shareView || !shareAddress) return;
        setIsLoading(true);
        setShareMessage(null);
        try {
            await workspaceService.shareWorkspace(authToken, shareView.id, { address: shareAddress, permission: sharePermission });
            setShareMessage({ type: 'success', text: 'Workspace shared successfully!' });
            setShareAddress('');
            setTimeout(() => {
                setShareView(null);
                setShareMessage(null);
            }, 2000);
        } catch (err: any) {
             setShareMessage({ type: 'error', text: err.message || 'Failed to share.' });
        } finally {
            setIsLoading(false);
        }
    };

    const renderShareView = () => (
        <div>
            <button onClick={() => setShareView(null)} className="text-sm text-slate-400 hover:text-sky-400 mb-4">&larr; Back to list</button>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Share "{shareView?.name}"</h3>
            <p className="text-slate-400 text-sm mb-4">Enter the wallet address and select the permission level.</p>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={shareAddress}
                    onChange={(e) => setShareAddress(e.target.value)}
                    placeholder="0x..."
                    className="flex-grow p-2 bg-slate-700 rounded-md text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <select 
                    value={sharePermission} 
                    onChange={(e) => setSharePermission(e.target.value as Permission)}
                    className="p-2 bg-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                    <option value="view">Can View</option>
                    <option value="edit">Can Edit</option>
                </select>
            </div>
            {shareMessage && <p className={`text-sm mt-2 ${shareMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{shareMessage.text}</p>}
            <button
                onClick={handleShare}
                disabled={isLoading}
                className="w-full mt-4 px-4 py-2 text-sm font-semibold bg-sky-600/80 rounded-lg text-sky-100 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Sharing...' : 'Share Workspace'}
            </button>
        </div>
    );

    const renderListView = () => (
        <div>
            <h2 className="text-xl font-bold text-slate-200 mb-4">My Workspaces</h2>
            {isLoading && <p className="text-slate-400">Loading workspaces...</p>}
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm">{error}</p>}
            {!isLoading && !error && workspaces.length === 0 && (
                <p className="text-slate-500 text-center py-8">You haven't saved any workspaces yet. Click 'Save' to create your first one!</p>
            )}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {workspaces.map(ws => (
                    <div key={ws.id} className="bg-slate-700/50 p-3 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-200">{ws.name}</p>
                            <p className="text-xs text-slate-400">
                                {ws.owner_address.toLowerCase() !== account?.toLowerCase() ? `Shared with you` : `Owner`}
                                <span className="mx-2">|</span>
                                Last updated: {new Date(ws.updated_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                             {ws.owner_address.toLowerCase() === account?.toLowerCase() && (
                                <button onClick={() => setShareView(ws)} title="Share" className="p-1.5 text-slate-300 rounded-md hover:bg-slate-600 transition-colors">
                                    <ShareIcon />
                                </button>
                            )}
                            <button 
                                onClick={() => handleLoad(ws.blockchain_id)}
                                disabled={isWorkspaceActionLoading}
                                className="px-3 py-1 text-sm font-semibold bg-sky-600/80 rounded-lg text-sky-100 hover:bg-sky-600 disabled:opacity-50"
                            >
                                Load
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                {shareView ? renderShareView() : renderListView()}
            </div>
        </div>
    );
};

export default WorkspaceModal;

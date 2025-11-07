import React, { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3Store } from '../../hooks/useWeb3';
import { WalletIcon, KeyIcon, PlusCircleIcon, CopyIcon } from '../icons/Icons';

type AuthMode = 'external' | 'app';
type AppWalletView = 'login' | 'create';

const LoginModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { loginWithExternal, loginWithMnemonic, isLoading, error } = useWeb3Store();
    const [authMode, setAuthMode] = useState<AuthMode>('external');
    const [appWalletView, setAppWalletView] = useState<AppWalletView>('login');
    const [mnemonic, setMnemonic] = useState('');
    const [generatedMnemonic, setGeneratedMnemonic] = useState<string | null>(null);
    const [hasSavedMnemonic, setHasSavedMnemonic] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const handleGenerateMnemonic = () => {
        const newWallet = ethers.Wallet.createRandom();
        setGeneratedMnemonic(newWallet.mnemonic?.phrase || '');
        setHasSavedMnemonic(false);
        setCopySuccess('');
    };

    const handleLoginWithMnemonic = async () => {
        await loginWithMnemonic(mnemonic);
    };
    
    const handleLoginWithGeneratedMnemonic = async () => {
        if (generatedMnemonic) {
            await loginWithMnemonic(generatedMnemonic);
        }
    };
    
    const handleCopyToClipboard = () => {
        if(generatedMnemonic) {
            navigator.clipboard.writeText(generatedMnemonic);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    const renderAppWalletView = () => {
        if (appWalletView === 'create') {
            return (
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Create New App Wallet</h3>
                    {!generatedMnemonic ? (
                         <>
                            <p className="text-slate-400 text-sm mb-4">Generate a secure 12-word recovery phrase to create your wallet.</p>
                            <button onClick={handleGenerateMnemonic} className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold bg-sky-600/80 rounded-lg text-sky-100 hover:bg-sky-600 transition-colors">
                                <PlusCircleIcon />
                                <span className="ml-2">Generate Recovery Phrase</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-amber-400 bg-amber-900/50 p-3 rounded-lg mb-4">
                                <strong>Important:</strong> Write down this phrase and store it in a safe place. We cannot recover it for you.
                            </p>
                            <div className="relative p-4 bg-slate-900 rounded-lg border border-slate-600 text-lg font-mono tracking-wider text-slate-100 text-center select-all">
                                {generatedMnemonic}
                                <button onClick={handleCopyToClipboard} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white">
                                    <CopyIcon />
                                </button>
                            </div>
                             {copySuccess && <p className="text-green-400 text-xs mt-1">{copySuccess}</p>}
                            <div className="flex items-center my-4">
                                <input type="checkbox" id="saved" checked={hasSavedMnemonic} onChange={() => setHasSavedMnemonic(!hasSavedMnemonic)} className="w-4 h-4 text-sky-600 bg-slate-700 border-slate-500 rounded focus:ring-sky-500"/>
                                <label htmlFor="saved" className="ml-2 text-sm text-slate-300">I have saved my recovery phrase securely.</label>
                            </div>
                            <button 
                                onClick={handleLoginWithGeneratedMnemonic}
                                disabled={!hasSavedMnemonic || isLoading}
                                className="w-full px-4 py-2 text-sm font-semibold bg-green-600/80 rounded-lg text-green-100 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Creating Wallet...' : 'Create Wallet & Login'}
                            </button>
                        </>
                    )}
                     <button onClick={() => setAppWalletView('login')} className="text-sm text-slate-400 hover:text-sky-400 mt-4">
                        Already have a phrase? Login instead.
                    </button>
                </div>
            )
        }
        
        return (
            <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Login with App Wallet</h3>
                <p className="text-slate-400 text-sm mb-4">Enter your 12-word recovery phrase to access your wallet.</p>
                <textarea 
                    value={mnemonic}
                    onChange={(e) => setMnemonic(e.target.value)}
                    placeholder="Enter your 12 word recovery phrase here..."
                    rows={3}
                    className="w-full p-2 bg-slate-700 rounded-md text-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
                <button 
                    onClick={handleLoginWithMnemonic}
                    disabled={isLoading}
                    className="w-full mt-4 px-4 py-2 text-sm font-semibold bg-sky-600/80 rounded-lg text-sky-100 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                     {isLoading ? 'Logging In...' : 'Login with Phrase'}
                </button>
                 <button onClick={() => setAppWalletView('create')} className="text-sm text-slate-400 hover:text-sky-400 mt-4">
                    Need a new wallet? Create one.
                </button>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-slate-700">
                    <button 
                        onClick={() => setAuthMode('external')}
                        className={`flex-1 p-4 text-sm font-semibold flex items-center justify-center transition-colors ${authMode === 'external' ? 'bg-slate-700/50 text-sky-400' : 'text-slate-400 hover:bg-slate-700/30'}`}
                    >
                        <WalletIcon />
                        <span className="ml-2">Connect External Wallet</span>
                    </button>
                     <button 
                        onClick={() => setAuthMode('app')}
                        className={`flex-1 p-4 text-sm font-semibold flex items-center justify-center transition-colors ${authMode === 'app' ? 'bg-slate-700/50 text-sky-400' : 'text-slate-400 hover:bg-slate-700/30'}`}
                    >
                         <KeyIcon />
                        <span className="ml-2">Use App Wallet</span>
                    </button>
                </div>

                <div className="p-6">
                    {authMode === 'external' ? (
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-slate-200 mb-2">Connect Your Wallet</h3>
                            <p className="text-slate-400 text-sm mb-6">Connect your existing MetaMask or other Web3 wallet to continue.</p>
                            <button 
                                onClick={loginWithExternal} 
                                disabled={isLoading}
                                className="w-full px-4 py-2 text-sm font-semibold bg-sky-600/80 rounded-lg text-sky-100 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Connecting...' : 'Connect Wallet'}
                            </button>
                        </div>
                    ) : (
                        renderAppWalletView()
                    )}

                    {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm mt-4 text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;

import React, { useState, useCallback, useEffect } from 'react';
import { useWeb3Store } from '../../hooks/useWeb3';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useStore } from '../../store/useStore';
import { UndoIcon, RedoIcon, SettingsIcon, ArrowLeftIcon } from '../icons/Icons';
import LoginModal from '../auth/LoginModal';
import WorkspaceModal from '../auth/WorkspaceModal';
import SettingsModal from '../modals/SettingsModal';
import { useViewStore } from '../../store/useViewStore';

const UserMenu: React.FC<{ address: string; onLogout: () => void; onSettings: () => void }> = ({ address, onLogout, onSettings }) => {
  return (
    <div className="relative flex items-center space-x-2">
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
        <span className="w-2 h-2 rounded-full bg-green-400"></span>
        <span className="text-sm font-mono">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
        <button onClick={onLogout} className="text-xs text-slate-400 hover:text-white">
            (Logout)
        </button>
      </div>
      <button onClick={onSettings} className="p-2 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
        <SettingsIcon />
      </button>
    </div>
  );
};

const Header = () => {
  const {
    logout,
    isAuthenticated,
    account,
    isLoading: isWeb3Loading,
    error: web3Error,
  } = useWeb3Store();
  
  const { navigateToDashboard } = useViewStore();

  const {
    saveWorkspace,
    saveAsTemplate,
    isLoading: isWorkspaceLoading,
    message: workspaceMessage,
    status: workspaceStatus,
  } = useWorkspace();
  
  // STABILITY FIX: Select only boolean values, not the entire history arrays.
  // This prevents the Header from re-rendering on every minor change (like dragging a node),
  // which was the root cause of the application crash.
  const { undo, redo, canUndo, canRedo } = useStore(state => ({
    undo: state.undo,
    redo: state.redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  }));
  
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSaveDropdownOpen, setSaveDropdownOpen] = useState(false);

  useEffect(() => {
    // If login is successful, close the modal
    if (isAuthenticated) {
        setIsLoginModalOpen(false);
    }
  }, [isAuthenticated]);


  useEffect(() => {
    let message: string | null = null;
    if (isWeb3Loading) message = 'Connecting wallet...';
    else if (web3Error) message = `Error: ${web3Error}`;
    else if (isWorkspaceLoading) message = 'Working on workspace...';
    else if (workspaceMessage) message = workspaceMessage;

    setStatusMessage(message);

    if (workspaceMessage && !isWorkspaceLoading) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3000); // Clear message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isWeb3Loading, web3Error, isWorkspaceLoading, workspaceMessage]);


  const handleSave = useCallback(async () => {
    setSaveDropdownOpen(false);
    if (!isAuthenticated || !account) {
      console.error("Cannot save: User is not authenticated.");
      return;
    }
    await saveWorkspace();
  }, [isAuthenticated, account, saveWorkspace]);

  const handleSaveAsTemplate = useCallback(async () => {
    setSaveDropdownOpen(false);
    await saveAsTemplate();
  }, [saveAsTemplate]);
  
  return (
    <>
    <header className="absolute top-0 left-0 w-full h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 z-30 flex items-center justify-between px-4">
      <div className="flex items-center">
         {isAuthenticated && (
            <button onClick={navigateToDashboard} className="flex items-center mr-4 p-2 rounded-lg hover:bg-slate-700/80 transition-colors">
                <ArrowLeftIcon />
                <span className="ml-2 text-sm font-semibold">Dashboard</span>
            </button>
        )}
        <h1 className="text-xl font-bold text-slate-200 cursor-pointer" onClick={navigateToDashboard}>Vitini Jirai</h1>
        <div className="ml-6 text-sm text-slate-400 min-h-[20px]">
          {statusMessage && (
            <span className={`${workspaceStatus === 'error' ? 'text-red-400' : 'text-sky-400'} transition-opacity duration-300`}>
              {statusMessage}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {isAuthenticated && account ? (
          <>
            <div className="flex items-center space-x-1 bg-slate-800/60 rounded-lg p-0.5 mr-2">
                <button 
                    onClick={undo} 
                    disabled={!canUndo} 
                    className="p-1.5 text-slate-300 rounded-md hover:bg-slate-700/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Undo"
                >
                    <UndoIcon />
                </button>
                <button 
                    onClick={redo} 
                    disabled={!canRedo} 
                    className="p-1.5 text-slate-300 rounded-md hover:bg-slate-700/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Redo"
                >
                    <RedoIcon />
                </button>
            </div>
            <button onClick={() => setIsWorkspaceModalOpen(true)} disabled={isWorkspaceLoading} className="px-3 py-1.5 text-sm font-semibold bg-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed">
              Load
            </button>
            <div className="relative">
                <button onClick={() => setSaveDropdownOpen(!isSaveDropdownOpen)} disabled={isWorkspaceLoading} className="px-3 py-1.5 text-sm font-semibold bg-sky-600/50 rounded-lg text-sky-200 hover:bg-sky-600/80 disabled:opacity-50 disabled:cursor-not-allowed">
                  Save
                </button>
                {isSaveDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
                        <button onClick={handleSave} className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">Save Workspace</button>
                        <button onClick={handleSaveAsTemplate} className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">Save as Template</button>
                    </div>
                )}
            </div>

            <UserMenu address={account} onLogout={logout} onSettings={() => setIsSettingsModalOpen(true)} />
          </>
        ) : (
            <button onClick={() => setIsLoginModalOpen(true)} disabled={isWeb3Loading} className="px-3 py-1.5 text-sm font-semibold bg-sky-600/50 rounded-lg text-sky-200 hover:bg-sky-600/80 disabled:opacity-50 disabled:cursor-not-allowed">
              {isWeb3Loading ? 'Connecting...' : 'Login / Signup'}
            </button>
        )}
      </div>
    </header>
    {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    {isWorkspaceModalOpen && <WorkspaceModal onClose={() => setIsWorkspaceModalOpen(false)} />}
    {isSettingsModalOpen && <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />}
    </>
  );
};

export default Header;
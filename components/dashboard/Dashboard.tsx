import React, { useState, useEffect } from 'react';
import { useWeb3Store } from '../../hooks/useWeb3';
import { useWorkspace } from '../../hooks/useWorkspace';
import { workspaceService, Workspace } from '../../services/workspaceService';
import { templateService, Template } from '../../services/templateService';
import { statsService, UserStats } from '../../services/statsService';
import StatCard from './StatCard';
import WorkspaceCard from './WorkspaceCard';
import TemplateCard from './TemplateCard';
import { SettingsIcon } from '../icons/Icons';
import SettingsModal from '../modals/SettingsModal';
import { useViewStore } from '../../store/useViewStore';
import LoginModal from '../auth/LoginModal';

const DashboardHeader: React.FC<{ onNewWorkspace: () => void; onSettings: () => void; onLogin: () => void; }> = ({ onNewWorkspace, onSettings, onLogin }) => {
    const { account, logout, isAuthenticated } = useWeb3Store();

    return (
        <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100">
                            Vitini Jirai Dashboard
                        </h1>
                         {account && <p className="text-sm font-mono text-slate-400">{account}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        {isAuthenticated ? (
                            <>
                                <button onClick={onSettings} className="p-2 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
                                    <SettingsIcon />
                                </button>
                                <button onClick={logout} className="px-3 py-1.5 text-sm font-semibold bg-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700/80">
                                    Logout
                                </button>
                                <button onClick={onNewWorkspace} className="px-4 py-2 text-sm font-semibold bg-sky-600 rounded-lg text-white hover:bg-sky-700 transition-colors">
                                  + New Workspace
                                </button>
                            </>
                        ) : (
                             <button onClick={onLogin} className="px-4 py-2 text-sm font-semibold bg-sky-600 rounded-lg text-white hover:bg-sky-700 transition-colors">
                                Login / Signup
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default function Dashboard() {
    const { authToken, isAuthenticated } = useWeb3Store();
    const { createAndOpenWorkspace } = useWorkspace();
    const { navigateToMarketplace } = useViewStore();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!authToken) {
                setIsLoading(false);
                return;
            };
            setIsLoading(true);
            try {
                const [workspacesRes, templatesRes, statsRes] = await Promise.all([
                    workspaceService.listWorkspaces(authToken),
                    templateService.listTemplates(authToken),
                    statsService.getUserStats(authToken),
                ]);
                setWorkspaces(workspacesRes);
                setTemplates(templatesRes.filter(t => t.is_featured).slice(0, 3));
                setStats(statsRes);
            } catch (error) {
                console.error('Error loading dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, [authToken]);
    
    useEffect(() => {
        if (isAuthenticated) {
            setIsLoginModalOpen(false);
        }
    }, [isAuthenticated]);

    if(isLoading && isAuthenticated) {
        return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-300"></div></div>;
    }

    return (
        <div className="h-screen flex flex-col bg-slate-900 overflow-y-auto">
            <DashboardHeader 
                onNewWorkspace={createAndOpenWorkspace} 
                onSettings={() => setIsSettingsModalOpen(true)}
                onLogin={() => setIsLoginModalOpen(true)}
            />
            <main className="flex-grow">
                {!isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                         <h2 className="text-3xl font-bold text-slate-100 mb-4">Welcome to Vitini Jirai</h2>
                         <p className="text-slate-400 max-w-xl">
                            The decentralized, visual workspace for complex analysis. 
                            Connect data, uncover insights, and collaborate in real-time. 
                            Login to begin.
                        </p>
                    </div>
                ) : (
                <>
                    {stats && (
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Total Workspaces" value={stats.totalWorkspaces.toString()} />
                                <StatCard title="Active Nodes (Est.)" value={stats.activeNodes.toString()} />
                                <StatCard title="Data Sources" value={stats.dataSources.toString()} />
                                <StatCard title="My Templates" value={stats.sharedTemplates.toString()} />
                            </div>
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h2 className="text-xl font-semibold mb-4 text-slate-200">Recent Workspaces</h2>
                        {workspaces.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {workspaces.slice(0,3).map(workspace => (
                                    <WorkspaceCard key={workspace.id} workspace={workspace} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-800/50 rounded-lg">
                                <p className="text-slate-400">No workspaces yet. Click "+ New Workspace" to get started!</p>
                            </div>
                        )}
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-slate-200">Featured Templates</h2>
                            <button onClick={navigateToMarketplace} className="text-sm font-semibold text-sky-400 hover:text-sky-300">View all templates &rarr;</button>
                        </div>
                        {templates.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {templates.map(template => (
                                    <TemplateCard key={template.id} template={template} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-800/50 rounded-lg">
                                <p className="text-slate-400">No featured templates available right now.</p>
                            </div>
                        )}
                    </div>
                </>
                )}
            </main>
            {isSettingsModalOpen && <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />}
            {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
        </div>
    );
}
import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3Store } from '../../hooks/useWeb3';
import { userService, User } from '../../services/userService';
import { dataSourceService, DataSource } from '../../services/dataSourceService';
import { TrashIcon } from '../icons/Icons';

type Tab = 'profile' | 'dataSources';
type DataSourceType = 'postgresql' | 'mysql' | 'api';

const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { authToken } = useWeb3Store(state => ({ authToken: state.authToken, account: state.account }));
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [user, setUser] = useState<User | null>(null);
    const [dataSources, setDataSources] = useState<DataSource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // State for the "Add New Data Source" form
    const [newSourceName, setNewSourceName] = useState('');
    const [newSourceType, setNewSourceType] = useState<DataSourceType>('postgresql');
    const [newSourceConfig, setNewSourceConfig] = useState<any>({});

    const fetchUserData = useCallback(async () => {
        if (!authToken) return;
        setIsLoading(true);
        try {
            const userData = await userService.getUser(authToken);
            setUser(userData);
        } catch (err: any) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [authToken]);
    
    const fetchDataSources = useCallback(async () => {
        if (!authToken) return;
        setIsLoading(true);
        try {
            const sources = await dataSourceService.listDataSources(authToken);
            setDataSources(sources);
        } catch (err: any) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [authToken]);

    useEffect(() => {
        if (activeTab === 'profile') {
            fetchUserData();
        } else if (activeTab === 'dataSources') {
            fetchDataSources();
        }
    }, [activeTab, fetchUserData, fetchDataSources]);

    const handleAddDataSource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authToken || !newSourceName) return;
        setIsLoading(true);
        setError(null);
        try {
            await dataSourceService.createDataSource(authToken, { name: newSourceName, type: newSourceType, config: newSourceConfig });
            setNewSourceName('');
            setNewSourceConfig({});
            fetchDataSources(); // Refresh the list
        } catch (err: any) {
            setError(err.message);
        }
        setIsLoading(false);
    };

    const handleDeleteDataSource = async (id: string) => {
        if (!authToken || !window.confirm("Are you sure you want to delete this data source?")) return;
        setIsLoading(true);
        try {
            await dataSourceService.deleteDataSource(authToken, id);
            fetchDataSources();
        } catch(err: any) {
            setError(err.message);
        }
        setIsLoading(false);
    };

    const renderProfileTab = () => (
        <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-4">User Profile</h3>
            {isLoading && <p>Loading...</p>}
            {user && (
                <div className="space-y-3 text-sm">
                    <p><span className="font-semibold text-slate-400">Wallet Address:</span> <span className="font-mono text-slate-300">{user.wallet_address}</span></p>
                    <p><span className="font-semibold text-slate-400">Subscription Tier:</span> <span className="capitalize px-2 py-0.5 bg-sky-800 text-sky-300 rounded-full text-xs">{user.subscription_tier}</span></p>
                    <p><span className="font-semibold text-slate-400">Member Since:</span> <span className="text-slate-300">{new Date(user.created_at).toLocaleDateString()}</span></p>
                    <p><span className="font-semibold text-slate-400">Last Login:</span> <span className="text-slate-300">{new Date(user.last_login).toLocaleString()}</span></p>
                </div>
            )}
        </div>
    );
    
    const renderDataSourceForm = () => (
        <form onSubmit={handleAddDataSource} className="p-4 bg-slate-900/50 rounded-lg space-y-3">
             <h4 className="font-semibold text-slate-200">Add New Data Source</h4>
             <input type="text" value={newSourceName} onChange={e => setNewSourceName(e.target.value)} placeholder="Source Name (e.g., 'Production DB')" className="w-full p-2 bg-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" required />
             <select value={newSourceType} onChange={e => setNewSourceType(e.target.value as DataSourceType)} className="w-full p-2 bg-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="api">API Endpoint</option>
             </select>
             { (newSourceType === 'postgresql' || newSourceType === 'mysql') && (
                <input type="text" value={newSourceConfig.host || ''} onChange={e => setNewSourceConfig({...newSourceConfig, host: e.target.value})} placeholder="Host (e.g., db.example.com)" className="w-full p-2 bg-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
             )}
              { newSourceType === 'api' && (
                <>
                <input type="text" value={newSourceConfig.url || ''} onChange={e => setNewSourceConfig({...newSourceConfig, url: e.target.value})} placeholder="Base URL (e.g., https://api.example.com)" className="w-full p-2 bg-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                <textarea value={newSourceConfig.headers || ''} onChange={e => setNewSourceConfig({...newSourceConfig, headers: e.target.value})} placeholder='Headers (JSON format) e.g., {"Authorization": "Bearer ..."}' rows={2} className="w-full p-2 bg-slate-700 rounded-md text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
                </>
             )}
             <button type="submit" disabled={isLoading} className="w-full px-4 py-2 text-sm font-semibold bg-sky-600/80 rounded-lg text-sky-100 hover:bg-sky-600 disabled:opacity-50 transition-colors">Add Source</button>
        </form>
    );

    const renderDataSourcesTab = () => (
        <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Saved Data Sources</h3>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                {isLoading && <p>Loading...</p>}
                {!isLoading && dataSources.length === 0 && <p className="text-slate-500 text-center py-4">No data sources saved yet.</p>}
                {dataSources.map(ds => (
                    <div key={ds.id} className="bg-slate-700/50 p-3 rounded-lg flex items-center justify-between text-sm">
                        <div>
                            <p className="font-semibold text-slate-200">{ds.name}</p>
                            <p className="text-xs text-slate-400 capitalize">{ds.type}</p>
                        </div>
                        <button onClick={() => handleDeleteDataSource(ds.id)} className="text-slate-400 hover:text-red-400 transition-colors"><TrashIcon /></button>
                    </div>
                ))}
            </div>
            {renderDataSourceForm()}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-slate-700">
                    <button onClick={() => setActiveTab('profile')} className={`flex-1 p-3 text-sm font-semibold ${activeTab === 'profile' ? 'bg-slate-700/50 text-sky-400' : 'text-slate-400 hover:bg-slate-700/30'}`}>Profile</button>
                    <button onClick={() => setActiveTab('dataSources')} className={`flex-1 p-3 text-sm font-semibold ${activeTab === 'dataSources' ? 'bg-slate-700/50 text-sky-400' : 'text-slate-400 hover:bg-slate-700/30'}`}>Data Sources</button>
                </div>
                <div className="p-6">
                    {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm mb-4">{error}</p>}
                    {activeTab === 'profile' ? renderProfileTab() : renderDataSourcesTab()}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;

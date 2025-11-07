import React, { useState, useEffect, useMemo } from 'react';
import { useWeb3Store } from '../../hooks/useWeb3';
import { templateService, Template } from '../../services/templateService';
import { useViewStore } from '../../store/useViewStore';
import TemplateCard from './TemplateCard';
import { SearchIcon, ArrowLeftIcon } from '../icons/Icons';

const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'Trading & Finance', name: 'Trading & Finance' },
    { id: 'Legal & Investigation', name: 'Legal & Investigation' },
    { id: 'Learning & Education', name: 'Learning & Education' },
];

export default function TemplateMarketplace() {
  const authToken = useWeb3Store(state => state.authToken);
  const { navigateToDashboard } = useViewStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
        if (!authToken) {
            setLoading(false);
            return;
        }
        try {
            const response = await templateService.listTemplates(authToken);
            setTemplates(response);
        } catch (error) {
            console.error('Error loading templates:', error);
        } finally {
            setLoading(false);
        }
    };
    loadTemplates();
  }, [authToken]);

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(lowercasedSearch) ||
        t.description.toLowerCase().includes(lowercasedSearch)
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedCategory, sortBy, templates]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
        <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={navigateToDashboard} className="flex items-center mr-4 p-2 rounded-lg hover:bg-slate-700/80 transition-colors">
                        <ArrowLeftIcon />
                        <span className="ml-2 text-sm font-semibold">Dashboard</span>
                    </button>
                     <div>
                        <h1 className="text-xl font-bold">Template Marketplace</h1>
                        <p className="text-sm text-slate-400">Start your analysis faster with pre-built workspaces</p>
                    </div>
                </div>
            </div>
        </header>

      <main className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-lg p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>

          {filteredAndSortedTemplates.length === 0 && !loading && (
            <div className="text-center py-16 col-span-full">
              <p className="text-slate-500 text-lg">No templates found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

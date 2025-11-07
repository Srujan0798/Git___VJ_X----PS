import React from 'react';
import { Workspace } from '../../services/workspaceService';
import { useWorkspace } from '../../hooks/useWorkspace';

interface WorkspaceCardProps {
  workspace: Workspace;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace }) => {
  const { loadWorkspace, isLoading } = useWorkspace();

  const handleLoad = () => {
    if(!isLoading) {
        loadWorkspace(workspace.blockchain_id);
    }
  }

  return (
    <div 
      onClick={handleLoad}
      className="bg-slate-800/50 rounded-lg shadow-lg hover:shadow-sky-500/10 border border-slate-700/50 hover:border-sky-500 transition-all p-6 cursor-pointer group"
    >
      <h3 className="font-semibold text-lg mb-2 text-slate-200 group-hover:text-sky-400">{workspace.name}</h3>
      <p className="text-sm text-slate-400 mb-4 h-10 overflow-hidden">{workspace.description || "No description."}</p>
      <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-700 pt-3">
        {/* Node count can be added if service provides it */}
        {/* <span>{workspace.nodeCount || 0} nodes</span> */}
        <span>{workspace.owner_address.slice(0,6)}...</span>
        <span>{new Date(workspace.updated_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default WorkspaceCard;

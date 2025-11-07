import React from 'react';
import { NodeProps } from 'reactflow';
import { DatabaseIcon } from '../../icons/Icons';
import { AppNode } from '../../../types';
import { useStore } from '../../../store/useStore';
import { useWeb3Store } from '../../../hooks/useWeb3';
import { auditLogService } from '../../../services/auditLogService';
import NodeWrapper from './NodeWrapper';

const DatabaseNode: React.FC<NodeProps<AppNode['data']>> = ({ id, data }) => {
  const updateNodeData = useStore(state => state.updateNodeData);
  const account = useWeb3Store(state => state.account);

  const onQueryChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { config: { ...data.config, query: evt.target.value } });
  };
  
  const handleExecute = () => {
      // Simulate query execution
      updateNodeData(id, { isLoading: true });
      setTimeout(() => {
          const mockData = [{ id: 1, name: "John Doe", age: 42 }, { id: 2, name: "Jane Smith", age: 35 }];
          updateNodeData(id, { isLoading: false, queryResult: { data: mockData } });
          
          // Audit log integration
          if (account) {
            auditLogService.logDataSourceConnection(account, data.config?.type || 'postgresql', true, { nodeId: id, query: data.config?.query });
          }
      }, 1500);
  }

  return (
    <NodeWrapper id={id} data={data} icon={<DatabaseIcon />} isColorable={true}>
      <div className="w-80">
        <textarea
          defaultValue={data.config?.query}
          onChange={onQueryChange}
          placeholder="SELECT * FROM users;"
          className="w-full h-28 p-2 bg-slate-900 text-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
        />
        <div className="p-2 border-t border-slate-700">
            <button 
                onClick={handleExecute} 
                disabled={data.isLoading}
                className="w-full bg-slate-600/50 text-slate-200 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-slate-600/80 disabled:opacity-50 transition-colors"
            >
                {data.isLoading ? 'Executing...' : 'Execute Query'}
            </button>
        </div>
         {data.queryResult && (
             <div className="p-2 border-t border-slate-700 text-xs font-mono text-slate-300 max-h-40 overflow-auto">
                 {data.queryResult.error ? (
                     <pre className="text-red-400">{data.queryResult.error}</pre>
                 ) : (
                     <pre>{JSON.stringify(data.queryResult.data, null, 2)}</pre>
                 )}
             </div>
         )}
      </div>
    </NodeWrapper>
  );
};

export default React.memo(DatabaseNode);
import React, { useCallback } from 'react';
import { NodeProps } from 'reactflow';
import { ApiIcon } from '../../icons/Icons';
import { AppNode } from '../../../types';
import { useStore } from '../../../store/useStore';
import { useWeb3Store } from '../../../hooks/useWeb3';
import { auditLogService } from '../../../services/auditLogService';
import NodeWrapper from './NodeWrapper';

const ApiNode: React.FC<NodeProps<AppNode['data']>> = ({ id, data }) => {
  const updateNodeData = useStore(state => state.updateNodeData);
  const account = useWeb3Store(state => state.account);

  const onConfigChange = (field: string, value: string) => {
    updateNodeData(id, { config: { ...data.config, [field]: value } });
  };
  
  const handleFetch = useCallback(async () => {
    updateNodeData(id, { isLoading: true, queryResult: undefined });
    try {
        const { url, method, headers, body } = data.config || {};
        if (!url) throw new Error("URL is required.");

        const response = await fetch(url, {
            method: method || 'GET',
            headers: headers ? JSON.parse(headers) : undefined,
            body: (method !== 'GET' && body) ? body : undefined,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        updateNodeData(id, { isLoading: false, queryResult: { data: responseData } });

        // Audit log integration
        if(account) {
            auditLogService.logDataSourceConnection(account, 'api', true, { nodeId: id, url });
        }

    } catch (error: any) {
        console.error("API Node fetch error:", error);
        updateNodeData(id, { isLoading: false, queryResult: { error: error.message } });
        // Audit log for failure
         if(account) {
            auditLogService.logDataSourceConnection(account, 'api', false, { nodeId: id, url: data.config?.url, error: error.message });
        }
    }
  }, [id, data.config, updateNodeData, account]);

  return (
    <NodeWrapper id={id} data={data} icon={<ApiIcon />} isColorable={true}>
      <div className="w-80 space-y-1 p-2">
        <input 
            type="text"
            placeholder="URL"
            defaultValue={data.config?.url}
            onChange={e => onConfigChange('url', e.target.value)}
            className="w-full p-1.5 bg-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
        <div className="flex space-x-1">
            <select 
                defaultValue={data.config?.method || 'GET'}
                onChange={e => onConfigChange('method', e.target.value)}
                className="p-1.5 bg-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
            </select>
             <input 
                type="text"
                placeholder='Headers (JSON)'
                defaultValue={data.config?.headers}
                onChange={e => onConfigChange('headers', e.target.value)}
                className="flex-grow p-1.5 bg-slate-700 rounded-md text-slate-200 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
        </div>
        <textarea
          defaultValue={data.config?.body}
          onChange={e => onConfigChange('body', e.target.value)}
          placeholder="Body (JSON)"
          rows={3}
          className="w-full p-1.5 bg-slate-900 text-slate-200 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 resize-y"
        />
         <div className="pt-1">
            <button 
                onClick={handleFetch} 
                disabled={data.isLoading}
                className="w-full bg-slate-600/50 text-slate-200 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-slate-600/80 disabled:opacity-50 transition-colors"
            >
                {data.isLoading ? 'Fetching...' : 'Fetch Data'}
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

export default React.memo(ApiNode);
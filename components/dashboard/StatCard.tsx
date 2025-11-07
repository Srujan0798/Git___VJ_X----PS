import React from 'react';
import { ChartBarIcon, LinkIcon, ServerStackIcon, DocumentDuplicateIcon } from '../icons/Icons';

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    
    const getIcon = () => {
        if (title.toLowerCase().includes('workspaces')) return <ChartBarIcon />;
        if (title.toLowerCase().includes('nodes')) return <LinkIcon />;
        if (title.toLowerCase().includes('data')) return <ServerStackIcon />;
        if (title.toLowerCase().includes('templates')) return <DocumentDuplicateIcon />;
        return <ChartBarIcon/>
    };

  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-3xl font-bold mt-2 text-slate-100">{value}</p>
          {/* Trend can be added back if stats service provides it */}
          {/* <p className="text-sm text-green-500 mt-1">{trend}</p> */}
        </div>
        <div className="text-4xl text-sky-500 opacity-30">
            {getIcon()}
        </div>
      </div>
    </div>
  );
}

export default StatCard;

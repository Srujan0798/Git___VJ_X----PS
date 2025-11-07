import React from 'react';
import { NodeProps } from 'reactflow';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChartIcon } from '../../icons/Icons';
import { AppNode } from '../../../types';
import NodeWrapper from './NodeWrapper';

const ChartNode: React.FC<NodeProps<AppNode['data']>> = ({ id, data }) => {
  return (
    <NodeWrapper id={id} data={data} icon={<BarChartIcon />}>
        <div className="w-80 h-48 p-3 text-xs text-slate-300">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                    <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </NodeWrapper>
  );
};

export default React.memo(ChartNode);

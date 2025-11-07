import React, { useState, useEffect } from 'react';
import { NodeProps } from 'reactflow';
import { TvIcon } from '../../icons/Icons';
import { AppNode } from '../../../types';
import NodeWrapper from './NodeWrapper';

interface Trade {
  price: string;
  time: string;
  quantity: string;
  isUp: boolean;
}

const LiveFeedNode: React.FC<NodeProps<AppNode['data']>> = ({ id, data }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [feedData, setFeedData] = useState<Trade[]>([]);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.onopen = () => setStatus('connected');
    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      setFeedData(prev => {
        const newTrade: Trade = {
          price: parseFloat(trade.p).toFixed(2),
          time: new Date(trade.T).toLocaleTimeString(),
          quantity: parseFloat(trade.q).toFixed(5),
          isUp: prev.length > 0 ? parseFloat(trade.p) >= parseFloat(prev[0].price) : true,
        };
        return [newTrade, ...prev.slice(0, 9)];
      });
    };
    ws.onerror = () => setStatus('error');
    ws.onclose = () => setStatus('connecting');
    return () => ws.close();
  }, []);

  const getStatusIndicator = () => {
    const pulse = status === 'connected';
    const dotColor = {
        connected: 'bg-emerald-500',
        connecting: 'bg-slate-500',
        error: 'bg-red-500',
    }[status];

    return (
         <span className="absolute top-2.5 right-2.5 flex h-3 w-3">
            {pulse && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColor}`}></span>
        </span>
    );
  };

  return (
    <NodeWrapper id={id} data={{ ...data, title: data.title || 'Live Feed' }} icon={<TvIcon />}>
       <div className="relative w-72">
        {getStatusIndicator()}
        <div className="p-2 text-xs text-slate-300 h-48 overflow-y-auto font-mono flex flex-col-reverse">
            {feedData.length > 0 ? feedData.map((item, idx) => (
            <div key={idx} className={`p-1 border-b border-slate-700/50 flex justify-between items-baseline ${item.isUp ? 'text-green-400' : 'text-red-400'}`}>
                <span>${item.price}</span>
                <span className="text-slate-400 text-[10px]">{item.quantity} BTC</span>
                <span className="text-slate-500 text-[10px]">{item.time}</span>
            </div>
            )) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                    {status === 'connecting' ? 'Connecting to feed...' : 'Awaiting data...'}
                </div>
            )}
        </div>
       </div>
    </NodeWrapper>
  );
};

export default React.memo(LiveFeedNode);

import React, { useCallback, useState } from 'react';
import { useReactFlow, useEdges, NodeProps } from 'reactflow';
import { SparklesIcon } from '../../icons/Icons';
import { AppNodeData } from '../../../types';
import { generateInsight } from '../../../services/geminiService';
import { useStore } from '../../../store/useStore';
import NodeWrapper from './NodeWrapper';

const ChevronIcon: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {isExpanded ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        )}
    </svg>
);


const AIAnalysisNode: React.FC<NodeProps<AppNodeData>> = ({ id, data }) => {
    const { getNodes } = useReactFlow();
    const edges = useEdges();
    const updateNodeData = useStore(state => state.updateNodeData);
    const [isExpanded, setIsExpanded] = useState(true);

    const handleGenerateInsight = useCallback(async () => {
        if (!isExpanded) setIsExpanded(true);
        updateNodeData(id, { isLoading: true, insight: 'Generating insight...' });

        const parentEdges = edges.filter(edge => edge.target === id);
        const parentNodeIds = parentEdges.map(edge => edge.source);
        const parentNodes = getNodes().filter(node => parentNodeIds.includes(node.id));

        if (parentNodes.length === 0) {
            updateNodeData(id, { isLoading: false, insight: 'Please connect at least one node as input.' });
            return;
        }

        const inputText = parentNodes.map(node => {
            const nodeData = node.data as AppNodeData;
            const nodeType = node.type?.replace('Node', '') || 'Data';
            return `[${nodeType}: ${nodeData.title || 'Untitled'}]\n${nodeData.text || JSON.stringify(node.data) || 'No content'}`;
        }).join('\n\n');

        const result = await generateInsight(inputText);
        updateNodeData(id, { isLoading: false, insight: result });

    }, [id, edges, getNodes, updateNodeData, isExpanded]);

    const headerControls = (
        <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-600 hover:text-white transition-colors"
            aria-label={isExpanded ? "Collapse insight" : "Expand insight"}
            aria-expanded={isExpanded}
        >
            <ChevronIcon isExpanded={isExpanded} />
        </button>
    );

    return (
        <NodeWrapper id={id} data={data} icon={<SparklesIcon />} headerControls={headerControls}>
            <div className="w-72">
                {isExpanded && (
                    <div className="p-3 text-sm text-slate-300 min-h-[80px]">
                        {data.isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-300"></div>
                                <span className="ml-3">Analyzing...</span>
                            </div>
                        ) : (
                            <p className="whitespace-pre-wrap">{data.insight}</p>
                        )}
                    </div>
                )}
                <div className="p-2 border-t border-slate-700">
                    <button 
                        onClick={handleGenerateInsight} 
                        disabled={data.isLoading}
                        className="w-full bg-slate-600/50 text-slate-200 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-slate-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Generate Insight
                    </button>
                </div>
            </div>
        </NodeWrapper>
    );
};

export default React.memo(AIAnalysisNode);

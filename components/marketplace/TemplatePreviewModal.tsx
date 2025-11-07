import React from 'react';
import { Template } from '../../services/templateService';
import { NodeType } from '../../types';
import { DatabaseIcon, TvIcon, BarChartIcon, StickyNoteIcon, SparklesIcon, ApiIcon } from '../icons/Icons';

const NodeIcon: React.FC<{ type: NodeType }> = ({ type }) => {
    switch (type) {
        case NodeType.Database: return <DatabaseIcon />;
        case NodeType.LiveFeed: return <TvIcon />;
        case NodeType.Chart: return <BarChartIcon />;
        case NodeType.Note: return <StickyNoteIcon />;
        case NodeType.AIAnalysis: return <SparklesIcon />;
        case NodeType.Api: return <ApiIcon />;
        default: return null;
    }
};

const TemplatePreviewModal: React.FC<{ template: Template; onClose: () => void; onUse: (id: string) => void }> = ({ template, onClose, onUse }) => {
    
    // Fix: Correctly summarize node types from the template structure.
    const nodeSummary = template.structure.nodes.reduce((acc, node) => {
        const type = node.type;
        if (type) {
            acc[type] = (acc[type] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-100">{template.name}</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">{'×'}</button>
                    </div>
                     <p className="text-xs text-slate-400 mt-1">Category: {template.category}</p>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="bg-slate-900/50 rounded-lg p-4 h-64 flex items-center justify-center mb-6 border border-slate-700">
                        <div className="text-center">
                            <h4 className="font-semibold text-slate-200 mb-2">Structure Preview</h4>
                            <ul className="text-slate-400 text-sm space-y-1">
                               {/* Fix: Correctly map over summarized nodes and generate a user-friendly name. */}
                               {Object.entries(nodeSummary).map(([type, count]) => {
                                   const typeName = type.replace(/Node$/i, '').replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
                                   return (
                                       <li key={type} className="flex items-center justify-center">
                                           <NodeIcon type={type as NodeType} />
                                           {/* FIX: Explicitly cast variables to string to prevent 'unknown' type error. */}
                                           <span className="ml-2">{String(count)}x {String(typeName)} Node</span>
                                       </li>
                                   )
                               })}
                                <li className="flex items-center justify-center text-xs mt-2 text-slate-500">
                                    ({template.edge_count} connections)
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-2 text-slate-200">Description</h3>
                        <p className="text-slate-300">{template.description}</p>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-xl mt-auto">
                    <div className="flex gap-4">
                        <button
                            onClick={() => onUse(template.id)}
                            className="flex-1 bg-sky-600 text-white py-2.5 rounded-lg hover:bg-sky-700 transition-colors font-medium"
                        >
                            Use This Template
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatePreviewModal;
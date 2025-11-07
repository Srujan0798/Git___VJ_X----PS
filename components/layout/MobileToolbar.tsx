
import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { useStore } from '../../store/useStore';
import { NodeType, AppNode } from '../../types';
import {
  PlusCircleIcon,
  UndoIcon,
  RedoIcon,
  FitViewIcon,
  DatabaseIcon,
  TvIcon,
  BarChartIcon,
  StickyNoteIcon,
  SparklesIcon,
  ApiIcon,
  HomeIcon
} from '../icons/Icons';
import { useViewStore } from '../../store/useViewStore';

const nodeTypesToAdd = [
    { type: NodeType.Database, label: 'Database', icon: <DatabaseIcon /> },
    { type: NodeType.LiveFeed, label: 'Live Feed', icon: <TvIcon /> },
    { type: NodeType.Chart, label: 'Chart', icon: <BarChartIcon /> },
    { type: NodeType.Note, label: 'Note', icon: <StickyNoteIcon /> },
    { type: NodeType.AIAnalysis, label: 'AI Analysis', icon: <SparklesIcon /> },
    { type: NodeType.Api, label: 'API Connector', icon: <ApiIcon /> },
];

const MobileToolbar = () => {
  const { getNextNodeId, addNode, undo, redo, canUndo, canRedo } = useStore(state => ({
    getNextNodeId: state.getNextNodeId,
    addNode: state.addNode,
    undo: state.undo,
    redo: state.redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  }));
  const { fitView, project } = useReactFlow();
  const { navigateToDashboard } = useViewStore();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const handleAddNode = (type: NodeType) => {
    const newNodeId = getNextNodeId();
    // Position the new node in the center of the current view
    const position = project({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
    
    let newNodeData: AppNode['data'] = { title: `New ${type.replace('Node', '')}` };
     switch (type) {
        case NodeType.Note:
          newNodeData = { title: 'New Note', text: 'Start writing here...' };
          break;
        case NodeType.AIAnalysis:
          newNodeData = { title: 'AI Analysis', insight: 'Connect nodes and click Generate.', isLoading: false };
          break;
      }

    const newNode: AppNode = {
      id: newNodeId,
      type,
      position,
      data: newNodeData,
    };

    addNode(newNode);
    setIsAddMenuOpen(false);
  };

  return (
    <>
      {isAddMenuOpen && (
        <div 
          className="absolute inset-0 bg-black/50 z-30" 
          onClick={() => setIsAddMenuOpen(false)}
        >
          <div 
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3 text-center text-slate-200">Add Node</h3>
            <div className="grid grid-cols-2 gap-3">
              {nodeTypesToAdd.map(node => (
                <button
                  key={node.type}
                  onClick={() => handleAddNode(node.type)}
                  className="flex items-center p-3 bg-slate-700/50 rounded-lg hover:bg-sky-500/30 hover:ring-2 hover:ring-sky-500 transition-all"
                >
                  {node.icon}
                  <span className="ml-2 font-medium">{node.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md h-14 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-full shadow-2xl z-40 flex items-center justify-around px-2">
        <button onClick={navigateToDashboard} className="p-2 text-slate-300 rounded-full hover:bg-slate-700">
            <HomeIcon />
        </button>
        <button onClick={undo} disabled={!canUndo} className="p-2 text-slate-300 rounded-full hover:bg-slate-700 disabled:opacity-30">
          <UndoIcon />
        </button>
        <button
          onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
          className="p-3 bg-sky-600 text-white rounded-full hover:bg-sky-500 transition-transform hover:scale-110 shadow-lg"
        >
          <PlusCircleIcon />
        </button>
        <button onClick={redo} disabled={!canRedo} className="p-2 text-slate-300 rounded-full hover:bg-slate-700 disabled:opacity-30">
          <RedoIcon />
        </button>
        <button onClick={() => fitView({ duration: 300 })} className="p-2 text-slate-300 rounded-full hover:bg-slate-700">
          <FitViewIcon />
        </button>
      </div>
    </>
  );
};

export default MobileToolbar;

import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Background,
  useReactFlow,
} from 'reactflow';

import DatabaseNode from './nodes/DatabaseNode';
import LiveFeedNode from './nodes/LiveFeedNode';
import ChartNode from './nodes/ChartNode';
import NoteNode from './nodes/NoteNode';
import AIAnalysisNode from './nodes/AIAnalysisNode';
import ApiNode from './nodes/ApiNode';
import CustomEdge from './edges/CustomEdge';

import { NodeType, AppNode } from '../../types';
import { useStore } from '../../store/useStore';
import { useIsMobile } from '../../hooks/useIsMobile';

const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  getNextNodeId: state.getNextNodeId,
  fitViewTrigger: state.fitViewTrigger,
});

const Workspace = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, getNextNodeId, fitViewTrigger } = useStore(selector);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const isMobile = useIsMobile();

  const nodeTypes = useMemo(() => ({
    [NodeType.Database]: DatabaseNode,
    [NodeType.LiveFeed]: LiveFeedNode,
    [NodeType.Chart]: ChartNode,
    [NodeType.Note]: NoteNode,
    [NodeType.AIAnalysis]: AIAnalysisNode,
    [NodeType.Api]: ApiNode,
  }), []);

  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);

  useEffect(() => {
    if (fitViewTrigger > 0) {
      fitView({ duration: 400 });
    }
  }, [fitViewTrigger, fitView]);
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNodeId = getNextNodeId();
      let newNodeData: AppNode['data'];

      switch (type) {
        case NodeType.Note:
          newNodeData = { title: 'New Note', text: 'Start writing here...' };
          break;
        case NodeType.Database:
          newNodeData = {
            title: 'Database Connection',
            config: {
              type: 'postgresql',
              host: 'db.example.com',
              port: '5432',
              database: 'cbi_cases',
              query: 'SELECT * FROM witnesses\nWHERE case_id = 734\nLIMIT 10;'
            }
          };
          break;
        case NodeType.Chart:
          newNodeData = {
            title: 'New Chart',
            chartData: [
              { name: 'Jan', value: 400 },
              { name: 'Feb', value: 300 },
              { name: 'Mar', value: 600 },
              { name: 'Apr', value: 800 },
            ],
          };
          break;
        case NodeType.AIAnalysis:
          newNodeData = {
            title: 'AI Analysis',
            insight: 'Connect nodes and click Generate.',
            isLoading: false,
          };
          break;
        case NodeType.Api:
          newNodeData = { 
            title: 'API Connector',
            text: 'Configure and fetch data.',
            config: {
              url: 'https://jsonplaceholder.typicode.com/todos/1',
              method: 'GET',
              headers: '{}',
              body: '{}'
            }
          };
          break;
        default:
          newNodeData = { title: `New ${type.replace('Node', '')}` };
      }
      
      const newNode: AppNode = {
        id: newNodeId,
        type,
        position,
        data: newNodeData,
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode, getNextNodeId]
  );

  return (
    <div className="w-full h-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: isMobile ? 0.25 : 0.1 }}
        className="bg-slate-900"
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={false}
      >
        <Background color="#475569" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default Workspace;

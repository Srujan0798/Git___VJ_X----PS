import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { AppNode, AppEdge, NodeType } from '../types';
import { socketService } from '../services/socketService';
import { analyticsService } from '../services/analyticsService';

type HistoryState = { nodes: AppNode[]; edges: AppEdge[] };

export type RFState = {
  nodes: AppNode[];
  edges: AppEdge[];
  _nodeIdCounter: number;
  getNextNodeId: () => string;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: AppNode) => void;
  updateNodeData: (nodeId: string, data: object) => void;
  setWorkspace: (nodes: AppNode[], edges: AppEdge[]) => void;
  clearWorkspace: () => void;
  fitViewTrigger: number;
  triggerFitView: () => void;
  // Actions for applying remote changes without re-emitting
  applyRemoteNodeChanges: (changes: NodeChange[]) => void;
  applyRemoteEdgeChanges: (changes: EdgeChange[]) => void;
  // Undo/Redo state and actions
  past: HistoryState[];
  future: HistoryState[];
  undo: () => void;
  redo: () => void;
};

// FIX: Export initialNodes so it can be used for mock data initialization in ipfsService.
export const initialNodes: AppNode[] = [
  {
    id: '1',
    type: NodeType.Database,
    position: { x: 50, y: 50 },
    data: { title: 'CBI Case File #734', colorTheme: 'sky' },
  },
  {
    id: '2',
    type: NodeType.Note,
    position: { x: 450, y: 50 },
    data: { title: 'Initial Hypothesis', text: 'Suspect may have ties to offshore accounts.', colorTheme: 'amber' },
  },
  {
    id: '3',
    type: NodeType.LiveFeed,
    position: { x: 50, y: 300 },
    data: { title: 'Crypto Market Feed (BTC)', colorTheme: 'green' },
  },
];

// FIX: Export initialEdges so it can be used for mock data initialization in ipfsService.
export const initialEdges: AppEdge[] = [
    { 
      id: 'e1-2', 
      source: '1', 
      target: '2', 
      type: 'custom', // Use the custom edge
      data: { 
        importance: 'critical', 
        animated: true, 
        lineType: 'dashed',
        label: 'Primary Evidence' 
      } 
    }
];


export const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  fitViewTrigger: 0,
  past: [],
  future: [],
  _nodeIdCounter: initialNodes.length,

  getNextNodeId: () => {
    const nextId = get()._nodeIdCounter + 1;
    set({ _nodeIdCounter: nextId });
    return `node-${nextId}`;
  },

  onNodesChange: (changes: NodeChange[]) => {
    const isDragging = changes.some(c => c.type === 'position' && c.dragging);
    if (isDragging) {
      set({ nodes: applyNodeChanges(changes, get().nodes) });
      socketService.emitNodeUpdate({ workspaceId: 'main-workspace', changes });
      return;
    }
    
    set(state => {
      const nextNodes = applyNodeChanges(changes, state.nodes);
      return {
        past: [...state.past, { nodes: state.nodes, edges: state.edges }],
        nodes: nextNodes,
        future: [],
      }
    });
    socketService.emitNodeUpdate({ workspaceId: 'main-workspace', changes });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set(state => ({
      past: [...state.past, { nodes: state.nodes, edges: state.edges }],
      edges: applyEdgeChanges(changes, state.edges),
      future: [],
    }));
    socketService.emitEdgeUpdate({ workspaceId: 'main-workspace', changes });
  },

  onConnect: (connection: Connection) => {
    const newEdge = {
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      ...connection,
      type: 'custom',
      data: { importance: 'normal' }
    };
    set(state => ({
      past: [...state.past, { nodes: state.nodes, edges: state.edges }],
      edges: addEdge(newEdge, state.edges),
      future: [],
    }));

    const sourceNode = get().nodes.find(n => n.id === connection.source);
    const targetNode = get().nodes.find(n => n.id === connection.target);
    analyticsService.trackConnectionMade(sourceNode?.type, targetNode?.type, 'main-workspace');

    socketService.emitEdgeUpdate({ workspaceId: 'main-workspace', changes: [{ item: newEdge, type: 'add'}] });
  },

  addNode: (node: AppNode) => {
    set(state => ({
      past: [...state.past, { nodes: state.nodes, edges: state.edges }],
      nodes: [...state.nodes, node],
      future: [],
    }));
    analyticsService.trackNodeAdded(node.type, 'main-workspace');
    socketService.emitNodeUpdate({ workspaceId: 'main-workspace', changes: [{ item: node, type: 'add'}] });
  },

  updateNodeData: (nodeId: string, data: object) => {
    set(state => ({
      past: [...state.past, { nodes: state.nodes, edges: state.edges }],
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
      future: [],
    }));
    
    // Get the updated node *after* the state has been set to ensure freshness
    const updatedNode = get().nodes.find(n => n.id === nodeId);
    if (updatedNode) {
      socketService.emitNodeUpdate({ workspaceId: 'main-workspace', changes: [{ type: 'reset', item: updatedNode }] });
    }
  },

  setWorkspace: (nodes: AppNode[], edges: AppEdge[]) => {
    set({ nodes, edges, past: [], future: [], _nodeIdCounter: nodes.length });
  },

  clearWorkspace: () => {
    set({ nodes: [], edges: [], past: [], future: [] });
  },

  triggerFitView: () => {
    set((state) => ({ fitViewTrigger: state.fitViewTrigger + 1 }));
  },

  applyRemoteNodeChanges: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  applyRemoteEdgeChanges: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  undo: () => {
    const { past, nodes, edges } = get();
    if (past.length === 0) return;

    const previousState = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    set({
      past: newPast,
      future: [{ nodes, edges }, ...get().future],
      nodes: previousState.nodes,
      edges: previousState.edges,
    });
  },

  redo: () => {
    const { future, nodes, edges } = get();
    if (future.length === 0) return;
    
    const nextState = future[0];
    const newFuture = future.slice(1);
    
    set({
      past: [...get().past, { nodes, edges }],
      future: newFuture,
      nodes: nextState.nodes,
      edges: nextState.edges,
    });
  },
}));
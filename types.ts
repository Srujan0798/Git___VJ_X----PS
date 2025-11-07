import { Node, Edge, NodeChange, EdgeChange } from 'reactflow';

export enum NodeType {
  Database = 'databaseNode',
  LiveFeed = 'liveFeedNode',
  Chart = 'chartNode',
  Note = 'noteNode',
  AIAnalysis = 'aiAnalysisNode',
  Api = 'apiNode',
}

export interface NodeStyle {
  color?: string;
  width?: number;
  height?: number;
  opacity?: number;
}

export interface NodeSecurity {
  encryption?: boolean;
  accessControl?: 'owner-only' | 'shared' | 'public';
}

// Base interface for all node data, as per the Phase 2 data model
export interface AppNodeData {
  title: string;
  config?: Record<string, any>;
  source?: string;
  lastUpdated?: string;
  isLive?: boolean;
  style?: NodeStyle;
  security?: NodeSecurity;

  // Specific data properties for different node types
  text?: string;
  chartData?: { name: string; value: number }[];
  insight?: string;
  isLoading?: boolean;
  colorTheme?: 'pink' | 'sky' | 'green' | 'amber' | 'violet';
  queryResult?: { data?: any; error?: string };
}

// A fully typed application node
export type AppNode = Node<AppNodeData>;

// --- Thread (Edge) System ---
export interface ThreadLogic {
  filter?: string; // "conditional-expression"
  transform?: string; // "transformation-function"
}

export interface ThreadData {
  type?: 'data-flow' | 'reference' | 'dependency';
  logic?: ThreadLogic;
  label?: string;
  importance?: 'normal' | 'high' | 'critical' | 'low';
  animated?: boolean;
  lineType?: 'solid' | 'dotted' | 'dashed';
}

// A fully typed application edge/thread
export type AppEdge = Edge<ThreadData>;

// --- Real-time Collaboration Payloads ---
export interface NodeUpdatePayload {
  workspaceId: string;
  changes: NodeChange[];
}

export interface EdgeUpdatePayload {
  workspaceId: string;
  changes: EdgeChange[];
}
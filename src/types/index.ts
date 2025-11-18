import { Node, Edge } from 'reactflow';

// Node status states
export type NodeStatus = 'idle' | 'loading' | 'done' | 'error';

// Node types
export enum NodeType {
  TEXT_SOURCE = 'textSource',
  QUESTION = 'question',
  ANSWER = 'answer',
  SUMMARY = 'summary',
  PITCH = 'pitch',
  IMAGES = 'images',
}

// Base node data interface
export interface BaseNodeData {
  label: string;
  status: NodeStatus;
  errorMessage?: string;
}

// Text Source Node Data
export interface TextSourceNodeData extends BaseNodeData {
  text: string;
}

// Question Node Data
export interface QuestionNodeData extends BaseNodeData {
  question: string;
}

// Answer Node Data
export interface AnswerNodeData extends BaseNodeData {
  answer: string;
  questionId?: string;
}

// Summary Node Data
export interface SummaryNodeData extends BaseNodeData {
  summary: string;
  bulletCount: number; // Number of key points to generate
}

// Pitch Node Data
export interface PitchNodeData extends BaseNodeData {
  pitch: string;
  pitchType: 'short' | 'detailed'; // short = 1 min, detailed = 3 min
}

// Images Node Data
export interface ImagesNodeData extends BaseNodeData {
  prompt: string;
  imageCount: number; // Number of images to generate (1-6)
  imageUrls: string[];
}

// Union type for all node data types
export type CustomNodeData =
  | TextSourceNodeData
  | QuestionNodeData
  | AnswerNodeData
  | SummaryNodeData
  | PitchNodeData
  | ImagesNodeData;

// Custom Node type with proper typing
export type CustomNode = Node<CustomNodeData>;

// Custom Edge type
export type CustomEdge = Edge;

// Board (Canvas workspace)
export interface Board {
  id: string;
  name: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
  createdAt: string;
  updatedAt: string;
}

// Configuration
export interface AppConfig {
  apiKey: string;
  textModel: string;
  imageModel: string;
  temperature: number;
  maxTokens?: number;
  apiBaseUrl: string;
}

// Available models
export interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

// API Request/Response types
export interface TextGenerationRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface TextGenerationResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export interface ImageGenerationRequest {
  model: string;
  prompt: string;
  n: number; // number of images
}

export interface ImageGenerationResponse {
  data: Array<{
    url: string;
  }>;
}

// Store state type
export interface StoreState {
  // Board management
  boards: Board[];
  currentBoardId: string | null;

  // React Flow state
  nodes: CustomNode[];
  edges: CustomEdge[];

  // Configuration
  config: AppConfig;

  // Actions
  setNodes: (nodes: CustomNode[]) => void;
  setEdges: (edges: CustomEdge[]) => void;
  addNode: (node: CustomNode) => void;
  updateNode: (nodeId: string, data: Partial<CustomNodeData>) => void;
  deleteNode: (nodeId: string) => void;

  addEdge: (edge: CustomEdge) => void;
  deleteEdge: (edgeId: string) => void;

  // Board actions
  createBoard: (name: string) => void;
  saveBoard: () => void;
  loadBoard: (boardId: string) => void;
  deleteBoard: (boardId: string) => void;
  renameBoard: (boardId: string, name: string) => void;

  // Config actions
  updateConfig: (config: Partial<AppConfig>) => void;

  // Node generation actions
  generateAnswer: (questionNodeId: string) => Promise<void>;
  generateSummary: (summaryNodeId: string) => Promise<void>;
  generatePitch: (pitchNodeId: string) => Promise<void>;
  generateImages: (imagesNodeId: string) => Promise<void>;
}

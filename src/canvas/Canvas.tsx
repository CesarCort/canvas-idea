import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  NodeTypes,
  ConnectionMode,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useStore } from '@/state/store';
import { NodeType, CustomNode } from '@/types';
import { isValidConnection, generateId } from '@/lib/utils';
import { RightSidebarContext } from './RightSidebarContext';
import { ContextMenu } from './ContextMenu';
import { TextBox, TextBoxData } from './TextBox';
import {
  TextSourceNode,
  QuestionNode,
  AnswerNode,
  SummaryNode,
  PitchNode,
  ImagesNode,
} from './nodes';

const nodeTypes: NodeTypes = {
  [NodeType.TEXT_SOURCE]: TextSourceNode,
  [NodeType.QUESTION]: QuestionNode,
  [NodeType.ANSWER]: AnswerNode,
  [NodeType.SUMMARY]: SummaryNode,
  [NodeType.PITCH]: PitchNode,
  [NodeType.IMAGES]: ImagesNode,
};

interface CanvasInnerProps {
  onOpenRightSidebar: (nodeId: string, content: string) => void;
}

const CanvasInner: React.FC<CanvasInnerProps> = ({ onOpenRightSidebar }) => {
  const { nodes, edges, setNodes, setEdges, addEdge: addStoreEdge, addNode } = useStore();
  const reactFlow = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextBoxData[]>([]);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);

  // Watch for new nodes and fit view to show them
  useEffect(() => {
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      // If the last node is an Answer node, fit view to show it
      if (lastNode.type === NodeType.ANSWER) {
        setTimeout(() => {
          reactFlow.fitView({
            padding: 0.2,
            duration: 500,
            nodes: [lastNode],
          });
        }, 100);
      }
    }
  }, [nodes.length, reactFlow]);

  const onNodesChange = useCallback(
    (changes: any) => {
      // Handle node changes (position, selection, etc.)
      const updatedNodes = changes.reduce((acc: any, change: any) => {
        if (change.type === 'position' && change.position) {
          return acc.map((node: any) =>
            node.id === change.id
              ? { ...node, position: change.position }
              : node
          );
        }
        if (change.type === 'remove') {
          return acc.filter((node: any) => node.id !== change.id);
        }
        if (change.type === 'select') {
          return acc.map((node: any) =>
            node.id === change.id
              ? { ...node, selected: change.selected }
              : node
          );
        }
        return acc;
      }, nodes);
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      // Handle edge changes (selection, removal, etc.)
      const updatedEdges = changes.reduce((acc: any, change: any) => {
        if (change.type === 'remove') {
          return acc.filter((edge: any) => edge.id !== change.id);
        }
        if (change.type === 'select') {
          return acc.map((edge: any) =>
            edge.id === change.id
              ? { ...edge, selected: change.selected }
              : edge
          );
        }
        return acc;
      }, edges);
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!isValidConnection(sourceNode?.type, targetNode?.type)) {
        console.warn('Invalid connection attempt');
        return;
      }

      const newEdge: Edge = {
        id: `${connection.source}-${connection.target}`,
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
      };

      addStoreEdge(newEdge);
    },
    [nodes, addStoreEdge]
  );

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  }, []);

  const handleCreateFromContextMenu = useCallback((type: NodeType | 'text') => {
    if (!contextMenu) return;

    const position = reactFlow.screenToFlowPosition({
      x: contextMenu.x,
      y: contextMenu.y,
    });

    if (type === 'text') {
      // Create text box
      const newTextBox: TextBoxData = {
        id: generateId(),
        x: contextMenu.x,
        y: contextMenu.y,
        content: '',
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'normal',
        fontStyle: 'normal',
      };
      setTextBoxes(prev => [...prev, newTextBox]);
      setSelectedTextBoxId(newTextBox.id);
    } else {
      // Create node
      const newNode: CustomNode = {
        id: generateId(),
        type,
        position,
        data: getDefaultNodeData(type),
      };
      addNode(newNode);
    }
  }, [contextMenu, reactFlow, addNode]);

  const getDefaultNodeData = (type: NodeType): any => {
    switch (type) {
      case NodeType.TEXT_SOURCE:
        return { label: 'Text Source', status: 'idle', text: '' };
      case NodeType.QUESTION:
        return { label: 'Question', status: 'idle', question: '' };
      case NodeType.SUMMARY:
        return { label: 'Summary', status: 'idle', summary: '', bulletCount: 5 };
      case NodeType.PITCH:
        return { label: 'Pitch', status: 'idle', pitch: '', pitchType: 'short' };
      case NodeType.IMAGES:
        return { label: 'Images', status: 'idle', prompt: '', imageCount: 1, imageUrls: [] };
      default:
        return { label: 'Node', status: 'idle' };
    }
  };

  const minimapNodeColor = useCallback((node: any) => {
    switch (node.type) {
      case NodeType.TEXT_SOURCE:
        return '#3b82f6';
      case NodeType.QUESTION:
        return '#8b5cf6';
      case NodeType.ANSWER:
        return '#10b981';
      case NodeType.SUMMARY:
        return '#f59e0b';
      case NodeType.PITCH:
        return '#ef4444';
      case NodeType.IMAGES:
        return '#ec4899';
      default:
        return '#6b7280';
    }
  }, []);

  return (
    <RightSidebarContext.Provider value={{ openRightSidebar: onOpenRightSidebar }}>
      <div style={{ width: '100%', height: '100%' }} onContextMenu={handleContextMenu}>
        {/* Text boxes */}
        {textBoxes.map(textBox => (
          <TextBox
            key={textBox.id}
            data={textBox}
            selected={selectedTextBoxId === textBox.id}
            onSelect={setSelectedTextBoxId}
            onUpdate={(id, updates) => {
              setTextBoxes(prev => prev.map(tb => tb.id === id ? { ...tb, ...updates } : tb));
            }}
            onDelete={(id) => {
              setTextBoxes(prev => prev.filter(tb => tb.id !== id));
              setSelectedTextBoxId(null);
            }}
          />
        ))}

        {/* Context menu */}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onCreateNode={handleCreateFromContextMenu}
          />
        )}

        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        minZoom={0.2}
        maxZoom={2}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        selectNodesOnDrag={false}
      >
        <Background color="#333" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={minimapNodeColor}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>
      </div>
    </RightSidebarContext.Provider>
  );
};

interface CanvasProps {
  onOpenRightSidebar: (nodeId: string, content: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ onOpenRightSidebar }) => {
  return (
    <ReactFlowProvider>
      <CanvasInner onOpenRightSidebar={onOpenRightSidebar} />
    </ReactFlowProvider>
  );
};

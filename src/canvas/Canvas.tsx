import { useCallback, useEffect } from 'react';
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
import { NodeType } from '@/types';
import { isValidConnection } from '@/lib/utils';
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

const CanvasInner: React.FC = () => {
  const { nodes, edges, setNodes, setEdges, addEdge: addStoreEdge } = useStore();
  const reactFlow = useReactFlow();

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
    <div style={{ width: '100%', height: '100%' }}>
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
  );
};

export const Canvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
};

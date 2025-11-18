import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/state/store';
import { NodeType } from '@/types';
import { generateId } from '@/lib/utils';
import './NodeBase.css';

interface AddNodeButtonProps {
  sourceNodeId: string;
}

interface NodeOption {
  type: NodeType;
  label: string;
  icon: string;
}

export const AddNodeButton: React.FC<AddNodeButtonProps> = ({ sourceNodeId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { addNode, addEdge, nodes } = useStore();

  // All node types are always available regardless of source
  const getAvailableNodeTypes = (): NodeOption[] => {
    return [
      { type: NodeType.QUESTION, label: 'Question', icon: '❓' },
      { type: NodeType.SUMMARY, label: 'Summary', icon: '📋' },
      { type: NodeType.PITCH, label: 'Pitch', icon: '🎯' },
      { type: NodeType.IMAGES, label: 'Images', icon: '🖼️' },
    ];
  };

  const availableNodes = getAvailableNodeTypes();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleCreateNode = (nodeType: NodeType) => {
    const sourceNode = nodes.find((n) => n.id === sourceNodeId);
    if (!sourceNode) return;

    const newNodeId = generateId();

    // Posicionar el nuevo nodo a la derecha del nodo fuente
    const newPosition = {
      x: sourceNode.position.x + 450,
      y: sourceNode.position.y,
    };

    // Crear datos según el tipo de nodo
    let newNodeData: any = {
      label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
      status: 'idle' as const,
    };

    switch (nodeType) {
      case NodeType.QUESTION:
        newNodeData.question = '';
        break;
      case NodeType.SUMMARY:
        newNodeData.summary = '';
        newNodeData.bulletCount = 5;
        break;
      case NodeType.PITCH:
        newNodeData.pitch = '';
        newNodeData.pitchType = 'short' as const;
        break;
      case NodeType.IMAGES:
        newNodeData.prompt = '';
        newNodeData.imageCount = 2;
        newNodeData.imageUrls = [];
        break;
    }

    // Crear el nodo
    const newNode = {
      id: newNodeId,
      type: nodeType,
      position: newPosition,
      data: newNodeData,
    };

    // Agregar nodo y conexión
    addNode(newNode);
    addEdge({
      id: `${sourceNodeId}-${newNodeId}`,
      source: sourceNodeId,
      target: newNodeId,
    });

    setShowMenu(false);
  };

  if (availableNodes.length === 0) return null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="add-node-button right"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        title="Add connected node"
      >
        +
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="add-node-menu"
          style={{
            position: 'absolute',
            right: '-170px',
            top: '0',
          }}
        >
          {availableNodes.map((option) => (
            <div
              key={option.type}
              className="add-node-menu-item"
              onClick={() => handleCreateNode(option.type)}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

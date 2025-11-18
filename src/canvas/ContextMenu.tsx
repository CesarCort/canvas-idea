import React from 'react';
import { NodeType } from '@/types';
import './ContextMenu.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCreateNode: (type: NodeType | 'text') => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onCreateNode }) => {
  const handleItemClick = (type: NodeType | 'text') => {
    onCreateNode(type);
    onClose();
  };

  return (
    <>
      <div className="context-menu-overlay" onClick={onClose} />
      <div className="context-menu" style={{ left: x, top: y }}>
        <div className="context-menu-header">Create Node</div>
        <button
          className="context-menu-item"
          onClick={() => handleItemClick(NodeType.TEXT_SOURCE)}
        >
          <span className="menu-icon">📄</span>
          <span>Text Source</span>
        </button>
        <button
          className="context-menu-item"
          onClick={() => handleItemClick(NodeType.QUESTION)}
        >
          <span className="menu-icon">❓</span>
          <span>Question</span>
        </button>
        <button
          className="context-menu-item"
          onClick={() => handleItemClick(NodeType.SUMMARY)}
        >
          <span className="menu-icon">📋</span>
          <span>Summary</span>
        </button>
        <button
          className="context-menu-item"
          onClick={() => handleItemClick(NodeType.PITCH)}
        >
          <span className="menu-icon">🎯</span>
          <span>Pitch</span>
        </button>
        <button
          className="context-menu-item"
          onClick={() => handleItemClick(NodeType.IMAGES)}
        >
          <span className="menu-icon">🖼️</span>
          <span>Images</span>
        </button>
        <div className="context-menu-divider" />
        <button
          className="context-menu-item"
          onClick={() => handleItemClick('text')}
        >
          <span className="menu-icon">📝</span>
          <span>Text Box</span>
        </button>
      </div>
    </>
  );
};

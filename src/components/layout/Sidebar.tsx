import React, { useState } from 'react';
import { useStore } from '@/state/store';
import { NodeType } from '@/types';
import { generateId } from '@/lib/utils';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  const { addNode, nodes, config } = useStore();
  const [sourceText, setSourceText] = useState('');

  const hasApiKey = !!config.apiKey;

  const createTextSourceNode = () => {
    const newNode = {
      id: generateId(),
      type: NodeType.TEXT_SOURCE,
      position: { x: 250, y: 100 },
      data: {
        label: 'Text Source',
        status: 'idle' as const,
        text: sourceText,
      },
    };
    addNode(newNode);
    setSourceText(''); // Clear after creating
  };

  const createQuestionNode = () => {
    const newNode = {
      id: generateId(),
      type: NodeType.QUESTION,
      position: { x: 250 + nodes.length * 50, y: 100 + nodes.length * 50 },
      data: {
        label: 'Question',
        status: 'idle' as const,
        question: '',
      },
    };
    addNode(newNode);
  };

  const createSummaryNode = () => {
    const newNode = {
      id: generateId(),
      type: NodeType.SUMMARY,
      position: { x: 250 + nodes.length * 50, y: 100 + nodes.length * 50 },
      data: {
        label: 'Summary',
        status: 'idle' as const,
        summary: '',
        bulletCount: 5,
      },
    };
    addNode(newNode);
  };

  const createPitchNode = () => {
    const newNode = {
      id: generateId(),
      type: NodeType.PITCH,
      position: { x: 250 + nodes.length * 50, y: 100 + nodes.length * 50 },
      data: {
        label: 'Pitch',
        status: 'idle' as const,
        pitch: '',
        pitchType: 'short' as const,
      },
    };
    addNode(newNode);
  };

  const createImagesNode = () => {
    const newNode = {
      id: generateId(),
      type: NodeType.IMAGES,
      position: { x: 250 + nodes.length * 50, y: 100 + nodes.length * 50 },
      data: {
        label: 'Images',
        status: 'idle' as const,
        prompt: '',
        imageCount: 2,
        imageUrls: [],
      },
    };
    addNode(newNode);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>Source Text</h3>
        <textarea
          className="source-textarea"
          placeholder="Paste or write your base text here..."
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
        />
        <button
          onClick={createTextSourceNode}
          disabled={!sourceText.trim()}
          className="primary"
        >
          Create Text Node
        </button>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <h3>Add Nodes</h3>
        {!hasApiKey && (
          <p className="warning-message text-xs">
            Configure your API key in Settings to use AI features.
          </p>
        )}
        <div className="node-buttons">
          <button onClick={createQuestionNode} disabled={!hasApiKey}>
            + Question
          </button>
          <button onClick={createSummaryNode} disabled={!hasApiKey}>
            + Summary
          </button>
          <button onClick={createPitchNode} disabled={!hasApiKey}>
            + Pitch
          </button>
          <button onClick={createImagesNode} disabled={!hasApiKey}>
            + Images
          </button>
        </div>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <h3>Instructions</h3>
        <div className="instructions text-xs text-secondary">
          <p>1. Create a text source node</p>
          <p>2. Add question/summary/pitch/image nodes</p>
          <p>3. Connect nodes by dragging from output to input</p>
          <p>4. Click "Generate" on nodes to create content</p>
        </div>
      </div>
    </aside>
  );
};

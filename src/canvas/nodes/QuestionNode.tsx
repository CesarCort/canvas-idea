import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { QuestionNodeData, NodeType } from '@/types';
import { useStore } from '@/state/store';
import { AddNodeButton } from './AddNodeButton';
import './NodeBase.css';

export const QuestionNode: React.FC<NodeProps<QuestionNodeData>> = ({ id, data, type }) => {
  const { updateNode, deleteNode, generateAnswer } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!data.question.trim()) return;

    try {
      setIsGenerating(true);
      await generateAnswer(id);
    } catch (error) {
      console.error('Error generating answer:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="custom-node" style={{ width: 350 }}>
      <button
        className="delete-button"
        onClick={() => deleteNode(id)}
        title="Delete node"
      >
        ✕
      </button>

      <AddNodeButton sourceNodeId={id} sourceNodeType={type || NodeType.QUESTION} />

      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: 'var(--accent-primary)' }}
      />

      <div className="node-header">
        <h4 className="node-title">❓ Question</h4>
        <span className={`node-status ${data.status}`}>{data.status}</span>
      </div>

      <div className="node-body">
        <div className="node-field">
          <label>Your Question</label>
          <textarea
            value={data.question}
            onChange={(e) => updateNode(id, { question: e.target.value })}
            placeholder="Ask a question about the connected text..."
            rows={3}
          />
        </div>

        {data.errorMessage && (
          <div className="node-error">{data.errorMessage}</div>
        )}

        <div className="node-actions">
          <button
            onClick={handleGenerate}
            disabled={!data.question.trim() || isGenerating}
            className="primary small"
          >
            {isGenerating ? 'Generating...' : 'Generate Answer'}
          </button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: 'var(--accent-primary)' }}
      />
    </div>
  );
};

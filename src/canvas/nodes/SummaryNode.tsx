import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { SummaryNodeData } from '@/types';
import { useStore } from '@/state/store';
import { copyToClipboard } from '@/lib/utils';
import { AddNodeButton } from './AddNodeButton';
import './NodeBase.css';

export const SummaryNode: React.FC<NodeProps<SummaryNodeData>> = ({ id, data }) => {
  const { updateNode, deleteNode, generateSummary } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await generateSummary(id);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(data.summary);
    if (success) {
      // Could show a toast notification here
    }
  };

  return (
    <div className="custom-node" style={{ width: 420 }}>
      <button
        className="delete-button"
        onClick={() => deleteNode(id)}
        title="Delete node"
      >
        ✕
      </button>

      <AddNodeButton sourceNodeId={id} />

      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: 'var(--accent-primary)' }}
      />

      <div className="node-header">
        <h4 className="node-title">📋 Summary</h4>
        <span className={`node-status ${data.status}`}>{data.status}</span>
      </div>

      <div className="node-body">
        <div className="node-field">
          <label>Number of Key Points</label>
          <input
            type="number"
            min="2"
            max="10"
            value={data.bulletCount}
            onChange={(e) =>
              updateNode(id, { bulletCount: parseInt(e.target.value) || 5 })
            }
          />
        </div>

        {data.summary ? (
          <>
            <div className="node-content">{data.summary}</div>
            <div className="node-actions">
              <button onClick={handleCopy} className="small">
                Copy Summary
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="small"
              >
                Regenerate
              </button>
            </div>
          </>
        ) : (
          <div className="node-actions">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="primary"
            >
              {isGenerating ? 'Generating...' : 'Generate Summary'}
            </button>
          </div>
        )}

        {data.errorMessage && (
          <div className="node-error">{data.errorMessage}</div>
        )}
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

import React, { useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { SummaryNodeData } from '@/types';
import { useStore } from '@/state/store';
import { copyToClipboard } from '@/lib/utils';
import { AddNodeButton } from './AddNodeButton';
import { useRightSidebar } from '../RightSidebarContext';
import './NodeBase.css';

export const SummaryNode: React.FC<NodeProps<SummaryNodeData>> = ({ id, data, selected }) => {
  const { updateNode, deleteNode, generateSummary } = useStore();
  const { openRightSidebar } = useRightSidebar();
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

  const handleResize = (_event: any, params: { width: number; height: number }) => {
    updateNode(id, { width: params.width, height: params.height });
  };

  return (
    <div className="custom-node" style={{ width: data.width || 420, height: data.height || 'auto' }}>
      <NodeResizer
        isVisible={selected}
        minWidth={250}
        minHeight={150}
        onResize={handleResize}
      />
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
                onClick={() => openRightSidebar(id, data.summary)}
                className="small"
              >
                View Complete
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

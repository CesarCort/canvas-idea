import React, { useState } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { PitchNodeData } from '@/types';
import { useStore } from '@/state/store';
import { copyToClipboard } from '@/lib/utils';
import { AddNodeButton } from './AddNodeButton';
import { useRightSidebar } from '../RightSidebarContext';
import './NodeBase.css';

export const PitchNode: React.FC<NodeProps<PitchNodeData>> = ({ id, data, selected }) => {
  const { updateNode, deleteNode, generatePitch } = useStore();
  const { openRightSidebar } = useRightSidebar();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await generatePitch(id);
    } catch (error) {
      console.error('Error generating pitch:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(data.pitch);
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
        <h4 className="node-title">🎯 Pitch</h4>
        <span className={`node-status ${data.status}`}>{data.status}</span>
      </div>

      <div className="node-body">
        <div className="node-field">
          <label>Pitch Type</label>
          <select
            value={data.pitchType}
            onChange={(e) =>
              updateNode(id, { pitchType: e.target.value as 'short' | 'detailed' })
            }
          >
            <option value="short">Short (1 min)</option>
            <option value="detailed">Detailed (3 min)</option>
          </select>
        </div>

        {data.pitch ? (
          <>
            <div className="node-content">{data.pitch}</div>
            <div className="node-actions">
              <button onClick={handleCopy} className="small">
                Copy Pitch
              </button>
              <button
                onClick={() => openRightSidebar(id, data.pitch)}
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
              {isGenerating ? 'Generating...' : 'Generate Pitch'}
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

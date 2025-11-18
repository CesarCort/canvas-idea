import React from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { AnswerNodeData } from '@/types';
import { useStore } from '@/state/store';
import { copyToClipboard } from '@/lib/utils';
import { AddNodeButton } from './AddNodeButton';
import { useRightSidebar } from '../RightSidebarContext';
import './NodeBase.css';

export const AnswerNode: React.FC<NodeProps<AnswerNodeData>> = ({ id, data, selected }) => {
  const { updateNode, deleteNode } = useStore();
  const { openRightSidebar } = useRightSidebar();

  const handleCopy = async () => {
    const success = await copyToClipboard(data.answer);
    if (success) {
      // Could show a toast notification here
    }
  };

  const handleResize = (_event: any, params: { width: number; height: number }) => {
    updateNode(id, { width: params.width, height: params.height });
  };

  return (
    <div className="custom-node" style={{ width: data.width || 400, height: data.height || 'auto' }}>
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
        <h4 className="node-title">💡 Answer</h4>
        <span className={`node-status ${data.status}`}>{data.status}</span>
      </div>

      <div className="node-body">
        {data.answer ? (
          <>
            <div className="node-content">{data.answer}</div>
            <div className="node-actions">
              <button onClick={handleCopy} className="small">
                Copy Answer
              </button>
              <button
                onClick={() => openRightSidebar(id, data.answer)}
                className="small"
              >
                View Complete
              </button>
            </div>
          </>
        ) : (
          <p className="text-secondary text-sm">
            Answer will appear here after generation
          </p>
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

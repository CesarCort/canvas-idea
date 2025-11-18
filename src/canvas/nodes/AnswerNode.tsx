import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AnswerNodeData, NodeType } from '@/types';
import { useStore } from '@/state/store';
import { copyToClipboard } from '@/lib/utils';
import { AddNodeButton } from './AddNodeButton';
import './NodeBase.css';

export const AnswerNode: React.FC<NodeProps<AnswerNodeData>> = ({ id, data, type }) => {
  const { deleteNode } = useStore();

  const handleCopy = async () => {
    const success = await copyToClipboard(data.answer);
    if (success) {
      // Could show a toast notification here
    }
  };

  return (
    <div className="custom-node" style={{ width: 400 }}>
      <button
        className="delete-button"
        onClick={() => deleteNode(id)}
        title="Delete node"
      >
        ✕
      </button>

      <AddNodeButton sourceNodeId={id} sourceNodeType={type || NodeType.ANSWER} />

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

import React from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { TextSourceNodeData } from '@/types';
import { useStore } from '@/state/store';
import { copyToClipboard } from '@/lib/utils';
import { AddNodeButton } from './AddNodeButton';
import './NodeBase.css';

export const TextSourceNode: React.FC<NodeProps<TextSourceNodeData>> = ({ id, data, selected }) => {
  const { updateNode, deleteNode } = useStore();

  const handleCopy = async () => {
    const success = await copyToClipboard(data.text);
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

      <div className="node-header">
        <h4 className="node-title">📄 Text Source</h4>
      </div>

      <div className="node-body">
        <div className="node-field">
          <label>Source Text</label>
          <textarea
            value={data.text}
            onChange={(e) => updateNode(id, { text: e.target.value })}
            placeholder="Enter or paste your source text..."
            rows={8}
          />
        </div>

        <div className="node-actions">
          <button onClick={handleCopy} className="small">
            Copy Text
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

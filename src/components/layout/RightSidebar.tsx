import React from 'react';
import { useStore } from '@/state/store';
import './RightSidebar.css';

interface RightSidebarProps {
  nodeId: string;
  content: string;
  onClose: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ nodeId, content, onClose }) => {
  const { nodes, updateNode } = useStore();
  const node = nodes.find(n => n.id === nodeId);
  const notes = node?.data.notes || '';

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(nodeId, { notes: e.target.value });
  };

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-header">
        <h3>Complete View</h3>
        <button
          onClick={onClose}
          className="close-button"
          title="Close"
        >
          ✕
        </button>
      </div>

      <div className="right-sidebar-content">
        <div className="content-section">
          <h4>Content</h4>
          <div className="formatted-content">{content}</div>
        </div>

        <div className="notes-section">
          <h4>Notes</h4>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add your notes here..."
            rows={10}
          />
          <p className="help-text">
            These notes are for your reference only and won't be included in AI prompts.
          </p>
        </div>
      </div>
    </aside>
  );
};

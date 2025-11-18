import React, { useState } from 'react';
import { useStore } from '@/state/store';
import { formatDate } from '@/lib/utils';
import './ConfigModal.css';

interface BoardManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BoardManager: React.FC<BoardManagerProps> = ({ isOpen, onClose }) => {
  const { boards, currentBoardId, loadBoard, deleteBoard, renameBoard } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  const handleLoadBoard = (boardId: string) => {
    loadBoard(boardId);
    onClose();
  };

  const handleStartRename = (boardId: string, currentName: string) => {
    setEditingId(boardId);
    setEditName(currentName);
  };

  const handleSaveRename = (boardId: string) => {
    if (editName.trim()) {
      renameBoard(boardId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (boardId: string) => {
    if (confirm('Are you sure you want to delete this board?')) {
      deleteBoard(boardId);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Boards</h2>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {boards.length === 0 ? (
            <p className="text-secondary text-sm">
              No boards yet. Create one to get started!
            </p>
          ) : (
            <div className="boards-list">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className={`board-item ${
                    board.id === currentBoardId ? 'active' : ''
                  }`}
                >
                  {editingId === board.id ? (
                    <div className="board-edit">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(board.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRename(board.id)}
                        className="small primary"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="small"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="board-info">
                        <h4>{board.name}</h4>
                        <p className="text-xs text-muted">
                          {board.nodes.length} nodes • Updated{' '}
                          {formatDate(board.updatedAt)}
                        </p>
                      </div>
                      <div className="board-actions">
                        <button
                          onClick={() => handleLoadBoard(board.id)}
                          className="small primary"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleStartRename(board.id, board.name)}
                          className="small"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => handleDelete(board.id)}
                          className="small danger"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

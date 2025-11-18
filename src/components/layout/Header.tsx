import React, { useState } from 'react';
import { useStore } from '@/state/store';
import './Header.css';

interface HeaderProps {
  onOpenConfig: () => void;
  onOpenBoardManager: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConfig, onOpenBoardManager, onToggleSidebar, isSidebarOpen }) => {
  const { boards, currentBoardId, createBoard, saveBoard } = useStore();
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const currentBoard = boards.find((b) => b.id === currentBoardId);

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim());
      setNewBoardName('');
      setIsCreatingBoard(false);
    }
  };

  const handleSaveBoard = () => {
    saveBoard();
    // Could show a toast notification here
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          onClick={onToggleSidebar}
          className="sidebar-toggle"
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isSidebarOpen ? '◀' : '▶'}
        </button>
        <h1 className="header-title">Canvas IA</h1>
        {currentBoard && (
          <span className="board-name">{currentBoard.name}</span>
        )}
      </div>

      <div className="header-actions">
        {isCreatingBoard ? (
          <div className="create-board-input">
            <input
              type="text"
              placeholder="Board name..."
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateBoard();
                if (e.key === 'Escape') {
                  setIsCreatingBoard(false);
                  setNewBoardName('');
                }
              }}
              autoFocus
            />
            <button onClick={handleCreateBoard} className="small primary">
              Create
            </button>
            <button
              onClick={() => {
                setIsCreatingBoard(false);
                setNewBoardName('');
              }}
              className="small"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => setIsCreatingBoard(true)}>
              New Board
            </button>
            <button onClick={onOpenBoardManager}>
              Load Board
            </button>
            <button onClick={handleSaveBoard} disabled={!currentBoardId}>
              Save
            </button>
            <button onClick={onOpenConfig} title="Settings">
              ⚙️
            </button>
          </>
        )}
      </div>
    </header>
  );
};

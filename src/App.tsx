import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { ConfigModal } from '@/components/config/ConfigModal';
import { BoardManager } from '@/components/config/BoardManager';
import { Canvas } from '@/canvas/Canvas';
import { useStore } from '@/state/store';
import './App.css';

interface RightSidebarData {
  nodeId: string;
  content: string;
}

function App() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isBoardManagerOpen, setIsBoardManagerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [rightSidebarData, setRightSidebarData] = useState<RightSidebarData | null>(null);
  const { boards, currentBoardId, createBoard } = useStore();

  // Create a default board if none exists
  useEffect(() => {
    if (boards.length === 0) {
      createBoard('My First Board');
    } else if (!currentBoardId && boards.length > 0) {
      // Load the first board if no board is currently loaded
      useStore.getState().loadBoard(boards[0].id);
    }
  }, []);

  const handleOpenRightSidebar = (nodeId: string, content: string) => {
    // Close left sidebar when opening right sidebar
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    setRightSidebarData({ nodeId, content });
  };

  const handleCloseRightSidebar = () => {
    setRightSidebarData(null);
  };

  const handleToggleLeftSidebar = () => {
    // Close right sidebar when opening left sidebar
    if (!isSidebarOpen && rightSidebarData) {
      setRightSidebarData(null);
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app">
      <Header
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenBoardManager={() => setIsBoardManagerOpen(true)}
        onToggleSidebar={handleToggleLeftSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="app-content">
        {isSidebarOpen && <Sidebar />}
        <main className="canvas-container">
          <Canvas onOpenRightSidebar={handleOpenRightSidebar} />
        </main>
        {rightSidebarData && (
          <RightSidebar
            nodeId={rightSidebarData.nodeId}
            content={rightSidebarData.content}
            onClose={handleCloseRightSidebar}
          />
        )}
      </div>

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />

      <BoardManager
        isOpen={isBoardManagerOpen}
        onClose={() => setIsBoardManagerOpen(false)}
      />
    </div>
  );
}

export default App;

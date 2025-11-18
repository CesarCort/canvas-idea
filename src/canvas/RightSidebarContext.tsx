import { createContext, useContext } from 'react';

interface RightSidebarContextType {
  openRightSidebar: (nodeId: string, content: string) => void;
}

export const RightSidebarContext = createContext<RightSidebarContextType | null>(null);

export const useRightSidebar = () => {
  const context = useContext(RightSidebarContext);
  if (!context) {
    throw new Error('useRightSidebar must be used within RightSidebarContext.Provider');
  }
  return context;
};

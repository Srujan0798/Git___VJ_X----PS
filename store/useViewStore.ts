import { create } from 'zustand';

type View = 'dashboard' | 'workspace' | 'marketplace';

interface ViewState {
  currentView: View;
  activeWorkspaceId: string | null;
  navigateToDashboard: () => void;
  navigateToWorkspace: (workspaceId: string | null) => void;
  navigateToMarketplace: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'dashboard',
  activeWorkspaceId: null,
  navigateToDashboard: () => set({ currentView: 'dashboard', activeWorkspaceId: null }),
  navigateToWorkspace: (workspaceId) => set({ currentView: 'workspace', activeWorkspaceId: workspaceId }),
  navigateToMarketplace: () => set({ currentView: 'marketplace', activeWorkspaceId: null }),
}));
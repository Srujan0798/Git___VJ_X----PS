import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import Sidebar from './components/layout/Sidebar';
import Workspace from './components/canvas/Workspace';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileToolbar from './components/layout/MobileToolbar';
import { socketService } from './services/socketService';
import { useStore } from './store/useStore';
import { useViewStore } from './store/useViewStore';
import Dashboard from './components/dashboard/Dashboard';
import { useWeb3Store } from './hooks/useWeb3';
import TemplateMarketplace from './components/marketplace/TemplateMarketplace';
import { useIsMobile } from './hooks/useIsMobile';
import { analyticsService } from './services/analyticsService';
import { NodeUpdatePayload, EdgeUpdatePayload } from './types';

// Workspace layout component
const WorkspaceLayout = () => {
  const { applyRemoteNodeChanges, applyRemoteEdgeChanges } = useStore();
  const [collaborationStatus, setCollaborationStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleStatusChange = (status: 'connected' | 'disconnected') => {
      setCollaborationStatus(status);
    };

    const handleNodeUpdate = (wrappedPayload: { clientId: string, payload: NodeUpdatePayload }) => {
      // CRITICAL FIX: Ignore events that originated from this client to prevent echo effect.
      if (wrappedPayload.clientId === socketService.getClientId()) return;
      
      console.log("Received remote node update", wrappedPayload.payload);
      applyRemoteNodeChanges(wrappedPayload.payload.changes);
    };

    const handleEdgeUpdate = (wrappedPayload: { clientId: string, payload: EdgeUpdatePayload }) => {
      // CRITICAL FIX: Ignore events that originated from this client.
      if (wrappedPayload.clientId === socketService.getClientId()) return;

      console.log("Received remote edge update", wrappedPayload.payload);
      applyRemoteEdgeChanges(wrappedPayload.payload.changes);
    };

    socketService.connect();
    socketService.on('status', handleStatusChange);
    socketService.on('node-updated', handleNodeUpdate);
    socketService.on('edge-updated', handleEdgeUpdate);

    return () => {
      socketService.off('status', handleStatusChange);
      socketService.off('node-updated', handleNodeUpdate);
      socketService.off('edge-updated', handleEdgeUpdate);
      socketService.disconnect();
    };
  }, [applyRemoteNodeChanges, applyRemoteEdgeChanges]);

  return (
    <ReactFlowProvider>
      {isMobile ? (
        <main className="flex-1 relative h-full">
          <Workspace />
          <MobileToolbar />
        </main>
      ) : (
        <>
          <Header />
          <div className="flex flex-1 h-full pt-16">
            <Sidebar />
            <main className="flex-1 relative">
              <Workspace />
            </main>
          </div>
          <Footer collaborationStatus={collaborationStatus} />
        </>
      )}
    </ReactFlowProvider>
  );
};


function App() {
  const { currentView } = useViewStore();
  const { isAuthenticated } = useWeb3Store();

  useEffect(() => {
    analyticsService.trackPageView(currentView);
  }, [currentView]);

  useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        const isUndo = (event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey;
        const isRedo = (event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey));
        
        // STABILITY FIX: Use getState() inside the handler to get the freshest state
        // without subscribing the entire App component to history changes. This prevents
        // the app from re-rendering on every node drag, fixing the crash.
        const { undo, redo, past, future } = useStore.getState();

        if (isUndo) {
          event.preventDefault();
          if (past.length > 0) undo();
        } else if (isRedo) {
          event.preventDefault();
          if (future.length > 0) redo();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, []); // Empty dependency array as we are using getState

  const renderView = () => {
    // If not authenticated, always show the dashboard which contains the login prompt logic
    if (!isAuthenticated) {
       return <Dashboard />;
    }
    
    switch(currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'workspace':
        return <WorkspaceLayout />;
      case 'marketplace':
        return <TemplateMarketplace />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans overflow-hidden">
      {renderView()}
    </div>
  );
}

export default App;
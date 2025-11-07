/**
 * A simulated Usage Analytics service based on the Phase 12 instructions.
 * In a real application, this would send logs to a dedicated analytics backend.
 * Here, we just log them to the console to show the functionality is wired up.
 */
class AnalyticsService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    console.log("[Analytics SIM] Service initialized. Session ID:", this.sessionId);
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sendToBackend(event: object) {
    // This simulates the fetch call to a backend endpoint.
    console.log('[Analytics SIM] Tracking event:', event);
    // In a real app:
    // try {
    //   await fetch('/api/analytics/track', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(event)
    //   });
    // } catch (error) {
    //   console.error('Analytics error:', error);
    // }
  }

  track(eventName: string, properties: Record<string, any> = {}) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };
    this.sendToBackend(event);
  }

  // Specific event trackers
  trackWorkspaceCreated(workspaceId: string, nodeCount: number) {
    this.track('workspace_created', { workspaceId, nodeCount, category: 'workspace' });
  }

  trackNodeAdded(nodeType: string | undefined, workspaceId: string) {
    this.track('node_added', { nodeType, workspaceId, category: 'node' });
  }

  trackConnectionMade(sourceType: string | undefined, targetType: string | undefined, workspaceId: string) {
    this.track('connection_made', { sourceType, targetType, workspaceId, category: 'connection' });
  }

  trackTemplateUsed(templateId: string, templateName: string) {
    this.track('template_used', { templateId, templateName, category: 'template' });
  }

  trackDataSourceConnected(sourceType: string, workspaceId: string) {
    this.track('data_source_connected', { sourceType, workspaceId, category: 'integration' });
  }
  
  trackError(errorType: string, errorMessage: string, context: Record<string, any> = {}) {
    this.track('error_occurred', { errorType, errorMessage, context, category: 'error' });
  }

  trackPageView(pageName: string) {
    this.track('page_view', { pageName, category: 'navigation' });
  }
}

export const analyticsService = new AnalyticsService();
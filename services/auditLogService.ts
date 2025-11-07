type LogLevel = 'info' | 'warn' | 'error';

/**
 * @summary A simulated service for creating audit trail logs for critical application events.
 */
class AuditLogService {
  private log(message: string, context: Record<string, any> = {}) {
    console.log(`[AUDIT LOG] ${new Date().toISOString()} | ${message}`, context);
  }

  /**
   * @summary Logs a security-related event.
   * @param {string} actor - The user address performing the action.
   * @param {'login' | 'logout' | 'permission_change'} action - The type of security action.
   * @param {LogLevel} level - The severity level of the event.
   * @param {object} details - Additional context for the event.
   */
  logSecurityEvent(
    actor: string,
    action: 'login' | 'logout' | 'permission_change',
    level: LogLevel,
    details: Record<string, any> = {}
  ) {
    this.log(`SECURITY: Actor [${actor}] performed action [${action}].`, {
      level,
      ...details,
    });
  }

  /**
   * @summary Logs an event related to workspace access.
   * @param {string} actor - The user address performing the action.
   * @param {string} workspaceId - The ID of the workspace being accessed.
   * @param {'load' | 'save' | 'create' | 'delete'} action - The type of access action.
   * @param {object} details - Additional context for the event.
   */
  logWorkspaceAccess(
    actor: string,
    workspaceId: string,
    action: 'load' | 'save' | 'create' | 'delete',
    details: Record<string, any> = {}
  ) {
    this.log(`WORKSPACE: Actor [${actor}] performed action [${action}] on workspace [${workspaceId}].`, details);
  }

  /**
   * @summary Logs an attempt to connect to a data source.
   * @param {string} actor - The user address performing the action.
   * @param {string} sourceType - The type of data source (e.g., 'postgresql', 'api').
   * @param {boolean} success - Whether the connection was successful.
   * @param {object} details - Additional context for the event.
   */
  logDataSourceConnection(
    actor: string,
    sourceType: string,
    success: boolean,
    details: Record<string, any> = {}
  ) {
    this.log(`DATA_SOURCE: Actor [${actor}] attempted to connect to [${sourceType}]. Success: ${success}.`, details);
  }
}

export const auditLogService = new AuditLogService();
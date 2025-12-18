// Audit logging service for tracking all admin actions
const STORAGE_KEY = 'aquapure_audit_logs';

export const auditService = {
  log(action, entity, entityId, details, userId, userName) {
    const logs = this.getLogs();
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      entity,
      entityId,
      details,
      userId,
      userName,
      ipAddress: '192.168.1.100' // Simulated
    };
    logs.unshift(newLog);
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.length = 1000;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    return newLog;
  },

  getLogs(filters = {}) {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let filtered = logs;

    if (filters.entity) {
      filtered = filtered.filter(l => l.entity === filters.entity);
    }
    if (filters.action) {
      filtered = filtered.filter(l => l.action === filters.action);
    }
    if (filters.userId) {
      filtered = filtered.filter(l => l.userId === filters.userId);
    }
    if (filters.startDate) {
      filtered = filtered.filter(l => new Date(l.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(l => new Date(l.timestamp) <= new Date(filters.endDate));
    }

    return filtered;
  },

  clearLogs() {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Action types
export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  VIEW: 'VIEW',
  EXPORT: 'EXPORT'
};

// Entity types
export const AUDIT_ENTITIES = {
  USER: 'USER',
  PRODUCTION: 'PRODUCTION',
  EQUIPMENT: 'EQUIPMENT',
  WATER_QUALITY: 'WATER_QUALITY',
  PROCESS: 'PROCESS',
  ALERT: 'ALERT',
  SYSTEM: 'SYSTEM'
};

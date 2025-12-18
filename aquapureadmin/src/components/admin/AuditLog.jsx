import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auditService, AUDIT_ACTIONS, AUDIT_ENTITIES } from '../../services/auditService';
import { format } from 'date-fns';

const actionColors = {
  CREATE: 'bg-green-500/20 text-green-400',
  UPDATE: 'bg-blue-500/20 text-blue-400',
  DELETE: 'bg-red-500/20 text-red-400',
  LOGIN: 'bg-purple-500/20 text-purple-400',
  LOGOUT: 'bg-gray-500/20 text-gray-400',
  VIEW: 'bg-cyan-500/20 text-cyan-400',
  EXPORT: 'bg-yellow-500/20 text-yellow-400'
};

const entityIcons = {
  USER: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  PRODUCTION: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  EQUIPMENT: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  WATER_QUALITY: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  PROCESS: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  ALERT: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  SYSTEM: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
};

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    entity: '',
    action: '',
    startDate: '',
    endDate: ''
  });
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = () => {
    const filteredLogs = auditService.getLogs(filters);
    setLogs(filteredLogs);
  };

  const clearFilters = () => {
    setFilters({ entity: '', action: '', startDate: '', endDate: '' });
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Action', 'Entity', 'User', 'Details'],
      ...logs.map(log => [
        log.timestamp,
        log.action,
        log.entity,
        log.userName,
        JSON.stringify(log.details)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <p className="text-dark-400 mt-1">Track all system activities and changes</p>
        </div>
        <button onClick={exportLogs} className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <h3 className="text-sm font-medium text-dark-300 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-dark-400 mb-1.5">Entity</label>
            <select
              value={filters.entity}
              onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
              className="input-field"
            >
              <option value="">All Entities</option>
              {Object.values(AUDIT_ENTITIES).map(e => (
                <option key={e} value={e}>{e.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-dark-400 mb-1.5">Action</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="input-field"
            >
              <option value="">All Actions</option>
              {Object.values(AUDIT_ACTIONS).map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-dark-400 mb-1.5">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs text-dark-400 mb-1.5">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={clearFilters} className="btn-secondary text-sm">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Logs List */}
      <div className="card">
        <div className="text-sm text-dark-400 mb-4">
          Showing {logs.length} entries
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-12 text-dark-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No audit logs found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-dark-900 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-dark-800 transition-colors text-left"
                >
                  <div className="p-2 bg-dark-800 rounded-lg">
                    <svg className="w-5 h-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={entityIcons[log.entity] || entityIcons.SYSTEM} />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${actionColors[log.action]}`}>
                        {log.action}
                      </span>
                      <span className="text-dark-400 text-xs">{log.entity.replace('_', ' ')}</span>
                    </div>
                    <p className="text-white text-sm mt-1 truncate">
                      {log.userName} {log.action.toLowerCase()}d {log.entity.toLowerCase().replace('_', ' ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-dark-400">
                      {format(new Date(log.timestamp), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-dark-500">
                      {format(new Date(log.timestamp), 'HH:mm:ss')}
                    </p>
                  </div>

                  <svg
                    className={`w-5 h-5 text-dark-400 transition-transform ${expandedLog === log.id ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedLog === log.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <div className="bg-dark-950 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-dark-400">User ID:</span>
                          <p className="text-dark-200 font-mono text-xs mt-1">{log.userId}</p>
                        </div>
                        <div>
                          <span className="text-dark-400">Entity ID:</span>
                          <p className="text-dark-200 font-mono text-xs mt-1">{log.entityId}</p>
                        </div>
                        <div>
                          <span className="text-dark-400">IP Address:</span>
                          <p className="text-dark-200 font-mono text-xs mt-1">{log.ipAddress}</p>
                        </div>
                        <div>
                          <span className="text-dark-400">Log ID:</span>
                          <p className="text-dark-200 font-mono text-xs mt-1">{log.id}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-dark-400 text-sm">Details:</span>
                        <pre className="mt-2 p-3 bg-dark-900 rounded text-xs text-dark-300 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

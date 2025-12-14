import { useState } from 'react';
import useStore from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';

const ALERT_TYPES = [
  { id: 'equipment', label: 'Equipment', color: 'bg-blue-500' },
  { id: 'quality', label: 'Quality', color: 'bg-purple-500' },
  { id: 'production', label: 'Production', color: 'bg-green-500' },
  { id: 'maintenance', label: 'Maintenance', color: 'bg-orange-500' },
  { id: 'safety', label: 'Safety', color: 'bg-red-500' }
];

const SEVERITY_LEVELS = [
  { id: 'info', label: 'Info', color: 'text-blue-400 bg-blue-500/20' },
  { id: 'warning', label: 'Warning', color: 'text-yellow-400 bg-yellow-500/20' },
  { id: 'critical', label: 'Critical', color: 'text-red-400 bg-red-500/20' }
];

export default function AlertManagement() {
  const { alerts, addAlert, updateAlert, deleteAlert, acknowledgeAlert } = useStore();
  const { addAuditEntry, user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'equipment',
    severity: 'warning',
    source: ''
  });

  const filteredAlerts = alerts?.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterType !== 'all' && alert.type !== filterType) return false;
    return true;
  }) || [];

  const activeAlerts = filteredAlerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = filteredAlerts.filter(a => a.acknowledged);

  const handleAdd = () => {
    const newAlert = {
      id: `alert-${Date.now()}`,
      ...formData,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      acknowledgedBy: null,
      acknowledgedAt: null
    };
    addAlert(newAlert);
    addAuditEntry('ALERT_CREATED', `Created alert: ${newAlert.title}`, null);
    setShowAddModal(false);
    setFormData({
      title: '',
      message: '',
      type: 'equipment',
      severity: 'warning',
      source: ''
    });
  };

  const handleAcknowledge = (alertId) => {
    acknowledgeAlert(alertId, user?.name || 'Unknown');
    const alert = alerts.find(a => a.id === alertId);
    addAuditEntry('ALERT_ACKNOWLEDGED', `Acknowledged alert: ${alert?.title}`, null);
  };

  const handleDelete = (alertId) => {
    const alert = alerts.find(a => a.id === alertId);
    deleteAlert(alertId);
    addAuditEntry('ALERT_DELETED', `Deleted alert: ${alert?.title}`, null);
  };

  const getSeverityColor = (severity) => {
    const level = SEVERITY_LEVELS.find(l => l.id === severity);
    return level?.color || 'text-slate-400 bg-slate-500/20';
  };

  const getTypeColor = (type) => {
    const alertType = ALERT_TYPES.find(t => t.id === type);
    return alertType?.color || 'bg-slate-500';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Alert Management</h2>
          <p className="text-slate-400 text-sm mt-1">Monitor and manage system alerts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Alert
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Total Active</p>
          <p className="text-2xl font-bold text-white">{activeAlerts.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-red-500/30 p-4">
          <p className="text-slate-400 text-sm">Critical</p>
          <p className="text-2xl font-bold text-red-400">
            {activeAlerts.filter(a => a.severity === 'critical').length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-yellow-500/30 p-4">
          <p className="text-slate-400 text-sm">Warning</p>
          <p className="text-2xl font-bold text-yellow-400">
            {activeAlerts.filter(a => a.severity === 'warning').length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <p className="text-slate-400 text-sm">Acknowledged Today</p>
          <p className="text-2xl font-bold text-green-400">{acknowledgedAlerts.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            {SEVERITY_LEVELS.map(level => (
              <option key={level.id} value={level.id}>{level.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            {ALERT_TYPES.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-white font-medium">Active Alerts ({activeAlerts.length})</h3>
        </div>
        <div className="divide-y divide-slate-700">
          {activeAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No active alerts</p>
            </div>
          ) : (
            activeAlerts.map(alert => (
              <div key={alert.id} className="p-4 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(alert.type)}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium">{alert.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>{formatTimestamp(alert.timestamp)}</span>
                        <span>{alert.source || 'System'}</span>
                        <span className="capitalize">{alert.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm rounded-lg transition-colors"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-medium">Acknowledged Alerts ({acknowledgedAlerts.length})</h3>
          </div>
          <div className="divide-y divide-slate-700">
            {acknowledgedAlerts.slice(0, 10).map(alert => (
              <div key={alert.id} className="p-4 opacity-60">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(alert.type)}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium">{alert.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs text-green-400 bg-green-500/20">
                          Acknowledged
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>By: {alert.acknowledgedBy}</span>
                        <span>{alert.acknowledgedAt && formatTimestamp(alert.acknowledgedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Create New Alert</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Alert Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., High Temperature Warning"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed alert message..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ALERT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Severity</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SEVERITY_LEVELS.map(level => (
                      <option key={level.id} value={level.id}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Source (optional)</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Filling Line 1, Water Treatment Unit"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!formData.title || !formData.message}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

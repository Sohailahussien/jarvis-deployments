import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { STORAGE_KEYS, mockAlerts } from '../../services/mockData';
import { auditService, AUDIT_ACTIONS, AUDIT_ENTITIES } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';

const alertTypes = ['info', 'warning', 'critical'];
const priorities = ['low', 'medium', 'high'];
const alertStatuses = ['active', 'acknowledged', 'resolved'];

export default function AlertManagement() {
  const { user: currentUser } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [viewAlert, setViewAlert] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    type: 'info',
    title: '',
    message: '',
    source: '',
    priority: 'medium'
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (stored) {
      setAlerts(JSON.parse(stored));
    } else {
      setAlerts(mockAlerts);
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(mockAlerts));
    }
  };

  const saveAlerts = (updated) => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    setAlerts(updated);
  };

  const openCreateModal = () => {
    setEditingAlert(null);
    setFormData({
      type: 'info',
      title: '',
      message: '',
      source: '',
      priority: 'medium'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAlert = {
      id: `alert_${Date.now()}`,
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'active',
      acknowledged: false
    };
    saveAlerts([newAlert, ...alerts]);
    auditService.log(
      AUDIT_ACTIONS.CREATE,
      AUDIT_ENTITIES.ALERT,
      newAlert.id,
      { alert: newAlert },
      currentUser.id,
      currentUser.name
    );
    setIsModalOpen(false);
  };

  const acknowledgeAlert = (alert) => {
    const updated = alerts.map(a =>
      a.id === alert.id ? { ...a, acknowledged: true, status: 'acknowledged' } : a
    );
    saveAlerts(updated);
    auditService.log(
      AUDIT_ACTIONS.UPDATE,
      AUDIT_ENTITIES.ALERT,
      alert.id,
      { action: 'acknowledged' },
      currentUser.id,
      currentUser.name
    );
  };

  const resolveAlert = (alert) => {
    const updated = alerts.map(a =>
      a.id === alert.id ? { ...a, status: 'resolved' } : a
    );
    saveAlerts(updated);
    auditService.log(
      AUDIT_ACTIONS.UPDATE,
      AUDIT_ENTITIES.ALERT,
      alert.id,
      { action: 'resolved' },
      currentUser.id,
      currentUser.name
    );
  };

  const deleteAlert = (alert) => {
    const updated = alerts.filter(a => a.id !== alert.id);
    saveAlerts(updated);
    auditService.log(
      AUDIT_ACTIONS.DELETE,
      AUDIT_ENTITIES.ALERT,
      alert.id,
      { deletedAlert: alert },
      currentUser.id,
      currentUser.name
    );
    setViewAlert(null);
  };

  const filteredAlerts = filter === 'all'
    ? alerts
    : alerts.filter(a => a.status === filter || a.type === filter);

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (val) => (
        <div className={`w-3 h-3 rounded-full ${
          val === 'critical' ? 'bg-red-500' :
          val === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        }`} />
      )
    },
    { key: 'title', label: 'Title' },
    { key: 'source', label: 'Source' },
    {
      key: 'priority',
      label: 'Priority',
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'timestamp',
      label: 'Time',
      render: (val) => formatDistanceToNow(new Date(val), { addSuffix: true })
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />
    }
  ];

  // Summary stats
  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && a.status === 'active').length;
  const unacknowledged = alerts.filter(a => !a.acknowledged && a.status === 'active').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Alert Management</h1>
          <p className="text-dark-400 mt-1">Monitor and respond to system alerts</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Alert
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-dark-400 text-sm">Total Alerts</p>
          <p className="text-2xl font-bold text-white mt-1">{alerts.length}</p>
        </div>
        <div className="card border-red-500/30">
          <p className="text-dark-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{activeAlerts}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Critical</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{criticalAlerts}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Unacknowledged</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{unacknowledged}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {['all', 'active', 'resolved', 'critical', 'warning'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-dark-400 hover:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={filteredAlerts}
          onRowClick={(row) => setViewAlert(row)}
          actions={(row) => (
            <>
              {row.status === 'active' && !row.acknowledged && (
                <button
                  onClick={(e) => { e.stopPropagation(); acknowledgeAlert(row); }}
                  className="p-1.5 text-dark-400 hover:text-yellow-400 transition-colors"
                  title="Acknowledge"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
              {row.status !== 'resolved' && (
                <button
                  onClick={(e) => { e.stopPropagation(); resolveAlert(row); }}
                  className="p-1.5 text-dark-400 hover:text-green-400 transition-colors"
                  title="Resolve"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )}
            </>
          )}
        />
      </div>

      {/* Create Alert Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Alert"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
              >
                {alertTypes.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input-field"
              >
                {priorities.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Alert title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="input-field min-h-[100px]"
              placeholder="Detailed alert message"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Source</label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="input-field"
              placeholder="e.g., Water Quality Sensor"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Alert</button>
          </div>
        </form>
      </Modal>

      {/* View Alert Modal */}
      <Modal
        isOpen={!!viewAlert}
        onClose={() => setViewAlert(null)}
        title="Alert Details"
        size="lg"
      >
        {viewAlert && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                viewAlert.type === 'critical' ? 'bg-red-500' :
                viewAlert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <h3 className="text-lg font-semibold text-white">{viewAlert.title}</h3>
            </div>

            <div className="bg-dark-900 p-4 rounded-lg">
              <p className="text-dark-200">{viewAlert.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-dark-400 text-sm">Source</span>
                <p className="text-white">{viewAlert.source}</p>
              </div>
              <div>
                <span className="text-dark-400 text-sm">Time</span>
                <p className="text-white">{format(new Date(viewAlert.timestamp), 'MMM d, yyyy HH:mm:ss')}</p>
              </div>
              <div>
                <span className="text-dark-400 text-sm">Priority</span>
                <div className="mt-1"><StatusBadge status={viewAlert.priority} /></div>
              </div>
              <div>
                <span className="text-dark-400 text-sm">Status</span>
                <div className="mt-1"><StatusBadge status={viewAlert.status} /></div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-dark-700">
              <button
                onClick={() => deleteAlert(viewAlert)}
                className="btn-danger"
              >
                Delete Alert
              </button>
              <div className="flex gap-2">
                {viewAlert.status === 'active' && !viewAlert.acknowledged && (
                  <button
                    onClick={() => { acknowledgeAlert(viewAlert); setViewAlert({ ...viewAlert, acknowledged: true, status: 'acknowledged' }); }}
                    className="btn-secondary"
                  >
                    Acknowledge
                  </button>
                )}
                {viewAlert.status !== 'resolved' && (
                  <button
                    onClick={() => { resolveAlert(viewAlert); setViewAlert(null); }}
                    className="btn-primary"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

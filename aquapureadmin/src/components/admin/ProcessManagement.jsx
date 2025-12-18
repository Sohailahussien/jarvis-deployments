import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { STORAGE_KEYS, mockProcesses } from '../../services/mockData';
import { auditService, AUDIT_ACTIONS, AUDIT_ENTITIES } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';

const stages = ['Pre-treatment', 'Desalination', 'Post-treatment', 'Distribution'];
const statuses = ['running', 'stopped', 'maintenance'];

export default function ProcessManagement() {
  const { user: currentUser } = useAuth();
  const [processes, setProcesses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    stage: 'Pre-treatment',
    status: 'running',
    flowRate: '',
    pressure: '',
    temperature: '',
    efficiency: ''
  });

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.PROCESSES);
    if (stored) {
      setProcesses(JSON.parse(stored));
    } else {
      setProcesses(mockProcesses);
      localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(mockProcesses));
    }
  };

  const saveProcesses = (updated) => {
    localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(updated));
    setProcesses(updated);
  };

  const openCreateModal = () => {
    setEditingProcess(null);
    setFormData({
      name: '',
      stage: 'Pre-treatment',
      status: 'running',
      flowRate: '',
      pressure: '',
      temperature: '',
      efficiency: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (process) => {
    setEditingProcess(process);
    setFormData({
      name: process.name,
      stage: process.stage,
      status: process.status,
      flowRate: process.flowRate,
      pressure: process.pressure,
      temperature: process.temperature,
      efficiency: process.efficiency
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProcess) {
      const updated = processes.map(p =>
        p.id === editingProcess.id ? {
          ...p,
          ...formData,
          flowRate: parseFloat(formData.flowRate),
          pressure: parseFloat(formData.pressure),
          temperature: parseFloat(formData.temperature),
          efficiency: parseFloat(formData.efficiency)
        } : p
      );
      saveProcesses(updated);
      auditService.log(
        AUDIT_ACTIONS.UPDATE,
        AUDIT_ENTITIES.PROCESS,
        editingProcess.id,
        { before: editingProcess, after: formData },
        currentUser.id,
        currentUser.name
      );
    } else {
      const newProcess = {
        id: `proc_${Date.now()}`,
        ...formData,
        flowRate: parseFloat(formData.flowRate),
        pressure: parseFloat(formData.pressure),
        temperature: parseFloat(formData.temperature),
        efficiency: parseFloat(formData.efficiency),
        startTime: new Date().toISOString()
      };
      saveProcesses([...processes, newProcess]);
      auditService.log(
        AUDIT_ACTIONS.CREATE,
        AUDIT_ENTITIES.PROCESS,
        newProcess.id,
        { process: newProcess },
        currentUser.id,
        currentUser.name
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = (process) => {
    const updated = processes.filter(p => p.id !== process.id);
    saveProcesses(updated);
    auditService.log(
      AUDIT_ACTIONS.DELETE,
      AUDIT_ENTITIES.PROCESS,
      process.id,
      { deletedProcess: process },
      currentUser.id,
      currentUser.name
    );
    setDeleteConfirm(null);
  };

  const toggleStatus = (process) => {
    const newStatus = process.status === 'running' ? 'stopped' : 'running';
    const updated = processes.map(p =>
      p.id === process.id ? {
        ...p,
        status: newStatus,
        startTime: newStatus === 'running' ? new Date().toISOString() : p.startTime
      } : p
    );
    saveProcesses(updated);
    auditService.log(
      AUDIT_ACTIONS.UPDATE,
      AUDIT_ENTITIES.PROCESS,
      process.id,
      { action: newStatus === 'running' ? 'started' : 'stopped' },
      currentUser.id,
      currentUser.name
    );
  };

  const columns = [
    { key: 'name', label: 'Process Name' },
    {
      key: 'stage',
      label: 'Stage',
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs ${
          val === 'Pre-treatment' ? 'bg-blue-500/20 text-blue-400' :
          val === 'Desalination' ? 'bg-purple-500/20 text-purple-400' :
          val === 'Post-treatment' ? 'bg-cyan-500/20 text-cyan-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {val}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'flowRate',
      label: 'Flow Rate',
      render: (val) => `${val} m³/h`
    },
    {
      key: 'pressure',
      label: 'Pressure',
      render: (val) => `${val} bar`
    },
    {
      key: 'temperature',
      label: 'Temp',
      render: (val) => `${val}°C`
    },
    {
      key: 'efficiency',
      label: 'Efficiency',
      render: (val) => (
        <span className={`font-medium ${val >= 95 ? 'text-green-400' : val >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
          {val}%
        </span>
      )
    },
    {
      key: 'startTime',
      label: 'Uptime',
      render: (val, row) => row.status === 'running' ? formatDistanceToNow(new Date(val)) : '-'
    }
  ];

  // Group by stage for visualization
  const byStage = stages.map(stage => ({
    stage,
    processes: processes.filter(p => p.stage === stage),
    running: processes.filter(p => p.stage === stage && p.status === 'running').length
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Process Management</h1>
          <p className="text-dark-400 mt-1">Monitor and control treatment processes</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Process
        </button>
      </div>

      {/* Stage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {byStage.map(({ stage, processes: stageProcesses, running }) => (
          <div key={stage} className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-dark-300">{stage}</h3>
              <span className={`w-2 h-2 rounded-full ${running > 0 ? 'bg-green-500' : 'bg-gray-500'}`} />
            </div>
            <p className="text-2xl font-bold text-white">{running} / {stageProcesses.length}</p>
            <p className="text-xs text-dark-400 mt-1">processes running</p>
          </div>
        ))}
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={processes}
          actions={(row) => (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); toggleStatus(row); }}
                className={`p-1.5 transition-colors ${row.status === 'running' ? 'text-green-400 hover:text-red-400' : 'text-dark-400 hover:text-green-400'}`}
                title={row.status === 'running' ? 'Stop' : 'Start'}
              >
                {row.status === 'running' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
                className="p-1.5 text-dark-400 hover:text-primary-400 transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteConfirm(row); }}
                className="p-1.5 text-dark-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProcess ? 'Edit Process' : 'Add Process'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Process Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., Seawater Intake"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="input-field"
              >
                {stages.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Flow Rate (m³/h)</label>
              <input
                type="number"
                step="0.1"
                value={formData.flowRate}
                onChange={(e) => setFormData({ ...formData, flowRate: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Pressure (bar)</label>
              <input
                type="number"
                step="0.1"
                value={formData.pressure}
                onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Efficiency (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.efficiency}
                onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingProcess ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <p className="text-dark-300 mb-6">
          Are you sure you want to delete <span className="text-white font-medium">{deleteConfirm?.name}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </motion.div>
  );
}

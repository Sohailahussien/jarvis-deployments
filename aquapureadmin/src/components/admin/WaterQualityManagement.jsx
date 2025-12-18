import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { STORAGE_KEYS, mockWaterQuality } from '../../services/mockData';
import { auditService, AUDIT_ACTIONS, AUDIT_ENTITIES } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const locations = ['Sarooj Main Output', 'Sarooj East Output', 'Sarooj Main Input', 'Distribution Point A', 'Distribution Point B'];
const statuses = ['passed', 'warning', 'failed', 'raw'];

// Water quality limits
const limits = {
  tds: { max: 150, warning: 130 },
  ph: { min: 6.5, max: 8.5 },
  turbidity: { max: 0.5, warning: 0.4 },
  chlorine: { min: 0.2, max: 1.0 }
};

export default function WaterQualityManagement() {
  const { user: currentUser } = useAuth();
  const [samples, setSamples] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSample, setEditingSample] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewSample, setViewSample] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    location: 'Sarooj Main Output',
    tds: '',
    ph: '',
    turbidity: '',
    chlorine: '',
    conductivity: ''
  });

  useEffect(() => {
    loadSamples();
  }, []);

  const loadSamples = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.WATER_QUALITY);
    if (stored) {
      setSamples(JSON.parse(stored));
    } else {
      setSamples(mockWaterQuality);
      localStorage.setItem(STORAGE_KEYS.WATER_QUALITY, JSON.stringify(mockWaterQuality));
    }
  };

  const saveSamples = (updated) => {
    localStorage.setItem(STORAGE_KEYS.WATER_QUALITY, JSON.stringify(updated));
    setSamples(updated);
  };

  const determineStatus = (data) => {
    if (data.location.includes('Input')) return 'raw';

    const tds = parseFloat(data.tds);
    const ph = parseFloat(data.ph);
    const turbidity = parseFloat(data.turbidity);
    const chlorine = parseFloat(data.chlorine);

    if (tds > limits.tds.max || ph < limits.ph.min || ph > limits.ph.max || turbidity > limits.turbidity.max) {
      return 'failed';
    }
    if (tds > limits.tds.warning || turbidity > limits.turbidity.warning || chlorine < limits.chlorine.min) {
      return 'warning';
    }
    return 'passed';
  };

  const generateSampleId = () => {
    const date = new Date();
    return `WQ-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
  };

  const openCreateModal = () => {
    setEditingSample(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      location: 'Sarooj Main Output',
      tds: '',
      ph: '',
      turbidity: '',
      chlorine: '',
      conductivity: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sample) => {
    setEditingSample(sample);
    setFormData({
      date: sample.date,
      location: sample.location,
      tds: sample.tds,
      ph: sample.ph,
      turbidity: sample.turbidity,
      chlorine: sample.chlorine,
      conductivity: sample.conductivity
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const status = determineStatus(formData);

    if (editingSample) {
      const updated = samples.map(s =>
        s.id === editingSample.id ? {
          ...s,
          ...formData,
          tds: parseFloat(formData.tds),
          ph: parseFloat(formData.ph),
          turbidity: parseFloat(formData.turbidity),
          chlorine: parseFloat(formData.chlorine),
          conductivity: parseFloat(formData.conductivity),
          status
        } : s
      );
      saveSamples(updated);
      auditService.log(
        AUDIT_ACTIONS.UPDATE,
        AUDIT_ENTITIES.WATER_QUALITY,
        editingSample.id,
        { before: editingSample, after: { ...formData, status } },
        currentUser.id,
        currentUser.name
      );
    } else {
      const newSample = {
        id: `wq_${Date.now()}`,
        sampleId: generateSampleId(),
        ...formData,
        tds: parseFloat(formData.tds),
        ph: parseFloat(formData.ph),
        turbidity: parseFloat(formData.turbidity),
        chlorine: parseFloat(formData.chlorine),
        conductivity: parseFloat(formData.conductivity),
        status
      };
      saveSamples([newSample, ...samples]);
      auditService.log(
        AUDIT_ACTIONS.CREATE,
        AUDIT_ENTITIES.WATER_QUALITY,
        newSample.id,
        { sample: newSample },
        currentUser.id,
        currentUser.name
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = (sample) => {
    const updated = samples.filter(s => s.id !== sample.id);
    saveSamples(updated);
    auditService.log(
      AUDIT_ACTIONS.DELETE,
      AUDIT_ENTITIES.WATER_QUALITY,
      sample.id,
      { deletedSample: sample },
      currentUser.id,
      currentUser.name
    );
    setDeleteConfirm(null);
  };

  const columns = [
    { key: 'sampleId', label: 'Sample ID' },
    {
      key: 'date',
      label: 'Date',
      render: (val) => format(new Date(val), 'MMM d, yyyy')
    },
    { key: 'location', label: 'Location' },
    {
      key: 'tds',
      label: 'TDS (ppm)',
      render: (val, row) => (
        <span className={row.status !== 'raw' && val > limits.tds.warning ? 'text-yellow-400' : ''}>
          {val}
        </span>
      )
    },
    {
      key: 'ph',
      label: 'pH',
      render: (val, row) => (
        <span className={row.status !== 'raw' && (val < 6.8 || val > 8.2) ? 'text-yellow-400' : ''}>
          {val}
        </span>
      )
    },
    { key: 'turbidity', label: 'Turbidity (NTU)' },
    { key: 'chlorine', label: 'Chlorine (mg/L)' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />
    }
  ];

  // Summary stats
  const passedCount = samples.filter(s => s.status === 'passed').length;
  const warningCount = samples.filter(s => s.status === 'warning').length;
  const avgTDS = samples.filter(s => s.status !== 'raw').length > 0
    ? Math.round(samples.filter(s => s.status !== 'raw').reduce((sum, s) => sum + s.tds, 0) / samples.filter(s => s.status !== 'raw').length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Water Quality Management</h1>
          <p className="text-dark-400 mt-1">Track and analyze water quality samples</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Sample
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-dark-400 text-sm">Total Samples</p>
          <p className="text-2xl font-bold text-white mt-1">{samples.length}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Passed</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{passedCount}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Warnings</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{warningCount}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Avg TDS (Output)</p>
          <p className="text-2xl font-bold text-white mt-1">{avgTDS} ppm</p>
        </div>
      </div>

      {/* Quality Limits Reference */}
      <div className="card mb-6">
        <h3 className="text-sm font-medium text-dark-300 mb-3">Quality Standards Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-dark-400">TDS:</span>
            <span className="text-dark-200 ml-2">&lt; {limits.tds.max} ppm</span>
          </div>
          <div>
            <span className="text-dark-400">pH:</span>
            <span className="text-dark-200 ml-2">{limits.ph.min} - {limits.ph.max}</span>
          </div>
          <div>
            <span className="text-dark-400">Turbidity:</span>
            <span className="text-dark-200 ml-2">&lt; {limits.turbidity.max} NTU</span>
          </div>
          <div>
            <span className="text-dark-400">Chlorine:</span>
            <span className="text-dark-200 ml-2">{limits.chlorine.min} - {limits.chlorine.max} mg/L</span>
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={samples}
          onRowClick={(row) => setViewSample(row)}
          actions={(row) => (
            <>
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
        title={editingSample ? 'Edit Sample' : 'Add Sample'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field"
              >
                {locations.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">TDS (ppm)</label>
              <input
                type="number"
                step="0.1"
                value={formData.tds}
                onChange={(e) => setFormData({ ...formData, tds: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">pH</label>
              <input
                type="number"
                step="0.01"
                value={formData.ph}
                onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Turbidity (NTU)</label>
              <input
                type="number"
                step="0.01"
                value={formData.turbidity}
                onChange={(e) => setFormData({ ...formData, turbidity: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Chlorine (mg/L)</label>
              <input
                type="number"
                step="0.01"
                value={formData.chlorine}
                onChange={(e) => setFormData({ ...formData, chlorine: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Conductivity (µS/cm)</label>
            <input
              type="number"
              value={formData.conductivity}
              onChange={(e) => setFormData({ ...formData, conductivity: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingSample ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* View Sample Modal */}
      <Modal
        isOpen={!!viewSample}
        onClose={() => setViewSample(null)}
        title={`Sample Details: ${viewSample?.sampleId}`}
      >
        {viewSample && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-dark-400 text-sm">Date</span>
                <p className="text-white">{format(new Date(viewSample.date), 'MMMM d, yyyy')}</p>
              </div>
              <div>
                <span className="text-dark-400 text-sm">Location</span>
                <p className="text-white">{viewSample.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-dark-900 p-3 rounded-lg">
                <span className="text-dark-400 text-xs">TDS</span>
                <p className="text-xl font-bold text-white">{viewSample.tds} <span className="text-sm font-normal text-dark-400">ppm</span></p>
              </div>
              <div className="bg-dark-900 p-3 rounded-lg">
                <span className="text-dark-400 text-xs">pH Level</span>
                <p className="text-xl font-bold text-white">{viewSample.ph}</p>
              </div>
              <div className="bg-dark-900 p-3 rounded-lg">
                <span className="text-dark-400 text-xs">Turbidity</span>
                <p className="text-xl font-bold text-white">{viewSample.turbidity} <span className="text-sm font-normal text-dark-400">NTU</span></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-900 p-3 rounded-lg">
                <span className="text-dark-400 text-xs">Chlorine</span>
                <p className="text-xl font-bold text-white">{viewSample.chlorine} <span className="text-sm font-normal text-dark-400">mg/L</span></p>
              </div>
              <div className="bg-dark-900 p-3 rounded-lg">
                <span className="text-dark-400 text-xs">Conductivity</span>
                <p className="text-xl font-bold text-white">{viewSample.conductivity} <span className="text-sm font-normal text-dark-400">µS/cm</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-dark-400 text-sm">Status:</span>
              <StatusBadge status={viewSample.status} />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <p className="text-dark-300 mb-6">
          Are you sure you want to delete sample <span className="text-white font-medium">{deleteConfirm?.sampleId}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </motion.div>
  );
}

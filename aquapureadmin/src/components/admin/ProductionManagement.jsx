import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { STORAGE_KEYS, mockProduction } from '../../services/mockData';
import { auditService, AUDIT_ACTIONS, AUDIT_ENTITIES } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const plants = [
  { id: 'P1', name: 'Sarooj Main' },
  { id: 'P2', name: 'Sarooj East' }
];

const statuses = ['operational', 'maintenance', 'stopped'];

export default function ProductionManagement() {
  const { user: currentUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    plantId: 'P1',
    waterProduced: '',
    waterTarget: '',
    energyUsed: '',
    status: 'operational'
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTION);
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      setRecords(mockProduction);
      localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(mockProduction));
    }
  };

  const saveRecords = (updated) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(updated));
    setRecords(updated);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      plantId: 'P1',
      waterProduced: '',
      waterTarget: '50000',
      energyUsed: '',
      status: 'operational'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      plantId: record.plantId,
      waterProduced: record.waterProduced,
      waterTarget: record.waterTarget,
      energyUsed: record.energyUsed,
      status: record.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const plant = plants.find(p => p.id === formData.plantId);
    const efficiency = ((parseFloat(formData.waterProduced) / parseFloat(formData.waterTarget)) * 100).toFixed(1);

    if (editingRecord) {
      const updated = records.map(r =>
        r.id === editingRecord.id ? {
          ...r,
          ...formData,
          plantName: plant.name,
          efficiency: parseFloat(efficiency),
          waterProduced: parseFloat(formData.waterProduced),
          waterTarget: parseFloat(formData.waterTarget),
          energyUsed: parseFloat(formData.energyUsed)
        } : r
      );
      saveRecords(updated);
      auditService.log(
        AUDIT_ACTIONS.UPDATE,
        AUDIT_ENTITIES.PRODUCTION,
        editingRecord.id,
        { before: editingRecord, after: formData },
        currentUser.id,
        currentUser.name
      );
    } else {
      const newRecord = {
        id: `prod_${Date.now()}`,
        ...formData,
        plantName: plant.name,
        efficiency: parseFloat(efficiency),
        waterProduced: parseFloat(formData.waterProduced),
        waterTarget: parseFloat(formData.waterTarget),
        energyUsed: parseFloat(formData.energyUsed)
      };
      saveRecords([newRecord, ...records]);
      auditService.log(
        AUDIT_ACTIONS.CREATE,
        AUDIT_ENTITIES.PRODUCTION,
        newRecord.id,
        { record: newRecord },
        currentUser.id,
        currentUser.name
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = (record) => {
    const updated = records.filter(r => r.id !== record.id);
    saveRecords(updated);
    auditService.log(
      AUDIT_ACTIONS.DELETE,
      AUDIT_ENTITIES.PRODUCTION,
      record.id,
      { deletedRecord: record },
      currentUser.id,
      currentUser.name
    );
    setDeleteConfirm(null);
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (val) => format(new Date(val), 'MMM d, yyyy')
    },
    { key: 'plantName', label: 'Plant' },
    {
      key: 'waterProduced',
      label: 'Produced (m³)',
      render: (val) => val.toLocaleString()
    },
    {
      key: 'waterTarget',
      label: 'Target (m³)',
      render: (val) => val.toLocaleString()
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
      key: 'energyUsed',
      label: 'Energy (kWh)',
      render: (val) => val.toLocaleString()
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />
    }
  ];

  // Calculate summary statistics
  const totalProduced = records.reduce((sum, r) => sum + r.waterProduced, 0);
  const avgEfficiency = records.length > 0
    ? (records.reduce((sum, r) => sum + r.efficiency, 0) / records.length).toFixed(1)
    : 0;
  const totalEnergy = records.reduce((sum, r) => sum + r.energyUsed, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Production Management</h1>
          <p className="text-dark-400 mt-1">Track and manage water production records</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-dark-400 text-sm">Total Production</p>
          <p className="text-2xl font-bold text-white mt-1">{totalProduced.toLocaleString()} m³</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Average Efficiency</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{avgEfficiency}%</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Total Energy Used</p>
          <p className="text-2xl font-bold text-white mt-1">{totalEnergy.toLocaleString()} kWh</p>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={records}
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
        title={editingRecord ? 'Edit Production Record' : 'Add Production Record'}
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
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Plant</label>
              <select
                value={formData.plantId}
                onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
                className="input-field"
              >
                {plants.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Water Produced (m³)</label>
              <input
                type="number"
                value={formData.waterProduced}
                onChange={(e) => setFormData({ ...formData, waterProduced: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Target (m³)</label>
              <input
                type="number"
                value={formData.waterTarget}
                onChange={(e) => setFormData({ ...formData, waterTarget: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Energy Used (kWh)</label>
              <input
                type="number"
                value={formData.energyUsed}
                onChange={(e) => setFormData({ ...formData, energyUsed: e.target.value })}
                className="input-field"
                required
              />
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
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingRecord ? 'Update' : 'Create'}</button>
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
        <p className="text-dark-300 mb-6">Are you sure you want to delete this production record? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger">Delete</button>
        </div>
      </Modal>
    </motion.div>
  );
}

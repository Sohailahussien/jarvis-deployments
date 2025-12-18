import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '../common/DataTable';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { STORAGE_KEYS, mockEquipment } from '../../services/mockData';
import { auditService, AUDIT_ACTIONS, AUDIT_ENTITIES } from '../../services/auditService';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const equipmentTypes = ['Reverse Osmosis', 'Pump', 'Filtration', 'Dosing', 'Disinfection', 'Sensor', 'Valve'];
const locations = ['Sarooj Main', 'Sarooj East', 'Distribution Network'];
const statuses = ['operational', 'maintenance', 'warning', 'critical'];

export default function EquipmentManagement() {
  const { user: currentUser } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Pump',
    location: 'Sarooj Main',
    status: 'operational',
    lastMaintenance: '',
    nextMaintenance: '',
    healthScore: 100,
    runtime: 0
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    if (stored) {
      setEquipment(JSON.parse(stored));
    } else {
      setEquipment(mockEquipment);
      localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(mockEquipment));
    }
  };

  const saveEquipment = (updated) => {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(updated));
    setEquipment(updated);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      type: 'Pump',
      location: 'Sarooj Main',
      status: 'operational',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: '',
      healthScore: 100,
      runtime: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      location: item.location,
      status: item.status,
      lastMaintenance: item.lastMaintenance,
      nextMaintenance: item.nextMaintenance,
      healthScore: item.healthScore,
      runtime: item.runtime
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingItem) {
      const updated = equipment.map(eq =>
        eq.id === editingItem.id ? {
          ...eq,
          ...formData,
          healthScore: parseInt(formData.healthScore),
          runtime: parseInt(formData.runtime)
        } : eq
      );
      saveEquipment(updated);
      auditService.log(
        AUDIT_ACTIONS.UPDATE,
        AUDIT_ENTITIES.EQUIPMENT,
        editingItem.id,
        { before: editingItem, after: formData },
        currentUser.id,
        currentUser.name
      );
    } else {
      const newItem = {
        id: `eq_${Date.now()}`,
        ...formData,
        healthScore: parseInt(formData.healthScore),
        runtime: parseInt(formData.runtime)
      };
      saveEquipment([...equipment, newItem]);
      auditService.log(
        AUDIT_ACTIONS.CREATE,
        AUDIT_ENTITIES.EQUIPMENT,
        newItem.id,
        { equipment: newItem },
        currentUser.id,
        currentUser.name
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = (item) => {
    const updated = equipment.filter(eq => eq.id !== item.id);
    saveEquipment(updated);
    auditService.log(
      AUDIT_ACTIONS.DELETE,
      AUDIT_ENTITIES.EQUIPMENT,
      item.id,
      { deletedEquipment: item },
      currentUser.id,
      currentUser.name
    );
    setDeleteConfirm(null);
  };

  const columns = [
    { key: 'name', label: 'Equipment Name' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />
    },
    {
      key: 'healthScore',
      label: 'Health',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${val >= 80 ? 'bg-green-500' : val >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${val}%` }}
            />
          </div>
          <span className={`text-sm ${val >= 80 ? 'text-green-400' : val >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {val}%
          </span>
        </div>
      )
    },
    {
      key: 'nextMaintenance',
      label: 'Next Maintenance',
      render: (val) => {
        const date = new Date(val);
        const isOverdue = date < new Date();
        return (
          <span className={isOverdue ? 'text-red-400' : 'text-dark-300'}>
            {format(date, 'MMM d, yyyy')}
            {isOverdue && ' (Overdue)'}
          </span>
        );
      }
    },
    {
      key: 'runtime',
      label: 'Runtime (hrs)',
      render: (val) => val.toLocaleString()
    }
  ];

  // Summary stats
  const operational = equipment.filter(e => e.status === 'operational').length;
  const needsMaintenance = equipment.filter(e => e.status === 'maintenance' || e.status === 'warning').length;
  const avgHealth = equipment.length > 0
    ? Math.round(equipment.reduce((sum, e) => sum + e.healthScore, 0) / equipment.length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipment Management</h1>
          <p className="text-dark-400 mt-1">Monitor and manage plant equipment</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Equipment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-dark-400 text-sm">Total Equipment</p>
          <p className="text-2xl font-bold text-white mt-1">{equipment.length}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Operational</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{operational}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Needs Attention</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{needsMaintenance}</p>
        </div>
        <div className="card">
          <p className="text-dark-400 text-sm">Avg Health Score</p>
          <p className="text-2xl font-bold text-white mt-1">{avgHealth}%</p>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={equipment}
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
        title={editingItem ? 'Edit Equipment' : 'Add Equipment'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Equipment Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g., RO Membrane Unit B"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
              >
                {equipmentTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
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
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Health Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.healthScore}
                onChange={(e) => setFormData({ ...formData, healthScore: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Last Maintenance</label>
              <input
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5">Next Maintenance</label>
              <input
                type="date"
                value={formData.nextMaintenance}
                onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Runtime (hours)</label>
            <input
              type="number"
              min="0"
              value={formData.runtime}
              onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingItem ? 'Update' : 'Create'}</button>
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

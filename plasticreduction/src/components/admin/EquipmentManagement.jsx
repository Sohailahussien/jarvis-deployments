import { useState } from 'react';
import useStore from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';

const EQUIPMENT_TYPES = [
  'Water Treatment',
  'Blow Molding',
  'Filling',
  'Capping',
  'Labeling',
  'Packaging',
  'Utilities',
  'Quality Control'
];

export default function EquipmentManagement() {
  const { equipment, updateEquipment, addEquipment, deleteEquipment } = useStore();
  const { addAuditEntry } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({});

  const filteredEquipment = filterType === 'all'
    ? equipment
    : equipment?.filter(e => e.type === filterType);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
  };

  const handleSave = () => {
    const updated = {
      ...formData,
      healthScore: parseInt(formData.healthScore) || 0,
      runtime: parseInt(formData.runtime) || 0
    };
    updateEquipment(editingId, updated);
    addAuditEntry('EQUIPMENT_UPDATED', `Updated equipment: ${updated.name}`, null);
    setEditingId(null);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      type: 'Water Treatment',
      status: 'operational',
      healthScore: 100,
      runtime: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: '',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleAddSave = () => {
    const newEquipment = {
      ...formData,
      id: `eq-${Date.now()}`,
      healthScore: parseInt(formData.healthScore) || 100,
      runtime: parseInt(formData.runtime) || 0
    };
    addEquipment(newEquipment);
    addAuditEntry('EQUIPMENT_ADDED', `Added new equipment: ${newEquipment.name}`, null);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    const item = equipment.find(e => e.id === id);
    deleteEquipment(id);
    addAuditEntry('EQUIPMENT_DELETED', `Deleted equipment: ${item?.name}`, null);
    setDeleteConfirm(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Equipment Management</h2>
          <p className="text-slate-400 text-sm mt-1">Track and manage plant equipment health and maintenance</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Equipment
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All ({equipment?.length || 0})
        </button>
        {EQUIPMENT_TYPES.map(type => {
          const count = equipment?.filter(e => e.type === type).length || 0;
          if (count === 0) return null;
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type} ({count})
            </button>
          );
        })}
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment?.map(item => (
          <div key={item.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            {editingId === item.id ? (
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Equipment name"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {EQUIPMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="operational">Operational</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Health Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.healthScore || ''}
                      onChange={(e) => setFormData({ ...formData, healthScore: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Runtime (hrs)</label>
                    <input
                      type="number"
                      value={formData.runtime || ''}
                      onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Last Maintenance</label>
                    <input
                      type="date"
                      value={formData.lastMaintenance || ''}
                      onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Next Maintenance</label>
                    <input
                      type="date"
                      value={formData.nextMaintenance || ''}
                      onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Notes..."
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <span className="text-slate-400 text-sm">{item.type}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">Health Score</span>
                      <span className={`font-medium ${getHealthColor(item.healthScore)}`}>
                        {item.healthScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.healthScore >= 80 ? 'bg-green-500' :
                          item.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.healthScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Runtime</span>
                      <span className="text-white">{item.runtime?.toLocaleString() || 0} hrs</span>
                    </div>
                    {item.nextMaintenance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Next Maintenance</span>
                        <span className="text-white">{item.nextMaintenance}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-700 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item)}
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Add New Equipment</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Equipment Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Reverse Osmosis Unit #3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Type</label>
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {EQUIPMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.status || 'operational'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="operational">Operational</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Health Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.healthScore || ''}
                    onChange={(e) => setFormData({ ...formData, healthScore: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Runtime (hours)</label>
                  <input
                    type="number"
                    value={formData.runtime || ''}
                    onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Last Maintenance</label>
                  <input
                    type="date"
                    value={formData.lastMaintenance || ''}
                    onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Next Maintenance</label>
                  <input
                    type="date"
                    value={formData.nextMaintenance || ''}
                    onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                  rows={3}
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
                onClick={handleAddSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Equipment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Delete Equipment</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

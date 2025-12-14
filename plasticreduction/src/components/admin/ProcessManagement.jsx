import { useState } from 'react';
import useStore from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';

export default function ProcessManagement() {
  const { processStages, updateProcessStage } = useStore();
  const { addAuditEntry } = useAuth();
  const [editingStage, setEditingStage] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEdit = (stage) => {
    setEditingStage(stage.id);
    setFormData({ ...stage });
  };

  const handleSave = () => {
    const updated = {
      ...formData,
      efficiency: parseFloat(formData.efficiency) || 0,
      throughput: parseInt(formData.throughput) || 0,
      temperature: parseFloat(formData.temperature) || 0,
      pressure: parseFloat(formData.pressure) || 0
    };
    updateProcessStage(editingStage, updated);
    addAuditEntry('PROCESS_STAGE_UPDATED', `Updated process stage: ${updated.name}`, null);
    setEditingStage(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getStageIcon = (stageName) => {
    const icons = {
      'Water Treatment': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      'Blow Molding': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      'Filling': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      'Capping': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      'Labeling': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      'Packaging': (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    };
    return icons[stageName] || icons['Water Treatment'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white">Process Stage Management</h2>
        <p className="text-slate-400 text-sm mt-1">Configure and monitor production process stages</p>
      </div>

      {/* Process Flow Diagram */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-white font-medium mb-4">Process Flow</h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {processStages?.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <div className={`
                px-4 py-2 rounded-lg border-2 transition-colors cursor-pointer
                ${stage.status === 'running'
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : stage.status === 'idle'
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
                    : stage.status === 'maintenance'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-red-500 bg-red-500/10 text-red-400'
                }
              `}>
                <span className="text-sm font-medium">{stage.name}</span>
                <div className="text-xs opacity-75">{stage.efficiency}%</div>
              </div>
              {index < processStages.length - 1 && (
                <svg className="w-6 h-6 text-slate-500 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {processStages?.map(stage => (
          <div key={stage.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            {editingStage === stage.id ? (
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Stage Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="running">Running</option>
                    <option value="idle">Idle</option>
                    <option value="stopped">Stopped</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Efficiency (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.efficiency || ''}
                      onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Throughput/hr</label>
                    <input
                      type="number"
                      value={formData.throughput || ''}
                      onChange={(e) => setFormData({ ...formData, throughput: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Temperature (C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.temperature || ''}
                      onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Pressure (bar)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.pressure || ''}
                      onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingStage(null)}
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        stage.status === 'running' ? 'bg-green-500/20 text-green-400' :
                        stage.status === 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
                        stage.status === 'maintenance' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {getStageIcon(stage.name)}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{stage.name}</h4>
                        <span className="text-slate-400 text-sm capitalize">{stage.status}</span>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(stage.status)}`} />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Efficiency</span>
                        <span className={`font-medium ${
                          stage.efficiency >= 90 ? 'text-green-400' :
                          stage.efficiency >= 75 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {stage.efficiency}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            stage.efficiency >= 90 ? 'bg-green-500' :
                            stage.efficiency >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${stage.efficiency}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Throughput</span>
                        <p className="text-white">{stage.throughput?.toLocaleString() || 0}/hr</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Temperature</span>
                        <p className="text-white">{stage.temperature || 0}°C</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Pressure</span>
                        <p className="text-white">{stage.pressure || 0} bar</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Quality</span>
                        <p className="text-green-400">{stage.quality || 99}%</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-700 flex justify-end">
                  <button
                    onClick={() => handleEdit(stage)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Configure
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

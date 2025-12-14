import { useState } from 'react';
import useStore from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';

const QUALITY_PARAMETERS = [
  { id: 'tds', label: 'TDS (ppm)', min: 0, max: 500, target: 50 },
  { id: 'ph', label: 'pH Level', min: 6.5, max: 8.5, target: 7.0 },
  { id: 'turbidity', label: 'Turbidity (NTU)', min: 0, max: 1, target: 0.1 },
  { id: 'chlorine', label: 'Chlorine (mg/L)', min: 0.2, max: 0.5, target: 0.3 },
  { id: 'hardness', label: 'Hardness (mg/L)', min: 0, max: 300, target: 100 },
  { id: 'alkalinity', label: 'Alkalinity (mg/L)', min: 20, max: 200, target: 80 }
];

export default function WaterQualityManagement() {
  const { waterQuality, updateWaterQuality, addWaterReading } = useStore();
  const { addAuditEntry } = useAuth();
  const [activeTab, setActiveTab] = useState('current');
  const [editingSource, setEditingSource] = useState(false);
  const [editingTreated, setEditingTreated] = useState(false);
  const [sourceForm, setSourceForm] = useState({});
  const [treatedForm, setTreatedForm] = useState({});
  const [newReading, setNewReading] = useState({
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    tds: '',
    ph: '',
    turbidity: ''
  });

  const handleEditSource = () => {
    setEditingSource(true);
    setSourceForm({ ...waterQuality?.source });
  };

  const handleSaveSource = () => {
    const updated = {
      ...sourceForm,
      tds: parseFloat(sourceForm.tds) || 0,
      ph: parseFloat(sourceForm.ph) || 0,
      turbidity: parseFloat(sourceForm.turbidity) || 0
    };
    updateWaterQuality('source', updated);
    addAuditEntry('WATER_QUALITY_UPDATED', `Updated source water quality data`, null);
    setEditingSource(false);
  };

  const handleEditTreated = () => {
    setEditingTreated(true);
    setTreatedForm({ ...waterQuality?.treated });
  };

  const handleSaveTreated = () => {
    const updated = {
      ...treatedForm,
      tds: parseFloat(treatedForm.tds) || 0,
      ph: parseFloat(treatedForm.ph) || 0,
      turbidity: parseFloat(treatedForm.turbidity) || 0
    };
    updateWaterQuality('treated', updated);
    addAuditEntry('WATER_QUALITY_UPDATED', `Updated treated water quality data`, null);
    setEditingTreated(false);
  };

  const handleAddReading = () => {
    if (!newReading.tds && !newReading.ph && !newReading.turbidity) return;

    const reading = {
      time: newReading.time,
      tds: parseFloat(newReading.tds) || 0,
      ph: parseFloat(newReading.ph) || 0,
      turbidity: parseFloat(newReading.turbidity) || 0
    };
    addWaterReading(reading);
    addAuditEntry('WATER_READING_ADDED', `Added water quality reading at ${reading.time}`, null);
    setNewReading({
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      tds: '',
      ph: '',
      turbidity: ''
    });
  };

  const getValueStatus = (value, param) => {
    const paramConfig = QUALITY_PARAMETERS.find(p => p.id === param);
    if (!paramConfig) return 'normal';

    if (value < paramConfig.min || value > paramConfig.max) return 'critical';
    const diff = Math.abs(value - paramConfig.target);
    const range = paramConfig.max - paramConfig.min;
    if (diff / range > 0.3) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white">Water Quality Management</h2>
        <p className="text-slate-400 text-sm mt-1">Monitor and manage water quality parameters</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('current')}
          className={`px-4 py-2 -mb-px transition-colors ${
            activeTab === 'current'
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Current Status
        </button>
        <button
          onClick={() => setActiveTab('readings')}
          className={`px-4 py-2 -mb-px transition-colors ${
            activeTab === 'readings'
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Hourly Readings
        </button>
        <button
          onClick={() => setActiveTab('standards')}
          className={`px-4 py-2 -mb-px transition-colors ${
            activeTab === 'standards'
              ? 'border-b-2 border-blue-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Quality Standards
        </button>
      </div>

      {/* Current Status Tab */}
      {activeTab === 'current' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Water */}
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">Source Water</h3>
                <p className="text-slate-400 text-sm">Raw water from well/municipal supply</p>
              </div>
              {!editingSource ? (
                <button
                  onClick={handleEditSource}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingSource(false)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSource}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
            <div className="p-4 space-y-4">
              {editingSource ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">TDS (ppm)</label>
                    <input
                      type="number"
                      value={sourceForm.tds || ''}
                      onChange={(e) => setSourceForm({ ...sourceForm, tds: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">pH Level</label>
                    <input
                      type="number"
                      step="0.1"
                      value={sourceForm.ph || ''}
                      onChange={(e) => setSourceForm({ ...sourceForm, ph: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Turbidity (NTU)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={sourceForm.turbidity || ''}
                      onChange={(e) => setSourceForm({ ...sourceForm, turbidity: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">TDS</span>
                    <span className={`px-2 py-1 rounded ${getStatusColor(getValueStatus(waterQuality?.source?.tds, 'tds'))}`}>
                      {waterQuality?.source?.tds || 0} ppm
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">pH Level</span>
                    <span className={`px-2 py-1 rounded ${getStatusColor(getValueStatus(waterQuality?.source?.ph, 'ph'))}`}>
                      {waterQuality?.source?.ph || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Turbidity</span>
                    <span className={`px-2 py-1 rounded ${getStatusColor(getValueStatus(waterQuality?.source?.turbidity, 'turbidity'))}`}>
                      {waterQuality?.source?.turbidity || 0} NTU
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Treated Water */}
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">Treated Water</h3>
                <p className="text-slate-400 text-sm">Post-RO/UV treatment quality</p>
              </div>
              {!editingTreated ? (
                <button
                  onClick={handleEditTreated}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTreated(false)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTreated}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
            <div className="p-4 space-y-4">
              {editingTreated ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">TDS (ppm)</label>
                    <input
                      type="number"
                      value={treatedForm.tds || ''}
                      onChange={(e) => setTreatedForm({ ...treatedForm, tds: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">pH Level</label>
                    <input
                      type="number"
                      step="0.1"
                      value={treatedForm.ph || ''}
                      onChange={(e) => setTreatedForm({ ...treatedForm, ph: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Turbidity (NTU)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={treatedForm.turbidity || ''}
                      onChange={(e) => setTreatedForm({ ...treatedForm, turbidity: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">TDS</span>
                    <span className={`px-2 py-1 rounded ${getStatusColor(getValueStatus(waterQuality?.treated?.tds, 'tds'))}`}>
                      {waterQuality?.treated?.tds || 0} ppm
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">pH Level</span>
                    <span className={`px-2 py-1 rounded ${getStatusColor(getValueStatus(waterQuality?.treated?.ph, 'ph'))}`}>
                      {waterQuality?.treated?.ph || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Turbidity</span>
                    <span className={`px-2 py-1 rounded ${getStatusColor(getValueStatus(waterQuality?.treated?.turbidity, 'turbidity'))}`}>
                      {waterQuality?.treated?.turbidity || 0} NTU
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hourly Readings Tab */}
      {activeTab === 'readings' && (
        <div className="space-y-6">
          {/* Add New Reading */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-white font-medium mb-4">Add New Reading</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Time</label>
                <input
                  type="time"
                  value={newReading.time}
                  onChange={(e) => setNewReading({ ...newReading, time: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">TDS (ppm)</label>
                <input
                  type="number"
                  value={newReading.tds}
                  onChange={(e) => setNewReading({ ...newReading, tds: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="45"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={newReading.ph}
                  onChange={(e) => setNewReading({ ...newReading, ph: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="7.0"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Turbidity (NTU)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newReading.turbidity}
                  onChange={(e) => setNewReading({ ...newReading, turbidity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.08"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddReading}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Add Reading
                </button>
              </div>
            </div>
          </div>

          {/* Readings Table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-medium">Today's Readings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">TDS (ppm)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">pH</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Turbidity (NTU)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {waterQuality?.hourlyReadings?.map((reading, index) => {
                    const tdsStatus = getValueStatus(reading.tds, 'tds');
                    const phStatus = getValueStatus(reading.ph, 'ph');
                    const turbStatus = getValueStatus(reading.turbidity, 'turbidity');
                    const worstStatus = tdsStatus === 'critical' || phStatus === 'critical' || turbStatus === 'critical'
                      ? 'critical'
                      : tdsStatus === 'warning' || phStatus === 'warning' || turbStatus === 'warning'
                        ? 'warning'
                        : 'normal';

                    return (
                      <tr key={index} className="hover:bg-slate-700/50">
                        <td className="px-4 py-3 text-white">{reading.time}</td>
                        <td className={`px-4 py-3 ${getStatusColor(tdsStatus).split(' ')[0]}`}>{reading.tds}</td>
                        <td className={`px-4 py-3 ${getStatusColor(phStatus).split(' ')[0]}`}>{reading.ph}</td>
                        <td className={`px-4 py-3 ${getStatusColor(turbStatus).split(' ')[0]}`}>{reading.turbidity}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(worstStatus)}`}>
                            {worstStatus === 'normal' ? 'Pass' : worstStatus === 'warning' ? 'Warning' : 'Fail'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quality Standards Tab */}
      {activeTab === 'standards' && (
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-white font-medium">Quality Standards Reference</h3>
            <p className="text-slate-400 text-sm">Acceptable ranges for water quality parameters</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Parameter</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Min</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Target</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Max</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Oman Standard</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">WHO Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {QUALITY_PARAMETERS.map(param => (
                  <tr key={param.id} className="hover:bg-slate-700/50">
                    <td className="px-4 py-3 text-white font-medium">{param.label}</td>
                    <td className="px-4 py-3 text-slate-300">{param.min}</td>
                    <td className="px-4 py-3 text-green-400">{param.target}</td>
                    <td className="px-4 py-3 text-slate-300">{param.max}</td>
                    <td className="px-4 py-3 text-blue-400">{param.max}</td>
                    <td className="px-4 py-3 text-purple-400">{param.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

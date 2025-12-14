import { useState } from 'react';
import useStore from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';

export default function ProductionManagement() {
  const { productionLines, updateProductionLine, dailyOutput, updateDailyOutput } = useStore();
  const { addAuditEntry } = useAuth();
  const [editingLine, setEditingLine] = useState(null);
  const [editingOutput, setEditingOutput] = useState(false);
  const [lineFormData, setLineFormData] = useState({});
  const [outputFormData, setOutputFormData] = useState({});

  const handleEditLine = (line) => {
    setEditingLine(line.id);
    setLineFormData({ ...line });
  };

  const handleSaveLine = () => {
    const updatedLine = {
      ...lineFormData,
      speed: parseInt(lineFormData.speed) || 0,
      efficiency: parseFloat(lineFormData.efficiency) || 0
    };
    updateProductionLine(editingLine, updatedLine);
    addAuditEntry('PRODUCTION_LINE_UPDATED', `Updated production line: ${updatedLine.name}`, null);
    setEditingLine(null);
  };

  const handleEditOutput = () => {
    setEditingOutput(true);
    setOutputFormData({ ...dailyOutput });
  };

  const handleSaveOutput = () => {
    const updated = {
      ...outputFormData,
      bottles: parseInt(outputFormData.bottles) || 0,
      target: parseInt(outputFormData.target) || 0,
      quality: parseFloat(outputFormData.quality) || 0,
      waste: parseFloat(outputFormData.waste) || 0
    };
    updateDailyOutput(updated);
    addAuditEntry('DAILY_OUTPUT_UPDATED', `Updated daily output: ${updated.bottles} bottles`, null);
    setEditingOutput(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-white">Production Management</h2>
        <p className="text-slate-400 text-sm mt-1">Manage production lines and daily output targets</p>
      </div>

      {/* Daily Output Summary */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Daily Output Summary</h3>
          {!editingOutput ? (
            <button
              onClick={handleEditOutput}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditingOutput(false)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOutput}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {editingOutput ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Bottles Produced</label>
              <input
                type="number"
                value={outputFormData.bottles || ''}
                onChange={(e) => setOutputFormData({ ...outputFormData, bottles: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Daily Target</label>
              <input
                type="number"
                value={outputFormData.target || ''}
                onChange={(e) => setOutputFormData({ ...outputFormData, target: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Quality Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={outputFormData.quality || ''}
                onChange={(e) => setOutputFormData({ ...outputFormData, quality: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Waste Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={outputFormData.waste || ''}
                onChange={(e) => setOutputFormData({ ...outputFormData, waste: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Bottles Produced</p>
              <p className="text-2xl font-bold text-white">{dailyOutput?.bottles?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Daily Target</p>
              <p className="text-2xl font-bold text-white">{dailyOutput?.target?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Quality Rate</p>
              <p className="text-2xl font-bold text-green-400">{dailyOutput?.quality || 0}%</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Waste Rate</p>
              <p className="text-2xl font-bold text-yellow-400">{dailyOutput?.waste || 0}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Production Lines */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-medium text-white">Production Lines</h3>
          <p className="text-slate-400 text-sm mt-1">Manage and monitor individual production lines</p>
        </div>

        <div className="divide-y divide-slate-700">
          {productionLines?.map(line => (
            <div key={line.id} className="p-6">
              {editingLine === line.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Line Name</label>
                      <input
                        type="text"
                        value={lineFormData.name || ''}
                        onChange={(e) => setLineFormData({ ...lineFormData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Status</label>
                      <select
                        value={lineFormData.status || 'idle'}
                        onChange={(e) => setLineFormData({ ...lineFormData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="running">Running</option>
                        <option value="idle">Idle</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Speed (bottles/min)</label>
                      <input
                        type="number"
                        value={lineFormData.speed || ''}
                        onChange={(e) => setLineFormData({ ...lineFormData, speed: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Efficiency (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={lineFormData.efficiency || ''}
                        onChange={(e) => setLineFormData({ ...lineFormData, efficiency: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Product Type</label>
                      <input
                        type="text"
                        value={lineFormData.product || ''}
                        onChange={(e) => setLineFormData({ ...lineFormData, product: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Shift</label>
                      <select
                        value={lineFormData.shift || 'A'}
                        onChange={(e) => setLineFormData({ ...lineFormData, shift: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="A">Shift A (Morning)</option>
                        <option value="B">Shift B (Evening)</option>
                        <option value="C">Shift C (Night)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Operator</label>
                      <input
                        type="text"
                        value={lineFormData.operator || ''}
                        onChange={(e) => setLineFormData({ ...lineFormData, operator: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingLine(null)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveLine}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(line.status)}`} />
                    <div>
                      <h4 className="text-white font-medium">{line.name}</h4>
                      <p className="text-slate-400 text-sm">{line.product || 'No product assigned'}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Status</p>
                      <p className="text-white capitalize">{line.status}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Speed</p>
                      <p className="text-white">{line.speed} /min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Efficiency</p>
                      <p className={`font-medium ${line.efficiency >= 90 ? 'text-green-400' : line.efficiency >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {line.efficiency}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-xs">Shift</p>
                      <p className="text-white">{line.shift || 'A'}</p>
                    </div>
                    <button
                      onClick={() => handleEditLine(line)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add New Line Button */}
      <button
        onClick={() => {
          const newLine = {
            id: `line-${Date.now()}`,
            name: `Line ${(productionLines?.length || 0) + 1}`,
            status: 'idle',
            speed: 0,
            efficiency: 0,
            product: '',
            shift: 'A',
            operator: ''
          };
          useStore.getState().addProductionLine(newLine);
          addAuditEntry('PRODUCTION_LINE_ADDED', `Added new production line: ${newLine.name}`, null);
        }}
        className="w-full py-3 border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Production Line
      </button>
    </div>
  );
}

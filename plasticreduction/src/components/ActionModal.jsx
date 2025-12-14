import React, { useState } from 'react'
import { X, Plus, CheckCircle, Target, Clock, DollarSign, TrendingDown } from 'lucide-react'
import useStore from '../store/useStore'

function ActionModal({ strategy, onClose }) {
  const [newAction, setNewAction] = useState('')
  const { addAction, activeActions, toggleAction, removeAction, updateStrategy } = useStore()

  const strategyActions = activeActions.filter(a => a.strategyId === strategy.id)

  const handleAddAction = () => {
    if (newAction.trim()) {
      addAction({
        strategyId: strategy.id,
        text: newAction.trim(),
        completed: false
      })
      setNewAction('')
    }
  }

  const handleUpdateProgress = (increment) => {
    const newPercent = Math.max(0, Math.min(100, strategy.implementedPercent + increment))
    let newStatus = strategy.status
    if (newPercent === 100) newStatus = 'Completed'
    else if (newPercent > 0) newStatus = 'In Progress'
    else newStatus = 'Planned'

    updateStrategy(strategy.id, { implementedPercent: newPercent, status: newStatus })
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                strategy.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                strategy.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {strategy.status}
              </span>
              <h2 className="text-xl font-bold text-white">{strategy.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-400 mb-6">{strategy.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <TrendingDown className="w-5 h-5 text-green-400 mb-2" />
              <p className="text-xs text-gray-500">Potential Reduction</p>
              <p className="text-lg font-bold text-white">{strategy.potentialReduction.toLocaleString()} kg</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <DollarSign className="w-5 h-5 text-cyan-400 mb-2" />
              <p className="text-xs text-gray-500">Estimated Cost</p>
              <p className="text-lg font-bold text-white">${strategy.cost.toLocaleString()}</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <Clock className="w-5 h-5 text-yellow-400 mb-2" />
              <p className="text-xs text-gray-500">ROI Period</p>
              <p className="text-lg font-bold text-white">{strategy.roi} months</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <Target className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-xs text-gray-500">Difficulty</p>
              <p className="text-lg font-bold text-white">{strategy.difficulty}</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Implementation Progress</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateProgress(-10)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors"
                >
                  -10%
                </button>
                <span className="text-white font-bold w-12 text-center">{strategy.implementedPercent}%</span>
                <button
                  onClick={() => handleUpdateProgress(10)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm text-white transition-colors"
                >
                  +10%
                </button>
              </div>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  strategy.implementedPercent === 100 ? 'bg-green-500' :
                  strategy.implementedPercent > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${strategy.implementedPercent}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Action Items</h3>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAction()}
                placeholder="Add a new action item..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddAction}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {strategyActions.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No action items yet. Add some to track your progress!</p>
            ) : (
              <div className="space-y-2">
                {strategyActions.map((action) => (
                  <div
                    key={action.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      action.completed
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-gray-900/50 border-gray-700'
                    }`}
                  >
                    <button
                      onClick={() => toggleAction(action.id)}
                      className={`p-1 rounded-full transition-colors ${
                        action.completed ? 'text-green-400' : 'text-gray-500 hover:text-gray-400'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <span className={`flex-1 ${action.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                      {action.text}
                    </span>
                    <button
                      onClick={() => removeAction(action.id)}
                      className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActionModal

import React from 'react'
import { CheckCircle, Clock, AlertCircle, PlayCircle, ArrowRight } from 'lucide-react'
import useStore from '../store/useStore'

function StrategyCard({ strategy, onSelect }) {
  const updateStrategy = useStore((state) => state.updateStrategy)

  const statusConfig = {
    'Completed': { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
    'In Progress': { icon: PlayCircle, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    'Planned': { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    'Research': { icon: AlertCircle, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  }

  const difficultyColors = {
    'Easy': 'text-green-400 bg-green-500/20',
    'Medium': 'text-yellow-400 bg-yellow-500/20',
    'Hard': 'text-red-400 bg-red-500/20',
  }

  const StatusIcon = statusConfig[strategy.status]?.icon || Clock

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig[strategy.status]?.bg} ${statusConfig[strategy.status]?.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {strategy.status}
        </div>
        <span className={`px-2 py-0.5 rounded text-xs ${difficultyColors[strategy.difficulty]}`}>
          {strategy.difficulty}
        </span>
      </div>

      <h3 className="text-white font-semibold mb-2 leading-tight">{strategy.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{strategy.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-900/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Potential Reduction</p>
          <p className="text-lg font-bold text-green-400">{strategy.potentialReduction.toLocaleString()} <span className="text-xs font-normal">kg/yr</span></p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">ROI Period</p>
          <p className="text-lg font-bold text-cyan-400">{strategy.roi} <span className="text-xs font-normal">months</span></p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-500">Implementation Progress</span>
          <span className="text-gray-400">{strategy.implementedPercent}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              strategy.implementedPercent === 100 ? 'bg-green-500' :
              strategy.implementedPercent > 50 ? 'bg-blue-500' :
              strategy.implementedPercent > 0 ? 'bg-yellow-500' : 'bg-gray-600'
            }`}
            style={{ width: `${strategy.implementedPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
        <span className="text-xs text-gray-500">
          Est. Cost: <span className="text-gray-400">${strategy.cost.toLocaleString()}</span>
        </span>
        <button
          onClick={() => onSelect && onSelect(strategy)}
          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Details <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default StrategyCard

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function KPICard({ title, value, unit, change, changeLabel, icon: Icon, color = 'blue', target, targetLabel }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
  }

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
  }

  const isPositive = change > 0
  const isNegative = change < 0

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gray-800/50 ${iconColors[color]}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> :
             isNegative ? <TrendingDown className="w-4 h-4" /> :
             <Minus className="w-4 h-4" />}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <div className="mb-1">
        <span className="text-3xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-gray-400 ml-1 text-lg">{unit}</span>}
      </div>

      <p className="text-gray-400 text-sm">{title}</p>

      {changeLabel && (
        <p className="text-xs text-gray-500 mt-1">{changeLabel}</p>
      )}

      {target !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">{targetLabel || 'Target'}</span>
            <span className="text-gray-400">{target}%</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                value >= target ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default KPICard

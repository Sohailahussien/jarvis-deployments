import { useState } from 'react'
import {
  Settings, AlertTriangle, CheckCircle, Wrench,
  Clock, Activity, ChevronDown, Filter
} from 'lucide-react'
import useStore from '../store/useStore'

const typeColors = {
  treatment: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  production: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  packaging: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  utility: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
}

const statusIcons = {
  running: { icon: CheckCircle, color: 'text-green-400' },
  maintenance: { icon: Wrench, color: 'text-amber-400' },
  stopped: { icon: AlertTriangle, color: 'text-red-400' },
}

function EquipmentHealthPanel() {
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('health')
  const { equipment, getEquipmentHealth } = useStore()
  const health = getEquipmentHealth()

  const filteredEquipment = equipment
    .filter(e => filterType === 'all' || e.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'health') return a.health - b.health
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'maintenance') return new Date(a.nextMaintenance) - new Date(b.nextMaintenance)
      return 0
    })

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-400'
    if (health >= 80) return 'text-yellow-400'
    if (health >= 70) return 'text-amber-400'
    return 'text-red-400'
  }

  const getHealthBarColor = (health) => {
    if (health >= 90) return 'bg-green-500'
    if (health >= 80) return 'bg-yellow-500'
    if (health >= 70) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getDaysUntilMaintenance = (date) => {
    const today = new Date()
    const maintenanceDate = new Date(date)
    const diff = Math.ceil((maintenanceDate - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">Equipment Health</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-1.5 pr-8 text-gray-300 text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Types</option>
              <option value="treatment">Treatment</option>
              <option value="production">Production</option>
              <option value="packaging">Packaging</option>
              <option value="utility">Utility</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Health Summary */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-green-400">{health.running}</p>
          <p className="text-xs text-gray-500">Running</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-amber-400">{health.maintenance}</p>
          <p className="text-xs text-gray-500">In Maintenance</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-blue-400">{health.avgHealth.toFixed(0)}%</p>
          <p className="text-xs text-gray-500">Avg Health</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-red-400">{health.needsMaintenance}</p>
          <p className="text-xs text-gray-500">Needs Attention</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-purple-400">{health.upcomingMaintenance}</p>
          <p className="text-xs text-gray-500">Due This Week</p>
        </div>
      </div>

      {/* Equipment List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {filteredEquipment.map(eq => {
          const StatusIcon = statusIcons[eq.status]?.icon || Activity
          const statusColor = statusIcons[eq.status]?.color || 'text-gray-400'
          const typeStyle = typeColors[eq.type] || typeColors.utility
          const daysUntil = getDaysUntilMaintenance(eq.nextMaintenance)

          return (
            <div
              key={eq.id}
              className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-700/30 hover:bg-gray-900/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-lg ${typeStyle.bg} flex items-center justify-center`}>
                  <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium truncate">{eq.name}</p>
                    <span className={`px-1.5 py-0.5 text-xs rounded ${typeStyle.bg} ${typeStyle.text}`}>
                      {eq.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {eq.runtime}h runtime
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Health Bar */}
                <div className="w-24">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Health</span>
                    <span className={getHealthColor(eq.health)}>{eq.health}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getHealthBarColor(eq.health)} rounded-full transition-all`}
                      style={{ width: `${eq.health}%` }}
                    />
                  </div>
                </div>

                {/* Next Maintenance */}
                <div className="w-20 text-right">
                  <p className={`text-xs ${
                    daysUntil <= 0 ? 'text-red-400' :
                    daysUntil <= 7 ? 'text-amber-400' :
                    'text-gray-400'
                  }`}>
                    {daysUntil <= 0 ? 'Overdue' :
                     daysUntil === 1 ? 'Tomorrow' :
                     `${daysUntil} days`}
                  </p>
                  <p className="text-xs text-gray-600">maintenance</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Critical Alerts */}
      {health.needsMaintenance > 0 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">{health.needsMaintenance} equipment items need immediate attention</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-6">
            Health below 80% threshold. Schedule maintenance to prevent unplanned downtime.
          </p>
        </div>
      )}
    </div>
  )
}

export default EquipmentHealthPanel

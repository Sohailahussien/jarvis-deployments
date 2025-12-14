import { useState } from 'react'
import {
  Activity, AlertTriangle, CheckCircle, Settings,
  TrendingUp, Thermometer, Gauge, Droplets,
  Package, Tag, Box, ChevronRight
} from 'lucide-react'
import useStore from '../store/useStore'

const stageIcons = {
  waterTreatment: Droplets,
  blowMolding: Settings,
  filling: Droplets,
  capping: Package,
  labeling: Tag,
  packaging: Box,
}

const statusColors = {
  optimal: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  warning: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
}

function ProcessOptimizationPanel() {
  const [selectedStage, setSelectedStage] = useState(null)
  const { processStages, getProcessHealth } = useStore()
  const health = getProcessHealth()

  const stages = Object.entries(processStages)

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Process Optimization</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-gray-400">Optimal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-gray-400">Warning</span>
          </div>
        </div>
      </div>

      {/* Process Health Summary */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-blue-400">{health.avgEfficiency.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">Avg Efficiency</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-green-400">{health.avgUptime.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">Avg Uptime</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-amber-400">{health.warnings}</p>
          <p className="text-xs text-gray-500">Warnings</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-emerald-400">{health.total - health.warnings - health.critical}</p>
          <p className="text-xs text-gray-500">Optimal</p>
        </div>
      </div>

      {/* Process Flow */}
      <div className="space-y-2">
        {stages.map(([key, stage], index) => {
          const Icon = stageIcons[key] || Activity
          const colors = statusColors[stage.status] || statusColors.optimal
          const isSelected = selectedStage === key

          return (
            <div key={key}>
              <button
                onClick={() => setSelectedStage(isSelected ? null : key)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isSelected
                    ? `${colors.bg} ${colors.border}`
                    : 'bg-gray-900/30 border-gray-700/50 hover:bg-gray-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{stage.name}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={colors.text}>{stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-400">{stage.efficiency}% eff</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">{stage.uptime}%</p>
                    <p className="text-xs text-gray-500">Uptime</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Expanded Stage Details */}
              {isSelected && (
                <div className="mt-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Stage Parameters</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(stage.metrics).map(([metricKey, value]) => {
                      const metricLabel = metricKey
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())

                      let unit = ''
                      if (metricKey.includes('Temp')) unit = '°C'
                      else if (metricKey.includes('Pressure') || metricKey.includes('pressure')) unit = ' bar'
                      else if (metricKey.includes('Rate') && !metricKey.includes('reject')) unit = '/hr'
                      else if (metricKey.includes('Rate') || metricKey.includes('Accuracy') || metricKey.includes('Pass')) unit = '%'
                      else if (metricKey.includes('Speed')) unit = '/hr'
                      else if (metricKey.includes('flowRate')) unit = ' m³/hr'
                      else if (metricKey.includes('tds') || metricKey.includes('conductivity')) unit = ' ppm'
                      else if (metricKey.includes('turbidity')) unit = ' NTU'
                      else if (metricKey.includes('Dose')) unit = ' mJ/cm²'
                      else if (metricKey.includes('Time')) unit = 's'
                      else if (metricKey.includes('headspace')) unit = ' mm'
                      else if (metricKey.includes('Tension') || metricKey.includes('Strength')) unit = '%'
                      else if (metricKey.includes('torque')) unit = ' Nm'

                      return (
                        <div key={metricKey} className="bg-gray-800/50 rounded p-2">
                          <p className="text-xs text-gray-500">{metricLabel}</p>
                          <p className="text-white font-medium">
                            {typeof value === 'number' ? value.toLocaleString() : value}{unit}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  {stage.status === 'warning' && (
                    <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-400 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">Attention Required</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {key === 'capping' && 'Torque variance exceeds threshold. Check capper head calibration.'}
                        {key === 'labeling' && 'Label alignment drift detected. Vision system recalibration needed.'}
                        {key === 'blowMolding' && 'Reject rate above target. Check preform quality and mold condition.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-px h-4 bg-gray-700" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProcessOptimizationPanel

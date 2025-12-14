import { useState } from 'react'
import {
  Droplets, CheckCircle, AlertTriangle, TrendingUp,
  Beaker, Shield, FileCheck
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import useStore from '../store/useStore'

function WaterQualityPanel() {
  const [activeTab, setActiveTab] = useState('live')
  const { waterQuality } = useStore()

  const qualityParams = [
    { key: 'tds', label: 'TDS', source: waterQuality.source.tds, treated: waterQuality.postTreatment.tds, unit: 'ppm', limit: 50, good: true },
    { key: 'ph', label: 'pH', source: waterQuality.source.ph, treated: waterQuality.postTreatment.ph, unit: '', limit: '6.5-8.5', good: true },
    { key: 'hardness', label: 'Hardness', source: waterQuality.source.hardness, treated: waterQuality.postTreatment.hardness, unit: 'ppm', limit: 100, good: true },
    { key: 'alkalinity', label: 'Alkalinity', source: waterQuality.source.alkalinity, treated: waterQuality.postTreatment.alkalinity, unit: 'ppm', limit: 120, good: true },
    { key: 'sulfate', label: 'Sulfate', source: waterQuality.source.sulfate, treated: waterQuality.postTreatment.sulfate, unit: 'ppm', limit: 250, good: true },
    { key: 'chloride', label: 'Chloride', source: waterQuality.source.chloride, treated: waterQuality.postTreatment.chloride, unit: 'ppm', limit: 250, good: true },
    { key: 'nitrate', label: 'Nitrate', source: waterQuality.source.nitrate, treated: waterQuality.postTreatment.nitrate, unit: 'ppm', limit: 50, good: true },
  ]

  const complianceItems = [
    { name: 'Oman Standard (OS)', passed: waterQuality.compliance.omanStandard },
    { name: 'WHO Guidelines', passed: waterQuality.compliance.whoGuidelines },
    { name: 'GCC Standard', passed: waterQuality.compliance.gccStandard },
  ]

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold">Water Quality Monitoring</h3>
        </div>
        <div className="flex gap-1 bg-gray-900/50 rounded-lg p-1">
          {['live', 'comparison', 'compliance'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Live Readings Tab */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          {/* Current Readings Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterQuality.hourlyReadings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
                <YAxis yAxisId="left" stroke="#6B7280" fontSize={10} domain={[35, 50]} />
                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={10} domain={[6.8, 7.6]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <ReferenceLine yAxisId="left" y={50} stroke="#ef4444" strokeDasharray="5 5" label="" />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tds"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={false}
                  name="TDS (ppm)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ph"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                  name="pH"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="turbidity"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={false}
                  name="Turbidity (NTU x100)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-cyan-500/20">
              <p className="text-2xl font-bold text-cyan-400">{waterQuality.postTreatment.tds}</p>
              <p className="text-xs text-gray-500">TDS (ppm)</p>
              <p className="text-xs text-green-400">Limit: 50</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-purple-500/20">
              <p className="text-2xl font-bold text-purple-400">{waterQuality.postTreatment.ph}</p>
              <p className="text-xs text-gray-500">pH Level</p>
              <p className="text-xs text-green-400">Range: 6.5-8.5</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-emerald-500/20">
              <p className="text-2xl font-bold text-emerald-400">0.15</p>
              <p className="text-xs text-gray-500">Turbidity (NTU)</p>
              <p className="text-xs text-green-400">Limit: 0.5</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-400">0.3</p>
              <p className="text-xs text-gray-500">Chlorine (ppm)</p>
              <p className="text-xs text-green-400">Range: 0.2-0.5</p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400 px-2">
            <span>Parameter</span>
            <div className="flex gap-8">
              <span>Source</span>
              <span>Post-Treatment</span>
              <span>Reduction</span>
            </div>
          </div>
          {qualityParams.map(param => {
            const reduction = ((param.source - param.treated) / param.source * 100).toFixed(0)
            return (
              <div
                key={param.key}
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-gray-400" />
                  <span className="text-white text-sm">{param.label}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-amber-400 w-16 text-right">{param.source} {param.unit}</span>
                  <span className="text-cyan-400 w-16 text-right">{param.treated} {param.unit}</span>
                  <div className="flex items-center gap-1 w-16 justify-end">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">{reduction}%</span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Treatment Effectiveness Summary */}
          <div className="mt-4 p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 font-medium">Treatment Effectiveness</p>
                <p className="text-xs text-gray-400 mt-1">Average contaminant reduction across all parameters</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-cyan-400">86.9%</p>
                <p className="text-xs text-green-400">Excellent</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          {/* Compliance Status */}
          <div className="grid grid-cols-3 gap-3">
            {complianceItems.map(item => (
              <div
                key={item.name}
                className={`p-4 rounded-lg border ${
                  item.passed
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {item.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={item.passed ? 'text-green-400' : 'text-red-400'}>
                    {item.passed ? 'Compliant' : 'Non-Compliant'}
                  </span>
                </div>
                <p className="text-white text-sm font-medium">{item.name}</p>
              </div>
            ))}
          </div>

          {/* Lab Testing Schedule */}
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="w-4 h-4 text-blue-400" />
              <h4 className="text-white font-medium">Lab Testing Schedule</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Last Lab Test</p>
                <p className="text-white font-medium">{waterQuality.compliance.lastLabTest}</p>
                <p className="text-xs text-green-400 mt-1">All parameters passed</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Next Scheduled Test</p>
                <p className="text-white font-medium">{waterQuality.compliance.nextLabTest}</p>
                <p className="text-xs text-amber-400 mt-1">5 days remaining</p>
              </div>
            </div>
          </div>

          {/* Certification Status */}
          <div className="p-4 bg-gradient-to-r from-emerald-900/20 to-green-900/20 rounded-lg border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-emerald-400 font-medium">ISO 22000:2018 Certified</p>
                <p className="text-xs text-gray-400">Food Safety Management System - Valid until Dec 2025</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WaterQualityPanel

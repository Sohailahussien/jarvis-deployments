import { useState } from 'react'
import {
  BarChart3, TrendingUp, Target, Calendar
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend, ComposedChart
} from 'recharts'
import useStore from '../store/useStore'

function ProductionOutputPanel() {
  const [viewMode, setViewMode] = useState('daily')
  const { productionOutput, getPlantOEE } = useStore()
  const oee = getPlantOEE()

  const data = viewMode === 'daily' ? productionOutput.daily : productionOutput.monthly.filter(m => m.output !== null)

  const totalOutput = data.reduce((acc, d) => acc + (d.bottles || d.output || 0), 0)
  const totalTarget = data.reduce((acc, d) => acc + (d.target || 0), 0)
  const avgEfficiency = totalOutput / totalTarget * 100

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-semibold">Production Output</h3>
        </div>
        <div className="flex gap-1 bg-gray-900/50 rounded-lg p-1">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              viewMode === 'daily'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              viewMode === 'monthly'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            YTD
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-emerald-400">
            {viewMode === 'daily'
              ? (totalOutput / 1000).toFixed(0) + 'K'
              : (totalOutput / 1000000).toFixed(1) + 'M'}
          </p>
          <p className="text-xs text-gray-500">Total Output</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-blue-400">
            {viewMode === 'daily'
              ? (totalTarget / 1000).toFixed(0) + 'K'
              : (totalTarget / 1000000).toFixed(1) + 'M'}
          </p>
          <p className="text-xs text-gray-500">Target</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className={`text-xl font-bold ${avgEfficiency >= 100 ? 'text-green-400' : avgEfficiency >= 95 ? 'text-yellow-400' : 'text-red-400'}`}>
            {avgEfficiency.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">Achievement</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-purple-400">{(oee * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-500">Plant OEE</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'daily' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} tickFormatter={(v) => `${v/1000}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={(value) => [value.toLocaleString(), '']}
              />
              <Bar dataKey="bottles" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual" />
              <Bar dataKey="target" fill="#374151" radius={[4, 4, 0, 0]} name="Target" />
            </BarChart>
          ) : (
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
              <YAxis yAxisId="left" stroke="#6B7280" fontSize={11} tickFormatter={(v) => `${v/1000000}M`} />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={11} domain={[70, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={(value, name) => {
                  if (name === 'OEE') return [`${value}%`, name]
                  return [value.toLocaleString(), name]
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="output" fill="#10b981" radius={[4, 4, 0, 0]} name="Output" />
              <Bar yAxisId="left" dataKey="target" fill="#374151" radius={[4, 4, 0, 0]} name="Target" />
              <Line yAxisId="right" type="monotone" dataKey="oee" stroke="#a78bfa" strokeWidth={2} name="OEE" dot={{ fill: '#a78bfa', r: 3 }} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Performance Indicator */}
      <div className="mt-4 flex items-center justify-between p-3 bg-gradient-to-r from-emerald-900/20 to-green-900/20 rounded-lg border border-emerald-500/20">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">Production Trend</span>
        </div>
        <div className="text-right">
          <p className="text-white text-sm font-medium">
            {viewMode === 'daily' ? '+2.1% vs last week' : '+12.8% YoY growth'}
          </p>
          <p className="text-xs text-gray-500">On track to meet annual targets</p>
        </div>
      </div>
    </div>
  )
}

export default ProductionOutputPanel

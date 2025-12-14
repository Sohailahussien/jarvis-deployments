import { useState } from 'react'
import {
  Activity, Target, Gauge, CheckCircle2, AlertTriangle, AlertCircle,
  ChevronRight, Clock, Zap, Award, TrendingUp, Package, Wrench
} from 'lucide-react'
import useStore from '../store/useStore'

const priorityColors = {
  high: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  medium: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  low: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
}

const categoryIcons = {
  Availability: Clock,
  Performance: Zap,
  Quality: Award,
  'Material Efficiency': Package,
  'Sealing Quality': CheckCircle2,
  Labeling: Target,
  'Blow Molding': Activity,
  'Supply Chain': Wrench,
}

function RecommendationCard({ recommendation, onExpand, isExpanded }) {
  const colors = priorityColors[recommendation.priority]
  const Icon = categoryIcons[recommendation.category] || Target

  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${colors.border} ${isExpanded ? 'bg-gray-800/80' : 'bg-gray-800/40 hover:bg-gray-800/60'}`}>
      <button
        onClick={() => onExpand(isExpanded ? null : recommendation.id)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <Icon className={`w-4 h-4 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                {recommendation.priority.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">{recommendation.category}</span>
            </div>
            <h4 className="text-white font-medium text-sm">{recommendation.title}</h4>
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{recommendation.description}</p>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-700/50 mt-2 pt-3">
          <div className={`text-sm font-medium mb-3 ${colors.text}`}>
            Expected Impact: {recommendation.impact}
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">Recommended Actions:</p>
            {recommendation.actions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-green-400 mt-0.5">•</span>
                {action}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function GaugeChart({ value, max, label, color, benchmark }) {
  const percentage = (value / max) * 100
  const benchmarkPercent = (benchmark / max) * 100
  const isAboveBenchmark = value >= benchmark

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">{label}</span>
        <span className={`text-lg font-bold ${color}`}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isAboveBenchmark ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Benchmark marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/50"
          style={{ left: `${benchmarkPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">0%</span>
        <span className="text-xs text-gray-500">World Class: {benchmark}%</span>
      </div>
    </div>
  )
}

export default function ProductionMetricsPanel() {
  const { getProductionMetrics } = useStore()
  const metrics = getProductionMetrics()
  const [activeTab, setActiveTab] = useState('oee')
  const [expandedRec, setExpandedRec] = useState(null)

  const oeeColor = metrics.oee >= metrics.worldClassOEE ? 'text-green-400' : 'text-amber-400'
  const yieldColor = metrics.currentYield >= metrics.worldClassYield ? 'text-green-400' : 'text-amber-400'

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
      {/* Header with OEE and Yield Overview */}
      <div className="p-5 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Production Efficiency
          </h3>
        </div>

        {/* OEE and Yield Score Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">OEE Score</span>
              <Gauge className={`w-4 h-4 ${oeeColor}`} />
            </div>
            <p className={`text-3xl font-bold ${oeeColor}`}>{metrics.oee.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.oee >= metrics.worldClassOEE ? 'World Class' : `${(metrics.worldClassOEE - metrics.oee).toFixed(1)}% to World Class`}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Yield Rate</span>
              <TrendingUp className={`w-4 h-4 ${yieldColor}`} />
            </div>
            <p className={`text-3xl font-bold ${yieldColor}`}>{metrics.currentYield.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.yieldImprovement >= 0 ? '+' : ''}{metrics.yieldImprovement.toFixed(1)}% vs last month
            </p>
          </div>
        </div>

        {/* OEE Components */}
        <div className="space-y-3">
          <GaugeChart
            value={metrics.availability}
            max={100}
            label="Availability"
            color="text-blue-400"
            benchmark={90}
          />
          <GaugeChart
            value={metrics.performance}
            max={100}
            label="Performance"
            color="text-purple-400"
            benchmark={95}
          />
          <GaugeChart
            value={metrics.quality}
            max={100}
            label="Quality"
            color="text-green-400"
            benchmark={99}
          />
        </div>
      </div>

      {/* Tabs for Recommendations */}
      <div className="flex border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab('oee')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'oee'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          OEE Improvements
          {metrics.oeeRecommendations.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
              {metrics.oeeRecommendations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('yield')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'yield'
              ? 'text-green-400 border-b-2 border-green-400 bg-green-500/10'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Yield Improvements
          {metrics.yieldRecommendations.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
              {metrics.yieldRecommendations.length}
            </span>
          )}
        </button>
      </div>

      {/* Recommendations List */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {activeTab === 'oee' && (
          <>
            {metrics.oeeRecommendations.length > 0 ? (
              metrics.oeeRecommendations.map(rec => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  isExpanded={expandedRec === rec.id}
                  onExpand={setExpandedRec}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-white font-medium">Excellent OEE Performance!</p>
                <p className="text-gray-400 text-sm">All metrics are within optimal range</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'yield' && (
          <>
            {metrics.yieldRecommendations.length > 0 ? (
              metrics.yieldRecommendations.map(rec => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  isExpanded={expandedRec === rec.id}
                  onExpand={setExpandedRec}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-white font-medium">Optimal Yield Rate!</p>
                <p className="text-gray-400 text-sm">Production yield is at target levels</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary Footer */}
      <div className="p-4 bg-gray-900/30 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-red-400" />
              <span className="text-gray-400">
                High: {[...metrics.oeeRecommendations, ...metrics.yieldRecommendations].filter(r => r.priority === 'high').length}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="text-gray-400">
                Medium: {[...metrics.oeeRecommendations, ...metrics.yieldRecommendations].filter(r => r.priority === 'medium').length}
              </span>
            </span>
          </div>
          <span className="text-gray-500">
            Total Downtime: {metrics.totalDowntime}h/month
          </span>
        </div>
      </div>
    </div>
  )
}

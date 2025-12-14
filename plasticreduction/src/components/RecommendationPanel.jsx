import React from 'react'
import { Lightbulb, ArrowRight, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import useStore from '../store/useStore'

function RecommendationPanel() {
  const { wasteSources, strategies, getKPIs } = useStore()
  const kpis = getKPIs()

  // Generate smart recommendations based on current data
  const recommendations = []

  // Check recycling rate
  if (kpis.recyclingRate < 40) {
    recommendations.push({
      priority: 'high',
      title: 'Improve Recycling Rate',
      description: `Current recycling rate is ${kpis.recyclingRate.toFixed(1)}%. Industry best practice is 50%+. Consider expanding recycling partnerships.`,
      action: 'Review recycling strategy',
      icon: AlertTriangle,
      color: 'red'
    })
  }

  // Check landfill rate
  if (kpis.landfillRate > 15) {
    recommendations.push({
      priority: 'high',
      title: 'Reduce Landfill Waste',
      description: `${kpis.landfillRate.toFixed(1)}% of plastic goes to landfill. Target should be under 10%. Implement better sorting and processing.`,
      action: 'Audit waste sorting process',
      icon: AlertTriangle,
      color: 'yellow'
    })
  }

  // Check reducible sources
  const topReducible = wasteSources.filter(s => s.reducible).slice(0, 2)
  topReducible.forEach(source => {
    recommendations.push({
      priority: 'medium',
      title: `Reduce ${source.source}`,
      description: `${source.source} accounts for ${source.percent}% of waste and is identified as reducible. Look for alternative materials.`,
      action: 'Evaluate alternatives',
      icon: Lightbulb,
      color: 'blue'
    })
  })

  // Check incomplete strategies
  const incompleteStrategies = strategies.filter(s => s.status === 'In Progress' && s.implementedPercent < 50)
  incompleteStrategies.forEach(strategy => {
    recommendations.push({
      priority: 'medium',
      title: `Accelerate: ${strategy.title.slice(0, 30)}...`,
      description: `This strategy is ${strategy.implementedPercent}% complete with ${strategy.potentialReduction.toLocaleString()} kg/yr reduction potential.`,
      action: 'View strategy details',
      icon: TrendingUp,
      color: 'purple'
    })
  })

  // Success metrics
  if (kpis.totalReduction > 10) {
    recommendations.unshift({
      priority: 'success',
      title: 'Great Progress!',
      description: `You've achieved ${kpis.totalReduction.toFixed(1)}% reduction in plastic usage compared to last month. Keep it up!`,
      action: 'View full report',
      icon: CheckCircle,
      color: 'green'
    })
  }

  const priorityColors = {
    high: 'border-red-500/30 bg-red-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
    success: 'border-green-500/30 bg-green-500/5'
  }

  const iconColors = {
    red: 'text-red-400 bg-red-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    green: 'text-green-400 bg-green-500/20',
    purple: 'text-purple-400 bg-purple-500/20'
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h3 className="text-white font-semibold">Smart Recommendations</h3>
      </div>

      <div className="space-y-3">
        {recommendations.slice(0, 5).map((rec, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${priorityColors[rec.priority]}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${iconColors[rec.color]}`}>
                <rec.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm mb-1">{rec.title}</h4>
                <p className="text-gray-400 text-xs mb-2">{rec.description}</p>
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                  {rec.action} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-6">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-400">All metrics looking good!</p>
        </div>
      )}
    </div>
  )
}

export default RecommendationPanel

import { useState, useMemo } from 'react'
import {
  Calculator, TrendingUp, TrendingDown, Leaf, DollarSign,
  Package, RefreshCw, AlertCircle, Check, ChevronRight,
  BarChart3, PieChart, Zap, Target
} from 'lucide-react'

// Base product data for simulation
const baseProducts = [
  { id: 1, name: '5 Gallon Dispenser', size: '18.9L', currentMix: 2.2, plasticPerUnit: 750, unitPrice: 2.5, cost: 1.2, category: 'returnable', maxCycles: 50 },
  { id: 2, name: '4 Gallon Jug', size: '15L', currentMix: 1.2, plasticPerUnit: 580, unitPrice: 1.8, cost: 0.9, category: 'returnable', maxCycles: 40 },
  { id: 3, name: '1.5L Family', size: '1.5L', currentMix: 17.8, plasticPerUnit: 38, unitPrice: 0.25, cost: 0.12, category: 'single-use', maxCycles: 1 },
  { id: 4, name: '500ml Standard', size: '500ml', currentMix: 37.1, plasticPerUnit: 18, unitPrice: 0.15, cost: 0.06, category: 'single-use', maxCycles: 1 },
  { id: 5, name: '330ml Compact', size: '330ml', currentMix: 26.7, plasticPerUnit: 12, unitPrice: 0.12, cost: 0.05, category: 'single-use', maxCycles: 1 },
  { id: 6, name: '200ml Mini', size: '200ml', currentMix: 14.9, plasticPerUnit: 8, unitPrice: 0.08, cost: 0.03, category: 'single-use', maxCycles: 1 },
]

const presetScenarios = [
  {
    id: 'eco-shift',
    name: 'Eco-Friendly Shift',
    description: 'Increase returnable bottles by 50%, reduce single-use 500ml by 30%',
    changes: { 1: 3.3, 2: 1.8, 4: 26.0 }
  },
  {
    id: 'premium-focus',
    name: 'Premium Focus',
    description: 'Double 1.5L family bottles, reduce mini bottles',
    changes: { 3: 35.6, 6: 7.5 }
  },
  {
    id: 'max-sustainability',
    name: 'Maximum Sustainability',
    description: 'Maximize returnable bottles, minimize single-use plastics',
    changes: { 1: 8.0, 2: 5.0, 3: 25.0, 4: 30.0, 5: 20.0, 6: 12.0 }
  },
  {
    id: 'cost-optimize',
    name: 'Cost Optimization',
    description: 'Focus on highest margin products',
    changes: { 1: 4.0, 2: 2.5, 4: 40.0, 5: 30.0 }
  }
]

export default function WhatIfSimulator() {
  const [productMix, setProductMix] = useState(
    baseProducts.reduce((acc, p) => ({ ...acc, [p.id]: p.currentMix }), {})
  )
  const [activeScenario, setActiveScenario] = useState(null)
  const [showComparison, setShowComparison] = useState(true)

  // Calculate totals for a given mix
  const calculateMetrics = (mix) => {
    const totalMonthlyUnits = 673000 // Total monthly production capacity
    let totalPlastic = 0
    let totalRevenue = 0
    let totalCost = 0
    let plasticSavedFromReturns = 0

    baseProducts.forEach(product => {
      const percentage = mix[product.id] || 0
      const units = (percentage / 100) * totalMonthlyUnits
      const plasticKg = (units * product.plasticPerUnit) / 1000

      if (product.category === 'returnable') {
        // For returnable bottles, effective plastic = plastic / max cycles
        totalPlastic += plasticKg / product.maxCycles
        plasticSavedFromReturns += plasticKg * (1 - 1 / product.maxCycles)
      } else {
        totalPlastic += plasticKg
      }

      totalRevenue += units * product.unitPrice
      totalCost += units * product.cost
    })

    return {
      totalPlastic: totalPlastic,
      plasticSaved: plasticSavedFromReturns,
      revenue: totalRevenue,
      cost: totalCost,
      profit: totalRevenue - totalCost,
      profitMargin: ((totalRevenue - totalCost) / totalRevenue) * 100,
      returnablePercent: (mix[1] || 0) + (mix[2] || 0),
      singleUsePercent: (mix[3] || 0) + (mix[4] || 0) + (mix[5] || 0) + (mix[6] || 0)
    }
  }

  const currentMetrics = useMemo(() =>
    calculateMetrics(baseProducts.reduce((acc, p) => ({ ...acc, [p.id]: p.currentMix }), {})),
    []
  )

  const projectedMetrics = useMemo(() => calculateMetrics(productMix), [productMix])

  const changes = useMemo(() => ({
    plastic: projectedMetrics.totalPlastic - currentMetrics.totalPlastic,
    plasticPercent: ((projectedMetrics.totalPlastic - currentMetrics.totalPlastic) / currentMetrics.totalPlastic) * 100,
    profit: projectedMetrics.profit - currentMetrics.profit,
    profitPercent: ((projectedMetrics.profit - currentMetrics.profit) / currentMetrics.profit) * 100,
    revenue: projectedMetrics.revenue - currentMetrics.revenue,
    revenuePercent: ((projectedMetrics.revenue - currentMetrics.revenue) / currentMetrics.revenue) * 100,
  }), [projectedMetrics, currentMetrics])

  const handleMixChange = (productId, value) => {
    setProductMix(prev => ({ ...prev, [productId]: parseFloat(value) || 0 }))
    setActiveScenario(null)
  }

  const applyScenario = (scenario) => {
    const newMix = baseProducts.reduce((acc, p) => ({
      ...acc,
      [p.id]: scenario.changes[p.id] ?? p.currentMix
    }), {})
    setProductMix(newMix)
    setActiveScenario(scenario.id)
  }

  const resetToBaseline = () => {
    setProductMix(baseProducts.reduce((acc, p) => ({ ...acc, [p.id]: p.currentMix }), {}))
    setActiveScenario(null)
  }

  const totalMix = Object.values(productMix).reduce((a, b) => a + b, 0)
  const mixValid = Math.abs(totalMix - 100) < 0.1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-indigo-400" />
              What-If Simulator
            </h2>
            <p className="text-gray-400 mt-1">Model production scenarios and see projected plastic & profit impacts</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetToBaseline}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
            >
              Reset to Current
            </button>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm transition-colors"
            >
              {showComparison ? 'Hide' : 'Show'} Comparison
            </button>
          </div>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Quick Scenarios
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {presetScenarios.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => applyScenario(scenario)}
              className={`p-4 rounded-lg border text-left transition-all ${
                activeScenario === scenario.id
                  ? 'bg-indigo-600/20 border-indigo-500/50'
                  : 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium text-sm">{scenario.name}</p>
                {activeScenario === scenario.id && (
                  <Check className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <p className="text-gray-500 text-xs">{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulator Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product Mix Controls */}
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Production Mix (%)
            </h3>
            <div className={`px-3 py-1 rounded-full text-sm ${
              mixValid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              Total: {totalMix.toFixed(1)}%
            </div>
          </div>

          {!mixValid && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Total mix must equal 100%. Current: {totalMix.toFixed(1)}%
            </div>
          )}

          <div className="space-y-4">
            {baseProducts.map(product => {
              const currentValue = productMix[product.id] || 0
              const diff = currentValue - product.currentMix
              return (
                <div key={product.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        product.category === 'returnable' ? 'bg-green-400' : 'bg-blue-400'
                      }`} />
                      <span className="text-white text-sm font-medium">{product.name}</span>
                      <span className="text-gray-500 text-xs">({product.size})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {diff !== 0 && (
                        <span className={`text-xs ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                        </span>
                      )}
                      <input
                        type="number"
                        value={currentValue}
                        onChange={(e) => handleMixChange(product.id, e.target.value)}
                        step="0.1"
                        min="0"
                        max="100"
                        className="w-20 bg-gray-900/50 border border-gray-700 rounded px-2 py-1 text-white text-right text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                    {/* Baseline marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10"
                      style={{ left: `${product.currentMix}%` }}
                    />
                    {/* Current value bar */}
                    <div
                      className={`h-full rounded-full transition-all ${
                        product.category === 'returnable'
                          ? 'bg-gradient-to-r from-green-600 to-green-400'
                          : 'bg-gradient-to-r from-blue-600 to-blue-400'
                      }`}
                      style={{ width: `${currentValue}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Plastic: {product.plasticPerUnit}g/unit</span>
                    <span>Profit: {((product.unitPrice - product.cost) * 100).toFixed(0)} baisa/unit</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Category Summary */}
          <div className="mt-6 pt-4 border-t border-gray-700/50 grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium text-sm">Returnable</span>
              </div>
              <p className="text-2xl font-bold text-white">{projectedMetrics.returnablePercent.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">of production mix</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium text-sm">Single-Use</span>
              </div>
              <p className="text-2xl font-bold text-white">{projectedMetrics.singleUsePercent.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">of production mix</p>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="space-y-4">
          {/* Plastic Impact */}
          <div className={`rounded-xl p-5 border ${
            changes.plastic <= 0
              ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30'
              : 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">Plastic Impact</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-xs mb-1">Monthly Plastic Use</p>
                <p className="text-2xl font-bold text-white">{projectedMetrics.totalPlastic.toFixed(0)} kg</p>
              </div>
              <div className={`flex items-center gap-2 ${changes.plastic <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {changes.plastic <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                <span className="font-medium">
                  {changes.plastic > 0 ? '+' : ''}{changes.plastic.toFixed(0)} kg ({changes.plasticPercent.toFixed(1)}%)
                </span>
              </div>
              {projectedMetrics.plasticSaved > 0 && (
                <div className="pt-3 border-t border-gray-700/50">
                  <p className="text-gray-500 text-xs mb-1">Saved via Returns</p>
                  <p className="text-lg font-bold text-green-400">{projectedMetrics.plasticSaved.toFixed(0)} kg/mo</p>
                </div>
              )}
            </div>
          </div>

          {/* Financial Impact */}
          <div className={`rounded-xl p-5 border ${
            changes.profit >= 0
              ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-500/30'
              : 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold">Financial Impact</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-xs mb-1">Monthly Profit</p>
                <p className="text-2xl font-bold text-white">{(projectedMetrics.profit / 1000).toFixed(1)}K OMR</p>
              </div>
              <div className={`flex items-center gap-2 ${changes.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {changes.profit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">
                  {changes.profit >= 0 ? '+' : ''}{(changes.profit / 1000).toFixed(1)}K ({changes.profitPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="pt-3 border-t border-gray-700/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Revenue</span>
                  <span className="text-white">{(projectedMetrics.revenue / 1000).toFixed(1)}K OMR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Margin</span>
                  <span className="text-white">{projectedMetrics.profitMargin.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Score */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Sustainability Score</span>
            </div>
            <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0,
                    50 + (projectedMetrics.returnablePercent * 3) - (changes.plasticPercent * 2)
                  ))}%`
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Low Impact</span>
              <span>High Impact</span>
            </div>
            <p className="text-center text-sm text-gray-400 mt-3">
              {projectedMetrics.returnablePercent > 5
                ? 'Good returnable mix!'
                : 'Consider increasing returnable bottles'}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      {showComparison && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            Current vs Projected Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-500 text-xs border-b border-gray-700/50">
                  <th className="text-left py-3 px-2">Metric</th>
                  <th className="text-right py-3 px-2">Current</th>
                  <th className="text-right py-3 px-2">Projected</th>
                  <th className="text-right py-3 px-2">Change</th>
                  <th className="text-left py-3 px-2">Impact</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 px-2 text-white">Monthly Plastic (kg)</td>
                  <td className="py-3 px-2 text-right text-gray-400">{currentMetrics.totalPlastic.toFixed(0)}</td>
                  <td className="py-3 px-2 text-right text-white font-medium">{projectedMetrics.totalPlastic.toFixed(0)}</td>
                  <td className={`py-3 px-2 text-right ${changes.plastic <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {changes.plastic > 0 ? '+' : ''}{changes.plastic.toFixed(0)}
                  </td>
                  <td className="py-3 px-2">
                    <div className={`w-16 h-2 rounded-full ${changes.plastic <= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, Math.abs(changes.plasticPercent) * 2)}px` }} />
                  </td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 px-2 text-white">Monthly Revenue (OMR)</td>
                  <td className="py-3 px-2 text-right text-gray-400">{(currentMetrics.revenue / 1000).toFixed(1)}K</td>
                  <td className="py-3 px-2 text-right text-white font-medium">{(projectedMetrics.revenue / 1000).toFixed(1)}K</td>
                  <td className={`py-3 px-2 text-right ${changes.revenue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {changes.revenue >= 0 ? '+' : ''}{(changes.revenue / 1000).toFixed(1)}K
                  </td>
                  <td className="py-3 px-2">
                    <div className={`w-16 h-2 rounded-full ${changes.revenue >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, Math.abs(changes.revenuePercent) * 5)}px` }} />
                  </td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 px-2 text-white">Monthly Profit (OMR)</td>
                  <td className="py-3 px-2 text-right text-gray-400">{(currentMetrics.profit / 1000).toFixed(1)}K</td>
                  <td className="py-3 px-2 text-right text-white font-medium">{(projectedMetrics.profit / 1000).toFixed(1)}K</td>
                  <td className={`py-3 px-2 text-right ${changes.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {changes.profit >= 0 ? '+' : ''}{(changes.profit / 1000).toFixed(1)}K
                  </td>
                  <td className="py-3 px-2">
                    <div className={`w-16 h-2 rounded-full ${changes.profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, Math.abs(changes.profitPercent) * 5)}px` }} />
                  </td>
                </tr>
                <tr className="border-b border-gray-700/30">
                  <td className="py-3 px-2 text-white">Profit Margin (%)</td>
                  <td className="py-3 px-2 text-right text-gray-400">{currentMetrics.profitMargin.toFixed(1)}%</td>
                  <td className="py-3 px-2 text-right text-white font-medium">{projectedMetrics.profitMargin.toFixed(1)}%</td>
                  <td className={`py-3 px-2 text-right ${projectedMetrics.profitMargin >= currentMetrics.profitMargin ? 'text-green-400' : 'text-red-400'}`}>
                    {projectedMetrics.profitMargin >= currentMetrics.profitMargin ? '+' : ''}
                    {(projectedMetrics.profitMargin - currentMetrics.profitMargin).toFixed(1)}%
                  </td>
                  <td className="py-3 px-2">
                    <div className={`w-16 h-2 rounded-full ${projectedMetrics.profitMargin >= currentMetrics.profitMargin ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(projectedMetrics.profitMargin - currentMetrics.profitMargin) * 10}px` }} />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-white">Returnable Mix (%)</td>
                  <td className="py-3 px-2 text-right text-gray-400">{currentMetrics.returnablePercent.toFixed(1)}%</td>
                  <td className="py-3 px-2 text-right text-white font-medium">{projectedMetrics.returnablePercent.toFixed(1)}%</td>
                  <td className={`py-3 px-2 text-right ${projectedMetrics.returnablePercent >= currentMetrics.returnablePercent ? 'text-green-400' : 'text-red-400'}`}>
                    {projectedMetrics.returnablePercent >= currentMetrics.returnablePercent ? '+' : ''}
                    {(projectedMetrics.returnablePercent - currentMetrics.returnablePercent).toFixed(1)}%
                  </td>
                  <td className="py-3 px-2">
                    <div className={`w-16 h-2 rounded-full ${projectedMetrics.returnablePercent >= currentMetrics.returnablePercent ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(projectedMetrics.returnablePercent - currentMetrics.returnablePercent) * 5}px` }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Annual Projections */}
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <h4 className="text-white font-medium mb-3">Annual Impact (12 months)</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Plastic Difference</p>
                <p className={`text-xl font-bold ${changes.plastic <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {changes.plastic > 0 ? '+' : ''}{(changes.plastic * 12 / 1000).toFixed(1)} tons
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Profit Difference</p>
                <p className={`text-xl font-bold ${changes.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {changes.profit >= 0 ? '+' : ''}{(changes.profit * 12 / 1000).toFixed(0)}K OMR
                </p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Plastic Saved (Returns)</p>
                <p className="text-xl font-bold text-green-400">
                  {(projectedMetrics.plasticSaved * 12 / 1000).toFixed(1)} tons
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

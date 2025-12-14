import { X, Package, TrendingUp, DollarSign, Recycle, RotateCcw, Factory, Warehouse, Scale } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts'

const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']

export default function ProductModal({ product, onClose }) {
  if (!product) return null

  const salesRate = ((product.monthlySales / product.monthlyProduction) * 100).toFixed(1)
  const revenue = (product.monthlySales * product.unitPrice).toFixed(2)
  const profit = ((product.unitPrice - product.productionCost) * product.monthlySales).toFixed(2)
  const plasticKg = ((product.monthlyProduction * product.plasticWeight) / 1000).toFixed(1)
  const profitMargin = (((product.unitPrice - product.productionCost) / product.unitPrice) * 100).toFixed(1)

  const trendData = product.trend.map((value, index) => ({
    month: months[index],
    sales: value,
    production: Math.round(value * 1.03 + Math.random() * 1000)
  }))

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700/50 p-5 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{product.name}</h2>
              <p className="text-gray-400">{product.size} - {product.plasticType}</p>
              <div className="flex gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  product.category === 'returnable'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {product.category === 'returnable' ? 'Returnable' : 'Single-Use'}
                </span>
                {product.recyclable && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                    Recyclable
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Factory className="w-4 h-4" />
                <span>Monthly Production</span>
              </div>
              <p className="text-2xl font-bold text-white">{product.monthlyProduction.toLocaleString()}</p>
              <p className="text-xs text-gray-500">units per month</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Monthly Sales</span>
              </div>
              <p className="text-2xl font-bold text-green-400">{product.monthlySales.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{salesRate}% sell-through</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Revenue</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{revenue}</p>
              <p className="text-xs text-gray-500">OMR per month</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Warehouse className="w-4 h-4" />
                <span>Inventory</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">{product.inventory.toLocaleString()}</p>
              <p className="text-xs text-gray-500">units in stock</p>
            </div>
          </div>

          {/* Sales Trend Chart */}
          <div className="bg-gray-900/50 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Sales Trend (6 Months)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => [value.toLocaleString(), 'Units']}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                    name="Sales"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Financial & Sustainability Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Financial Details */}
            <div className="bg-gray-900/50 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Financial Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Unit Price</span>
                  <span className="text-white font-medium">{product.unitPrice.toFixed(2)} OMR</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Production Cost</span>
                  <span className="text-white font-medium">{product.productionCost.toFixed(2)} OMR</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Profit per Unit</span>
                  <span className="text-green-400 font-medium">{(product.unitPrice - product.productionCost).toFixed(2)} OMR</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Monthly Profit</span>
                  <span className="text-emerald-400 font-bold">{profit} OMR</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Profit Margin</span>
                  <span className="text-green-400 font-bold">{profitMargin}%</span>
                </div>
              </div>
            </div>

            {/* Sustainability Details */}
            <div className="bg-gray-900/50 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Recycle className="w-4 h-4 text-emerald-400" />
                Sustainability Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Plastic per Unit</span>
                  <span className="text-white font-medium">{product.plasticWeight}g</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Monthly Plastic Usage</span>
                  <span className="text-amber-400 font-medium">{plasticKg} kg</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Plastic Type</span>
                  <span className="text-white font-medium">{product.plasticType}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Recyclable</span>
                  <span className={product.recyclable ? 'text-green-400' : 'text-red-400'}>{product.recyclable ? 'Yes' : 'No'}</span>
                </div>
                {product.returns > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Return Rate
                    </span>
                    <span className="text-green-400 font-bold">{product.returns}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-green-400" />
              Environmental Impact Summary
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{plasticKg}</p>
                <p className="text-sm text-gray-400">kg plastic/month</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">{(parseFloat(plasticKg) * 12).toFixed(0)}</p>
                <p className="text-sm text-gray-400">kg plastic/year</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-400">
                  {product.returns > 0
                    ? (parseFloat(plasticKg) * (1 - product.returns / 100)).toFixed(1)
                    : plasticKg
                  }
                </p>
                <p className="text-sm text-gray-400">kg net new plastic</p>
              </div>
            </div>
            {product.returns > 0 && (
              <p className="text-center text-sm text-green-400 mt-4">
                {product.returns}% return rate saves {(parseFloat(plasticKg) * product.returns / 100).toFixed(1)} kg of plastic monthly
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { TrendingUp, Package, DollarSign, Recycle, RotateCcw } from 'lucide-react'

const bottleColors = {
  'dispenser-5gal': 'from-blue-600 to-cyan-500',
  'jug-4gal': 'from-blue-500 to-cyan-400',
  'bottle-1.5l': 'from-cyan-500 to-teal-400',
  'bottle-500ml': 'from-teal-500 to-emerald-400',
  'bottle-330ml': 'from-emerald-500 to-green-400',
  'bottle-200ml': 'from-green-500 to-lime-400',
}

const bottleSizes = {
  'dispenser-5gal': { width: 'w-16', height: 'h-24' },
  'jug-4gal': { width: 'w-14', height: 'h-20' },
  'bottle-1.5l': { width: 'w-8', height: 'h-20' },
  'bottle-500ml': { width: 'w-6', height: 'h-16' },
  'bottle-330ml': { width: 'w-5', height: 'h-14' },
  'bottle-200ml': { width: 'w-4', height: 'h-12' },
}

function MiniSparkline({ data, color = 'green' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 80
    return `${x},${y}`
  }).join(' ')

  return (
    <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color === 'green' ? '#22c55e' : '#3b82f6'}
        strokeWidth="3"
        points={points}
      />
    </svg>
  )
}

function BottleIcon({ type, className = '' }) {
  const sizes = bottleSizes[type] || { width: 'w-8', height: 'h-16' }
  const gradient = bottleColors[type] || 'from-blue-500 to-cyan-400'

  const isDispenser = type.includes('dispenser') || type.includes('jug')

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizes.width} ${sizes.height} relative`}>
        {/* Bottle cap */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${isDispenser ? 'w-6 h-3' : 'w-3 h-2'} bg-gradient-to-b from-blue-300 to-blue-400 rounded-t-sm`} />

        {/* Bottle body */}
        <div className={`absolute ${isDispenser ? 'top-3' : 'top-2'} inset-x-0 bottom-0 bg-gradient-to-b ${gradient} rounded-b-lg ${isDispenser ? 'rounded-t-lg' : 'rounded-t-sm'} opacity-80`}>
          {/* Water effect */}
          <div className="absolute inset-1 bg-white/20 rounded-lg" />

          {/* Sarooj label simulation */}
          <div className="absolute inset-x-1 top-1/3 h-1/3 bg-white/30 rounded flex items-center justify-center">
            <span className="text-[4px] font-bold text-blue-900/60">sarooj</span>
          </div>
        </div>

        {/* Handle for dispensers */}
        {isDispenser && (
          <div className="absolute top-4 -right-1 w-2 h-6 border-2 border-blue-400 rounded-r-full" />
        )}
      </div>
    </div>
  )
}

export default function ProductCard({ product, onSelect }) {
  const salesRate = ((product.monthlySales / product.monthlyProduction) * 100).toFixed(1)
  const revenue = (product.monthlySales * product.unitPrice).toFixed(0)
  const profit = ((product.unitPrice - product.productionCost) * product.monthlySales).toFixed(0)
  const plasticKg = ((product.monthlyProduction * product.plasticWeight) / 1000).toFixed(0)

  return (
    <div
      onClick={() => onSelect?.(product)}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-blue-500/50 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Bottle Visual */}
        <div className="flex-shrink-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 flex items-center justify-center min-w-[80px] min-h-[100px]">
          <BottleIcon type={product.image} />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">{product.name}</h3>
              <p className="text-gray-500 text-xs">{product.size} - {product.plasticType}</p>
            </div>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              product.category === 'returnable'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}>
              {product.category === 'returnable' ? 'Returnable' : 'Single-Use'}
            </span>
          </div>

          {/* Mini Sparkline */}
          <div className="mb-3">
            <MiniSparkline data={product.trend} color="blue" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <Package className="w-3 h-3" />
                <span>Production</span>
              </div>
              <p className="text-white font-medium">{product.monthlyProduction.toLocaleString()}</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <TrendingUp className="w-3 h-3" />
                <span>Sales</span>
              </div>
              <p className="text-white font-medium">{product.monthlySales.toLocaleString()}</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <DollarSign className="w-3 h-3" />
                <span>Revenue</span>
              </div>
              <p className="text-green-400 font-medium">{revenue} OMR</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <Recycle className="w-3 h-3" />
                <span>Plastic</span>
              </div>
              <p className="text-amber-400 font-medium">{plasticKg} kg</p>
            </div>
          </div>

          {/* Return Rate for Returnable Products */}
          {product.returns > 0 && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <RotateCcw className="w-3 h-3 text-green-400" />
              <span className="text-gray-400">Return Rate:</span>
              <span className="text-green-400 font-medium">{product.returns}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

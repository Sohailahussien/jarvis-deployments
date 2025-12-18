import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function KPICard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  status = 'neutral',
  subtitle,
  className = '',
}) {
  const statusColors = {
    good: 'border-l-emerald-500',
    warning: 'border-l-amber-500',
    critical: 'border-l-red-500',
    neutral: 'border-l-sarooj-500',
  }

  const trendColors = {
    up: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
    down: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    neutral: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 border-l-4 ${statusColors[status]} p-5 card-hover ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
            {unit && <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-sarooj-100 dark:bg-sarooj-900/30">
            <Icon className="w-5 h-5 text-sarooj-600 dark:text-sarooj-400" />
          </div>
        )}
      </div>

      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${trendColors[trend]}`}>
            <TrendIcon className="w-3 h-3" />
            {trendValue}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">vs last period</span>
        </div>
      )}
    </div>
  )
}

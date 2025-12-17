export default function ChartCard({ title, subtitle, children, className = '', actions }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

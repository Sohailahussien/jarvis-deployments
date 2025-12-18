import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import { Droplets, ThermometerSun, Gauge, AlertTriangle } from 'lucide-react'
import useStore from '../store/useStore'
import KPICard from '../components/common/KPICard'
import ChartCard from '../components/common/ChartCard'
import DataTable from '../components/common/DataTable'
import ProgressRing from '../components/common/ProgressRing'
import {
  calculateWaterQualityKPIs,
  getWaterQualityByStation,
  aggregateByMonth,
} from '../services/kpiCalculations'
import { formatNumber, formatPercent, getUniqueValues } from '../utils/csvParser'

export default function WaterQuality() {
  const { data, selectedStation, setSelectedStation } = useStore()
  const [selectedMetric, setSelectedMetric] = useState('chlorine_mg_l')

  if (!data) return null

  const stations = getUniqueValues(data.waterQuality, 'station')
  const filteredData = selectedStation === 'all'
    ? data.waterQuality
    : data.waterQuality.filter(d => d.station === selectedStation)

  const kpis = calculateWaterQualityKPIs(filteredData)
  const stationData = getWaterQualityByStation(data.waterQuality)

  // Monthly trends
  const monthlyData = aggregateByMonth(filteredData).slice(-12).map(m => ({
    month: m.month.slice(5),
    chlorine: m.records.reduce((sum, r) => sum + (r.chlorine_mg_l || 0), 0) / m.records.length,
    ph: m.records.reduce((sum, r) => sum + (r.ph || 0), 0) / m.records.length,
    turbidity: m.records.reduce((sum, r) => sum + (r.turbidity_ntu || 0), 0) / m.records.length,
    compliance: (m.records.filter(r => r.overall_compliant === 'Yes').length / m.records.length) * 100,
  }))

  const metrics = [
    { key: 'chlorine_mg_l', label: 'Chlorine', color: '#0ca5eb' },
    { key: 'ph', label: 'pH Level', color: '#10b981' },
    { key: 'turbidity_ntu', label: 'Turbidity', color: '#f59e0b' },
  ]

  const tableColumns = [
    { header: 'Station', accessor: 'station' },
    {
      header: 'Compliance',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${row.compliance >= 95 ? 'bg-emerald-500' : row.compliance >= 85 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${row.compliance}%` }}
            />
          </div>
          <span className={row.compliance >= 95 ? 'text-emerald-600 dark:text-emerald-400' : row.compliance >= 85 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}>
            {formatPercent(row.compliance)}
          </span>
        </div>
      ),
    },
    { header: 'Avg Chlorine', render: (row) => `${formatNumber(row.avgChlorine, 2)} mg/L` },
    { header: 'Avg pH', render: (row) => formatNumber(row.avgPH, 2) },
    { header: 'Avg Turbidity', render: (row) => `${formatNumber(row.avgTurbidity, 2)} NTU` },
    { header: 'Readings', render: (row) => formatNumber(row.readings) },
  ]

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Station:</label>
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sarooj-500"
        >
          <option value="all">All Stations</option>
          {stations.map(station => (
            <option key={station} value={station}>{station.replace('Station-', '').replace(/-/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Overall Compliance"
          value={formatPercent(kpis.overallCompliance)}
          icon={Droplets}
          status={kpis.overallCompliance >= 95 ? 'good' : kpis.overallCompliance >= 85 ? 'warning' : 'critical'}
          subtitle={`${formatNumber(kpis.totalReadings)} readings`}
        />
        <KPICard
          title="Avg Chlorine"
          value={formatNumber(kpis.avgChlorine, 2)}
          unit="mg/L"
          icon={Droplets}
          status={kpis.avgChlorine >= 0.5 && kpis.avgChlorine <= 2.5 ? 'good' : 'warning'}
          subtitle={`${formatPercent(kpis.chlorineCompliance)} compliant`}
        />
        <KPICard
          title="Avg pH Level"
          value={formatNumber(kpis.avgPH, 2)}
          icon={Gauge}
          status={kpis.avgPH >= 6.5 && kpis.avgPH <= 8.5 ? 'good' : 'warning'}
          subtitle={`${formatPercent(kpis.phCompliance)} compliant`}
        />
        <KPICard
          title="Avg Turbidity"
          value={formatNumber(kpis.avgTurbidity, 2)}
          unit="NTU"
          icon={ThermometerSun}
          status={kpis.avgTurbidity <= 1 ? 'good' : kpis.avgTurbidity <= 4 ? 'warning' : 'critical'}
          subtitle={`${formatPercent(kpis.turbidityCompliance)} compliant`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Ring */}
        <ChartCard title="Compliance Breakdown" subtitle="Parameter-level compliance">
          <div className="flex items-center justify-center py-6">
            <ProgressRing value={kpis.overallCompliance} size={160} color="auto" />
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Chlorine</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-sarooj-500 h-2 rounded-full" style={{ width: `${kpis.chlorineCompliance}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-14 text-right">
                  {formatPercent(kpis.chlorineCompliance)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">pH Level</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${kpis.phCompliance}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-14 text-right">
                  {formatPercent(kpis.phCompliance)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Turbidity</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${kpis.turbidityCompliance}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-14 text-right">
                  {formatPercent(kpis.turbidityCompliance)}
                </span>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Trend Chart */}
        <ChartCard
          title="Monthly Trends"
          subtitle="Water quality parameters over time"
          className="lg:col-span-2"
          actions={
            <div className="flex gap-2">
              {metrics.map(m => (
                <button
                  key={m.key}
                  onClick={() => setSelectedMetric(m.key)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedMetric === m.key
                      ? 'bg-sarooj-100 dark:bg-sarooj-900/30 text-sarooj-700 dark:text-sarooj-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric === 'chlorine_mg_l' ? 'chlorine' : selectedMetric === 'ph' ? 'ph' : 'turbidity'}
                  stroke={metrics.find(m => m.key === selectedMetric)?.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name={metrics.find(m => m.key === selectedMetric)?.label}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Station Comparison */}
      <ChartCard title="Station Compliance Comparison" subtitle="Compliance rates by monitoring station">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis dataKey="station" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb',
                }}
                formatter={(value) => [`${value.toFixed(1)}%`, 'Compliance']}
              />
              <Bar
                dataKey="compliance"
                fill="#0ca5eb"
                radius={[0, 4, 4, 0]}
                name="Compliance %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Station Table */}
      <ChartCard title="Station Details" subtitle="Detailed metrics by monitoring station">
        <DataTable columns={tableColumns} data={stationData} />
      </ChartCard>
    </div>
  )
}

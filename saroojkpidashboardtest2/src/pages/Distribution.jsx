import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { Network, Gauge, Droplets, AlertTriangle } from 'lucide-react'
import useStore from '../store/useStore'
import KPICard from '../components/common/KPICard'
import ChartCard from '../components/common/ChartCard'
import DataTable from '../components/common/DataTable'
import {
  calculateDistributionKPIs,
  getDistributionByZone,
  aggregateByMonth,
} from '../services/kpiCalculations'
import { formatNumber, formatPercent, getUniqueValues } from '../utils/csvParser'

export default function Distribution() {
  const { data, selectedZone, setSelectedZone } = useStore()

  if (!data) return null

  const zones = getUniqueValues(data.distribution, 'zone')
  const filteredData = selectedZone === 'all'
    ? data.distribution
    : data.distribution.filter(d => d.zone === selectedZone)

  const kpis = calculateDistributionKPIs(filteredData)
  const zoneData = getDistributionByZone(data.distribution)

  // Monthly trends
  const monthlyData = aggregateByMonth(filteredData).slice(-12).map(m => ({
    month: m.month.slice(5),
    flowRate: m.records.reduce((sum, r) => sum + (r.flow_rate_gpm || 0), 0) / m.records.length,
    pressure: m.records.reduce((sum, r) => sum + (r.pressure_psi || 0), 0) / m.records.length,
    nrw: m.records.reduce((sum, r) => sum + (r.nrw_percent || 0), 0) / m.records.length,
  }))

  const tableColumns = [
    { header: 'Zone', accessor: 'zone' },
    { header: 'Avg Flow Rate', render: (row) => `${formatNumber(row.avgFlowRate, 0)} GPM` },
    { header: 'Avg Pressure', render: (row) => `${formatNumber(row.avgPressure, 1)} PSI` },
    {
      header: 'NRW %',
      render: (row) => (
        <span className={row.avgNRW < 25 ? 'text-emerald-600 dark:text-emerald-400' : row.avgNRW < 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}>
          {formatPercent(row.avgNRW)}
        </span>
      ),
    },
    {
      header: 'Pressure Compliance',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${row.pressureCompliance >= 95 ? 'bg-emerald-500' : row.pressureCompliance >= 85 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${row.pressureCompliance}%` }}
            />
          </div>
          <span>{formatPercent(row.pressureCompliance)}</span>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Zone:</label>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sarooj-500"
        >
          <option value="all">All Zones</option>
          {zones.map(zone => (
            <option key={zone} value={zone}>{zone.replace('Zone-', '').replace(/-/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Average NRW"
          value={formatPercent(kpis.avgNRW)}
          icon={Droplets}
          status={kpis.avgNRW < 25 ? 'good' : kpis.avgNRW < 40 ? 'warning' : 'critical'}
          subtitle="Non-Revenue Water"
        />
        <KPICard
          title="Avg Flow Rate"
          value={formatNumber(kpis.totalFlowRate, 0)}
          unit="GPM"
          icon={Network}
          status="neutral"
          subtitle={`${kpis.zoneCount} zones`}
        />
        <KPICard
          title="Avg Pressure"
          value={formatNumber(kpis.avgPressure, 1)}
          unit="PSI"
          icon={Gauge}
          status={kpis.avgPressure >= 45 && kpis.avgPressure <= 80 ? 'good' : 'warning'}
          subtitle="System average"
        />
        <KPICard
          title="Pressure Compliance"
          value={formatPercent(kpis.pressureCompliance)}
          icon={AlertTriangle}
          status={kpis.pressureCompliance >= 95 ? 'good' : kpis.pressureCompliance >= 85 ? 'warning' : 'critical'}
          subtitle="Within optimal range"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NRW Trend */}
        <ChartCard title="Non-Revenue Water Trend" subtitle="Monthly NRW percentage">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorNRW" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  formatter={(value) => [`${value.toFixed(1)}%`, 'NRW']}
                />
                <Area
                  type="monotone"
                  dataKey="nrw"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorNRW)"
                  name="NRW %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Flow and Pressure Trends */}
        <ChartCard title="Flow & Pressure Trends" subtitle="Monthly averages">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="flowRate" stroke="#0ca5eb" strokeWidth={2} name="Flow Rate (GPM)" />
                <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#10b981" strokeWidth={2} name="Pressure (PSI)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Zone Comparison */}
      <ChartCard title="Zone NRW Comparison" subtitle="Non-revenue water by distribution zone">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zoneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="zone" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f9fafb',
                }}
                formatter={(value) => [`${value.toFixed(1)}%`, 'NRW']}
              />
              <Bar
                dataKey="avgNRW"
                fill="#0ca5eb"
                radius={[4, 4, 0, 0]}
                name="Avg NRW %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Zone Table */}
      <ChartCard title="Zone Performance Details" subtitle="Detailed metrics by distribution zone">
        <DataTable columns={tableColumns} data={zoneData} />
      </ChartCard>
    </div>
  )
}

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Zap, DollarSign, Droplets, Factory } from 'lucide-react'
import useStore from '../store/useStore'
import KPICard from '../components/common/KPICard'
import ChartCard from '../components/common/ChartCard'
import DataTable from '../components/common/DataTable'
import {
  calculateEnergyKPIs,
  getEnergyByFacility,
  aggregateByMonth,
} from '../services/kpiCalculations'
import { formatNumber, formatCurrency, getUniqueValues } from '../utils/csvParser'

const COLORS = ['#0ca5eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#06b6d4', '#84cc16', '#f97316']

export default function Energy() {
  const { data, selectedFacility, setSelectedFacility } = useStore()

  if (!data) return null

  const facilities = getUniqueValues(data.energy, 'facility')
  const filteredData = selectedFacility === 'all'
    ? data.energy
    : data.energy.filter(d => d.facility === selectedFacility)

  const kpis = calculateEnergyKPIs(filteredData)
  const facilityData = getEnergyByFacility(data.energy)

  // Monthly trends
  const monthlyData = aggregateByMonth(filteredData).slice(-12).map(m => ({
    month: m.month.slice(5),
    consumption: m.records.reduce((sum, r) => sum + (r.energy_consumption_kwh || 0), 0) / 1000,
    cost: m.records.reduce((sum, r) => sum + (r.energy_cost_usd || 0), 0),
    waterProduced: m.records.reduce((sum, r) => sum + (r.water_produced_gallons || 0), 0) / 1000,
  }))

  // Facility distribution for pie chart
  const facilityDistribution = facilityData.map(f => ({
    name: f.facility.replace(/-/g, ' '),
    value: f.totalConsumption,
  }))

  const tableColumns = [
    { header: 'Facility', accessor: 'facility' },
    { header: 'Total Consumption', render: (row) => `${formatNumber(row.totalConsumption / 1000, 1)} MWh` },
    { header: 'Total Cost', render: (row) => formatCurrency(row.totalCost) },
    {
      header: 'Efficiency',
      render: (row) => row.avgEfficiency ? `${formatNumber(row.avgEfficiency, 1)} gal/kWh` : '-',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Facility:</label>
        <select
          value={selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sarooj-500"
        >
          <option value="all">All Facilities</option>
          {facilities.map(facility => (
            <option key={facility} value={facility}>{facility.replace(/-/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Consumption"
          value={formatNumber(kpis.totalConsumption / 1000000, 2)}
          unit="MWh"
          icon={Zap}
          status="neutral"
          subtitle={`${kpis.facilityCount} facilities`}
        />
        <KPICard
          title="Total Energy Cost"
          value={formatCurrency(kpis.totalCost)}
          icon={DollarSign}
          status="neutral"
          subtitle={`$${formatNumber(kpis.avgCostPerKwh, 2)}/kWh avg`}
        />
        <KPICard
          title="Water Produced"
          value={formatNumber(kpis.totalWaterProduced / 1000000, 2)}
          unit="M gal"
          icon={Droplets}
          status="neutral"
          subtitle="From energy data"
        />
        <KPICard
          title="Avg Efficiency"
          value={formatNumber(kpis.avgEfficiency, 2)}
          unit="gal/kWh"
          icon={Factory}
          status={kpis.avgEfficiency > 0.8 ? 'good' : 'warning'}
          subtitle="Production efficiency"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption Trend */}
        <ChartCard title="Energy Consumption Trend" subtitle="Monthly consumption (MWh)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ca5eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ca5eb" stopOpacity={0} />
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
                  formatter={(value) => [`${value.toFixed(1)} MWh`, 'Consumption']}
                />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stroke="#0ca5eb"
                  fillOpacity={1}
                  fill="url(#colorEnergy)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Cost Trend */}
        <ChartCard title="Energy Cost Trend" subtitle="Monthly energy costs (USD)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${v/1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                  formatter={(value) => [formatCurrency(value), 'Cost']}
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCost)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Facility Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <ChartCard title="Consumption by Facility" subtitle="Distribution of energy usage">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={facilityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {facilityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                  formatter={(value) => [`${formatNumber(value / 1000, 1)} MWh`, 'Consumption']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard title="Facility Consumption Comparison" subtitle="Total consumption by facility" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facilityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                <YAxis dataKey="facility" type="category" tick={{ fontSize: 10 }} stroke="#9ca3af" width={150} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                  formatter={(value) => [`${formatNumber(value / 1000, 1)} MWh`, 'Consumption']}
                />
                <Bar dataKey="totalConsumption" fill="#0ca5eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Facility Table */}
      <ChartCard title="Facility Energy Details" subtitle="Detailed energy metrics by facility">
        <DataTable columns={tableColumns} data={facilityData} />
      </ChartCard>
    </div>
  )
}

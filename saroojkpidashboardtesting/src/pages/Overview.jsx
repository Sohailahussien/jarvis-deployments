import {
  Droplets,
  Network,
  Zap,
  Wrench,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import useStore from '../store/useStore'
import KPICard from '../components/common/KPICard'
import ChartCard from '../components/common/ChartCard'
import ProgressRing from '../components/common/ProgressRing'
import {
  calculateWaterQualityKPIs,
  calculateDistributionKPIs,
  calculateEnergyKPIs,
  calculateMaintenanceKPIs,
  calculateCustomerKPIs,
  getComplaintsByPriority,
  aggregateByMonth,
} from '../services/kpiCalculations'
import { formatNumber, formatCurrency, formatPercent } from '../utils/csvParser'

const COLORS = ['#0ca5eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function Overview() {
  const { data } = useStore()

  if (!data) return null

  const waterKPIs = calculateWaterQualityKPIs(data.waterQuality)
  const distributionKPIs = calculateDistributionKPIs(data.distribution)
  const energyKPIs = calculateEnergyKPIs(data.energy)
  const maintenanceKPIs = calculateMaintenanceKPIs(data.maintenance)
  const customerKPIs = calculateCustomerKPIs(data.consumption, data.complaints)
  const complaintsByPriority = getComplaintsByPriority(data.complaints)

  // Monthly energy trends
  const monthlyEnergy = aggregateByMonth(data.energy).slice(-12).map(m => ({
    month: m.month.slice(5),
    consumption: m.records.reduce((sum, r) => sum + (r.energy_consumption_kwh || 0), 0) / 1000,
    cost: m.records.reduce((sum, r) => sum + (r.energy_cost_usd || 0), 0) / 1000,
  }))

  // Monthly complaints
  const monthlyComplaints = aggregateByMonth(data.complaints, 'complaint_date').slice(-12).map(m => ({
    month: m.month.slice(5),
    total: m.count,
    resolved: m.records.filter(r => r.status === 'Resolved' || r.status === 'Closed').length,
  }))

  // Priority distribution for pie chart
  const priorityData = complaintsByPriority.map(p => ({
    name: p.priority,
    value: p.count,
  }))

  const getComplianceStatus = (value) => {
    if (value >= 95) return 'good'
    if (value >= 85) return 'warning'
    return 'critical'
  }

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Water Quality"
          value={formatPercent(waterKPIs.overallCompliance)}
          icon={Droplets}
          status={getComplianceStatus(waterKPIs.overallCompliance)}
          subtitle={`${waterKPIs.stationCount} stations`}
        />
        <KPICard
          title="Avg NRW"
          value={formatPercent(distributionKPIs.avgNRW)}
          icon={Network}
          status={distributionKPIs.avgNRW < 30 ? 'good' : distributionKPIs.avgNRW < 40 ? 'warning' : 'critical'}
          subtitle={`${distributionKPIs.zoneCount} zones`}
        />
        <KPICard
          title="Energy Cost"
          value={formatCurrency(energyKPIs.totalCost)}
          icon={Zap}
          status="neutral"
          subtitle={`${formatNumber(energyKPIs.totalConsumption / 1000000, 1)}M kWh`}
        />
        <KPICard
          title="Work Orders"
          value={formatNumber(maintenanceKPIs.totalWorkOrders)}
          icon={Wrench}
          status={maintenanceKPIs.completionRate > 90 ? 'good' : 'warning'}
          subtitle={`${formatPercent(maintenanceKPIs.completionRate)} complete`}
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(customerKPIs.totalRevenue)}
          icon={Users}
          status="neutral"
          subtitle={`${formatNumber(customerKPIs.totalCustomers)} customers`}
        />
        <KPICard
          title="Open Complaints"
          value={formatNumber(customerKPIs.openComplaints)}
          icon={MessageSquare}
          status={customerKPIs.openComplaints < 50 ? 'good' : customerKPIs.openComplaints < 100 ? 'warning' : 'critical'}
          subtitle={`${formatNumber(customerKPIs.avgResolutionTime, 1)}h avg resolution`}
        />
      </div>

      {/* Compliance & Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Quality Compliance Ring */}
        <ChartCard title="Quality Compliance" subtitle="Overall water quality metrics">
          <div className="flex items-center justify-center py-4">
            <ProgressRing value={waterKPIs.overallCompliance} size={160} color="auto" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chlorine</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPercent(waterKPIs.chlorineCompliance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">pH Level</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPercent(waterKPIs.phCompliance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Turbidity</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPercent(waterKPIs.turbidityCompliance)}
              </p>
            </div>
          </div>
        </ChartCard>

        {/* Distribution Network Status */}
        <ChartCard title="Distribution Network" subtitle="Zone performance metrics">
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pressure Compliance</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPercent(distributionKPIs.pressureCompliance)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-sarooj-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${distributionKPIs.pressureCompliance}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Flow Rate</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(distributionKPIs.totalFlowRate, 0)} <span className="text-sm font-normal">GPM</span>
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Pressure</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(distributionKPIs.avgPressure, 0)} <span className="text-sm font-normal">PSI</span>
                </p>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Maintenance Status */}
        <ChartCard title="Maintenance Status" subtitle="Work order breakdown">
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Preventive</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatNumber(maintenanceKPIs.preventiveCount)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Wrench className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Corrective</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatNumber(maintenanceKPIs.correctiveCount)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Emergency</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatNumber(maintenanceKPIs.emergencyCount)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Critical</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatNumber(maintenanceKPIs.criticalCount)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Maintenance Cost</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(maintenanceKPIs.totalCost)}
              </span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Consumption Trend */}
        <ChartCard title="Energy Consumption Trend" subtitle="Monthly consumption (MWh) and cost (K USD)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEnergy}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
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
                />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stroke="#0ca5eb"
                  fillOpacity={1}
                  fill="url(#colorConsumption)"
                  name="Consumption (MWh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Complaints Trend */}
        <ChartCard title="Complaints Trend" subtitle="Monthly complaints and resolution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComplaints}>
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
                <Legend />
                <Bar dataKey="total" name="Total" fill="#0ca5eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Priority Distribution */}
        <ChartCard title="Complaint Priority" subtitle="Distribution by priority level">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
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
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {priorityData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Customer Metrics */}
        <ChartCard title="Customer Metrics" subtitle="Billing and collection performance" className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Collection Rate</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatPercent(customerKPIs.collectionRate)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Amount</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(customerKPIs.overdueAmount)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Consumption</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(customerKPIs.avgConsumption / 1000, 1)}K
              </p>
              <p className="text-xs text-gray-500">gallons</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Satisfaction Rate</p>
              <p className="text-2xl font-bold text-sarooj-600 dark:text-sarooj-400">
                {formatPercent(customerKPIs.satisfactionRate)}
              </p>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

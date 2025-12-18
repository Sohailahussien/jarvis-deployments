import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { Wrench, Clock, DollarSign, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import useStore from '../store/useStore'
import KPICard from '../components/common/KPICard'
import ChartCard from '../components/common/ChartCard'
import DataTable from '../components/common/DataTable'
import {
  calculateMaintenanceKPIs,
  getMaintenanceByAssetType,
  getMaintenanceByFailureMode,
  aggregateByMonth,
} from '../services/kpiCalculations'
import { formatNumber, formatCurrency, groupBy } from '../utils/csvParser'

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
const PRIORITY_COLORS = { Normal: '#10b981', High: '#f59e0b', Critical: '#ef4444' }

export default function Maintenance() {
  const { data } = useStore()

  if (!data) return null

  const kpis = calculateMaintenanceKPIs(data.maintenance)
  const assetTypeData = getMaintenanceByAssetType(data.maintenance)
  const failureModeData = getMaintenanceByFailureMode(data.maintenance)

  // Monthly trends
  const monthlyData = aggregateByMonth(data.maintenance, 'maintenance_date').slice(-24).map(m => ({
    month: m.month.slice(5),
    total: m.count,
    preventive: m.records.filter(r => r.maintenance_type === 'Preventive').length,
    corrective: m.records.filter(r => r.maintenance_type === 'Corrective').length,
    emergency: m.records.filter(r => r.maintenance_type === 'Emergency').length,
    cost: m.records.reduce((sum, r) => sum + (r.cost_usd || 0), 0),
  }))

  // Maintenance type distribution
  const typeDistribution = [
    { name: 'Preventive', value: kpis.preventiveCount },
    { name: 'Corrective', value: kpis.correctiveCount },
    { name: 'Emergency', value: kpis.emergencyCount },
    { name: 'Other', value: kpis.totalWorkOrders - kpis.preventiveCount - kpis.correctiveCount - kpis.emergencyCount },
  ].filter(d => d.value > 0)

  // Priority distribution
  const priorityGroups = groupBy(data.maintenance, 'priority')
  const priorityData = Object.entries(priorityGroups).map(([priority, records]) => ({
    priority,
    count: records.length,
    avgDowntime: records.reduce((sum, r) => sum + (r.downtime_hours || 0), 0) / records.length,
  }))

  const assetColumns = [
    { header: 'Asset Type', accessor: 'assetType' },
    { header: 'Work Orders', render: (row) => formatNumber(row.count) },
    { header: 'Total Cost', render: (row) => formatCurrency(row.totalCost) },
    { header: 'Avg Downtime', render: (row) => `${formatNumber(row.avgDowntime, 1)} hrs` },
    { header: 'Parts Replaced', render: (row) => formatNumber(row.partsReplaced) },
  ]

  const failureColumns = [
    { header: 'Failure Mode', accessor: 'failureMode' },
    { header: 'Occurrences', render: (row) => formatNumber(row.count) },
    { header: 'Avg Downtime', render: (row) => `${formatNumber(row.avgDowntime, 1)} hrs` },
    { header: 'Total Cost', render: (row) => formatCurrency(row.totalCost) },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Work Orders"
          value={formatNumber(kpis.totalWorkOrders)}
          icon={Wrench}
          status="neutral"
          subtitle={`${formatNumber(kpis.completedWorkOrders)} completed`}
        />
        <KPICard
          title="Completion Rate"
          value={`${formatNumber(kpis.completionRate, 1)}%`}
          icon={CheckCircle}
          status={kpis.completionRate >= 95 ? 'good' : kpis.completionRate >= 85 ? 'warning' : 'critical'}
          subtitle="Work order completion"
        />
        <KPICard
          title="Avg Downtime"
          value={formatNumber(kpis.avgDowntime, 1)}
          unit="hours"
          icon={Clock}
          status={kpis.avgDowntime < 5 ? 'good' : kpis.avgDowntime < 15 ? 'warning' : 'critical'}
          subtitle="Per work order"
        />
        <KPICard
          title="Total Cost"
          value={formatCurrency(kpis.totalCost)}
          icon={DollarSign}
          status="neutral"
          subtitle={`${formatNumber(kpis.emergencyCount)} emergencies`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance Type Distribution */}
        <ChartCard title="Maintenance Types" subtitle="Distribution by type">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {typeDistribution.map((entry, index) => (
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
        </ChartCard>

        {/* Monthly Trend */}
        <ChartCard title="Monthly Work Orders" subtitle="Maintenance activity trend" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData.slice(-12)}>
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
                <Bar dataKey="preventive" name="Preventive" stackId="a" fill="#10b981" />
                <Bar dataKey="corrective" name="Corrective" stackId="a" fill="#f59e0b" />
                <Bar dataKey="emergency" name="Emergency" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <ChartCard title="Priority Distribution" subtitle="Work orders by priority level">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="priority" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Work Orders"
                  radius={[4, 4, 0, 0]}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || '#0ca5eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Cost Trend */}
        <ChartCard title="Maintenance Cost Trend" subtitle="Monthly maintenance costs">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData.slice(-12)}>
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
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#0ca5eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Maintenance by Asset Type" subtitle="Work orders and costs by asset category">
          <DataTable columns={assetColumns} data={assetTypeData} />
        </ChartCard>

        <ChartCard title="Failure Mode Analysis" subtitle="Common failure modes and impact">
          <DataTable columns={failureColumns} data={failureModeData.slice(0, 8)} />
        </ChartCard>
      </div>
    </div>
  )
}

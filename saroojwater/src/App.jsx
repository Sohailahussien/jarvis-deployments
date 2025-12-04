import { Component, useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import {
  Truck, Package, AlertTriangle, DollarSign, Clock, Users,
  TrendingUp, MapPin, CheckCircle, XCircle, Printer
} from 'lucide-react';
import { deliveryData, calculateDuration, getRouteType } from './data';

// Error Boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
          <div className="bg-slate-800 rounded-lg p-8 max-w-lg text-center border border-red-500/30">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">An unexpected error occurred.</p>
            <pre className="text-left bg-black/30 rounded p-3 mb-4 text-xs text-red-400 overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Stats Card Component
function StatCard({ icon: Icon, title, value, subtitle, trend, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    red: "bg-red-500/20 text-red-400",
    purple: "bg-purple-500/20 text-purple-400"
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// Section Header
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function App() {
  const [activeSection, setActiveSection] = useState('overview');

  // Calculate all statistics
  const stats = useMemo(() => {
    const totalDeliveries = deliveryData.reduce((sum, d) => sum + d.completed + d.failed, 0);
    const completedDeliveries = deliveryData.reduce((sum, d) => sum + d.completed, 0);
    const failedDeliveries = deliveryData.reduce((sum, d) => sum + d.failed, 0);
    const successRate = ((completedDeliveries / totalDeliveries) * 100).toFixed(1);
    const totalRevenue = deliveryData.reduce((sum, d) => sum + d.revenue, 0);
    const totalCases = deliveryData.reduce((sum, d) => sum + d.casesDelivered, 0);
    const totalDistance = deliveryData.reduce((sum, d) => sum + d.distanceKm, 0);
    const totalFuelCost = deliveryData.reduce((sum, d) => sum + d.fuelCostOmr, 0);

    return {
      totalDeliveries,
      completedDeliveries,
      failedDeliveries,
      successRate,
      totalRevenue,
      totalCases,
      totalDistance,
      totalFuelCost
    };
  }, []);

  // Failed delivery reasons
  const failedReasons = useMemo(() => {
    const reasons = {};
    deliveryData.forEach(d => {
      if (d.failed > 0 && d.failedReason) {
        const reason = d.failedReason;
        if (!reasons[reason]) {
          reasons[reason] = { name: reason, count: 0, deliveries: [] };
        }
        reasons[reason].count += d.failed;
        reasons[reason].deliveries.push({ route: d.routeName, date: d.date, driver: d.driverName });
      }
    });
    return Object.values(reasons).sort((a, b) => b.count - a.count);
  }, []);

  // Revenue by region
  const revenueByRegion = useMemo(() => {
    const regions = {};
    deliveryData.forEach(d => {
      if (!regions[d.region]) {
        regions[d.region] = { name: d.region, revenue: 0, deliveries: 0, cases: 0 };
      }
      regions[d.region].revenue += d.revenue;
      regions[d.region].deliveries += d.completed;
      regions[d.region].cases += d.casesDelivered;
    });
    return Object.values(regions).sort((a, b) => b.revenue - a.revenue);
  }, []);

  // Delivery time by route type
  const deliveryTimeByType = useMemo(() => {
    const urban = { type: 'Urban', totalTime: 0, count: 0, totalDeliveries: 0 };
    const longHaul = { type: 'Long-haul', totalTime: 0, count: 0, totalDeliveries: 0 };

    deliveryData.forEach(d => {
      const duration = calculateDuration(d.startTime, d.endTime);
      const routeType = getRouteType(d.routeName, d.distanceKm);

      if (routeType === 'Urban') {
        urban.totalTime += duration;
        urban.count++;
        urban.totalDeliveries += d.completed;
      } else {
        longHaul.totalTime += duration;
        longHaul.count++;
        longHaul.totalDeliveries += d.completed;
      }
    });

    return [
      {
        type: 'Urban Routes',
        avgTime: Math.round(urban.totalTime / urban.count),
        avgDeliveriesPerTrip: Math.round(urban.totalDeliveries / urban.count),
        trips: urban.count
      },
      {
        type: 'Long-haul Routes',
        avgTime: Math.round(longHaul.totalTime / longHaul.count),
        avgDeliveriesPerTrip: Math.round(longHaul.totalDeliveries / longHaul.count),
        trips: longHaul.count
      }
    ];
  }, []);

  // Driver performance
  const driverPerformance = useMemo(() => {
    const drivers = {};
    deliveryData.forEach(d => {
      if (!drivers[d.driverId]) {
        drivers[d.driverId] = {
          id: d.driverId,
          name: d.driverName,
          trips: 0,
          completed: 0,
          failed: 0,
          revenue: 0,
          cases: 0,
          distance: 0,
          fuelCost: 0,
          totalTime: 0
        };
      }
      const driver = drivers[d.driverId];
      driver.trips++;
      driver.completed += d.completed;
      driver.failed += d.failed;
      driver.revenue += d.revenue;
      driver.cases += d.casesDelivered;
      driver.distance += d.distanceKm;
      driver.fuelCost += d.fuelCostOmr;
      driver.totalTime += calculateDuration(d.startTime, d.endTime);
    });

    return Object.values(drivers).map(d => ({
      ...d,
      successRate: ((d.completed / (d.completed + d.failed)) * 100).toFixed(1),
      avgCasesPerTrip: Math.round(d.cases / d.trips),
      revenuePerKm: (d.revenue / d.distance).toFixed(2),
      efficiencyScore: Math.round(
        (parseFloat(((d.completed / (d.completed + d.failed)) * 100).toFixed(1)) * 0.4) +
        ((d.cases / d.trips) * 0.02) +
        ((d.revenue / d.distance) * 5)
      )
    })).sort((a, b) => b.efficiencyScore - a.efficiencyScore);
  }, []);

  // Daily revenue trend
  const dailyRevenue = useMemo(() => {
    const daily = {};
    deliveryData.forEach(d => {
      if (!daily[d.date]) {
        daily[d.date] = { date: d.date, revenue: 0, deliveries: 0 };
      }
      daily[d.date].revenue += d.revenue;
      daily[d.date].deliveries += d.completed;
    });
    return Object.values(daily).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-10 backdrop-blur-sm no-print">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Truck className="text-blue-400" size={28} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Delivery Performance Report</h1>
                  <p className="text-slate-400 text-sm">Sarooj Water - January 2024</p>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
              >
                <Printer size={18} />
                Print Report
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Executive Summary */}
          <section className="mb-10">
            <SectionHeader
              title="Executive Summary"
              subtitle="Key performance indicators for fleet operations - January 1-7, 2024"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Package}
                title="Total Deliveries"
                value={stats.totalDeliveries.toLocaleString()}
                subtitle={`${stats.completedDeliveries} completed`}
                color="blue"
              />
              <StatCard
                icon={CheckCircle}
                title="Success Rate"
                value={`${stats.successRate}%`}
                subtitle={`${stats.failedDeliveries} failed deliveries`}
                color="green"
              />
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={`${stats.totalRevenue.toLocaleString()} OMR`}
                subtitle={`${stats.totalCases.toLocaleString()} cases delivered`}
                color="purple"
              />
              <StatCard
                icon={Truck}
                title="Fleet Utilization"
                value={`${stats.totalDistance.toLocaleString()} km`}
                subtitle={`${stats.totalFuelCost.toFixed(2)} OMR fuel cost`}
                color="yellow"
              />
            </div>
          </section>

          {/* Failed Delivery Analysis */}
          <section className="mb-10 print-break">
            <SectionHeader
              title="Failed Delivery Analysis"
              subtitle={`${stats.failedDeliveries} failed deliveries identified with root causes`}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Failure Reasons Distribution</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={failedReasons}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={{ stroke: '#64748b' }}
                      >
                        {failedReasons.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#f8fafc' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Failure Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-2 text-slate-400 font-medium">Reason</th>
                        <th className="text-center py-3 px-2 text-slate-400 font-medium">Count</th>
                        <th className="text-left py-3 px-2 text-slate-400 font-medium">Affected Routes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {failedReasons.map((reason, i) => (
                        <tr key={i} className="border-b border-slate-700/50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                              <span className="text-white">{reason.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-sm font-medium">
                              {reason.count}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-slate-400 text-sm">
                            {[...new Set(reason.deliveries.map(d => d.route))].join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Revenue by Region */}
          <section className="mb-10">
            <SectionHeader
              title="Revenue by Region"
              subtitle="Geographic distribution of sales and delivery performance"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Revenue Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByRegion} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `${v.toLocaleString()}`} />
                      <YAxis type="category" dataKey="name" stroke="#64748b" width={90} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#f8fafc' }}
                        formatter={(value) => [`${value.toLocaleString()} OMR`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Region Stats Table */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Regional Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-2 text-slate-400 font-medium">Region</th>
                        <th className="text-right py-3 px-2 text-slate-400 font-medium">Revenue</th>
                        <th className="text-right py-3 px-2 text-slate-400 font-medium">Deliveries</th>
                        <th className="text-right py-3 px-2 text-slate-400 font-medium">Cases</th>
                        <th className="text-right py-3 px-2 text-slate-400 font-medium">Avg/Delivery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueByRegion.map((region, i) => (
                        <tr key={i} className="border-b border-slate-700/50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-blue-400" />
                              <span className="text-white font-medium">{region.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right text-green-400 font-medium">
                            {region.revenue.toLocaleString()} OMR
                          </td>
                          <td className="py-3 px-2 text-right text-slate-300">
                            {region.deliveries}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-300">
                            {region.cases.toLocaleString()}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-300">
                            {(region.revenue / region.deliveries).toFixed(2)} OMR
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-600">
                        <td className="py-3 px-2 text-white font-bold">Total</td>
                        <td className="py-3 px-2 text-right text-green-400 font-bold">
                          {stats.totalRevenue.toLocaleString()} OMR
                        </td>
                        <td className="py-3 px-2 text-right text-white font-bold">
                          {stats.completedDeliveries}
                        </td>
                        <td className="py-3 px-2 text-right text-white font-bold">
                          {stats.totalCases.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right text-white font-bold">
                          {(stats.totalRevenue / stats.completedDeliveries).toFixed(2)} OMR
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Time Analysis */}
          <section className="mb-10 print-break">
            <SectionHeader
              title="Delivery Time by Route Type"
              subtitle="Comparison of urban vs long-haul delivery efficiency"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Urban Card */}
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/30 rounded-lg">
                    <MapPin className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Urban Routes</h3>
                    <p className="text-blue-300 text-sm">{deliveryTimeByType[0].trips} trips completed</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Average Trip Duration</p>
                    <p className="text-3xl font-bold text-white">
                      {Math.floor(deliveryTimeByType[0].avgTime / 60)}h {deliveryTimeByType[0].avgTime % 60}m
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Avg Deliveries per Trip</p>
                    <p className="text-2xl font-bold text-blue-400">{deliveryTimeByType[0].avgDeliveriesPerTrip}</p>
                  </div>
                </div>
              </div>

              {/* Long-haul Card */}
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-500/30 rounded-lg">
                    <Truck className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Long-haul Routes</h3>
                    <p className="text-purple-300 text-sm">{deliveryTimeByType[1].trips} trips completed</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Average Trip Duration</p>
                    <p className="text-3xl font-bold text-white">
                      {Math.floor(deliveryTimeByType[1].avgTime / 60)}h {deliveryTimeByType[1].avgTime % 60}m
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Avg Deliveries per Trip</p>
                    <p className="text-2xl font-bold text-purple-400">{deliveryTimeByType[1].avgDeliveriesPerTrip}</p>
                  </div>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Efficiency Comparison</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deliveryTimeByType}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="type" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#f8fafc' }}
                      />
                      <Bar dataKey="avgDeliveriesPerTrip" name="Deliveries/Trip" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-300 text-sm">
                    <span className="text-blue-400 font-medium">Urban routes</span> complete
                    <span className="text-white font-bold"> {Math.round((deliveryTimeByType[0].avgDeliveriesPerTrip / deliveryTimeByType[1].avgDeliveriesPerTrip - 1) * -100)}% fewer </span>
                    deliveries per trip but in
                    <span className="text-white font-bold"> {Math.round((deliveryTimeByType[1].avgTime / deliveryTimeByType[0].avgTime - 1) * 100)}% less time</span>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Driver Performance */}
          <section className="mb-10">
            <SectionHeader
              title="Driver Performance Rankings"
              subtitle="Individual driver metrics and efficiency scores"
            />
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700/30">
                      <th className="text-left py-4 px-4 text-slate-400 font-medium">Rank</th>
                      <th className="text-left py-4 px-4 text-slate-400 font-medium">Driver</th>
                      <th className="text-center py-4 px-4 text-slate-400 font-medium">Trips</th>
                      <th className="text-center py-4 px-4 text-slate-400 font-medium">Completed</th>
                      <th className="text-center py-4 px-4 text-slate-400 font-medium">Failed</th>
                      <th className="text-center py-4 px-4 text-slate-400 font-medium">Success Rate</th>
                      <th className="text-right py-4 px-4 text-slate-400 font-medium">Revenue</th>
                      <th className="text-right py-4 px-4 text-slate-400 font-medium">Cases</th>
                      <th className="text-center py-4 px-4 text-slate-400 font-medium">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverPerformance.map((driver, i) => (
                      <tr key={driver.id} className={`border-b border-slate-700/50 ${i < 3 ? 'bg-slate-700/20' : ''}`}>
                        <td className="py-4 px-4">
                          <span className={`
                            inline-flex items-center justify-center w-8 h-8 rounded-full font-bold
                            ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : ''}
                            ${i === 1 ? 'bg-slate-400/20 text-slate-300' : ''}
                            ${i === 2 ? 'bg-amber-600/20 text-amber-500' : ''}
                            ${i > 2 ? 'bg-slate-700/50 text-slate-400' : ''}
                          `}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {driver.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-white font-medium">{driver.name}</p>
                              <p className="text-slate-500 text-sm">{driver.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-slate-300">{driver.trips}</td>
                        <td className="py-4 px-4 text-center text-green-400 font-medium">{driver.completed}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={driver.failed > 0 ? 'text-red-400' : 'text-slate-500'}>
                            {driver.failed}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`
                            px-2 py-1 rounded-full text-sm font-medium
                            ${parseFloat(driver.successRate) >= 98 ? 'bg-green-500/20 text-green-400' : ''}
                            ${parseFloat(driver.successRate) >= 95 && parseFloat(driver.successRate) < 98 ? 'bg-yellow-500/20 text-yellow-400' : ''}
                            ${parseFloat(driver.successRate) < 95 ? 'bg-red-500/20 text-red-400' : ''}
                          `}>
                            {driver.successRate}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-white font-medium">
                          {driver.revenue.toLocaleString()} OMR
                        </td>
                        <td className="py-4 px-4 text-right text-slate-300">
                          {driver.cases.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                                style={{ width: `${Math.min(driver.efficiencyScore, 100)}%` }}
                              />
                            </div>
                            <span className="text-white font-medium w-8">{driver.efficiencyScore}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Daily Revenue Trend */}
          <section className="mb-10 print-break">
            <SectionHeader
              title="Daily Revenue Trend"
              subtitle="Revenue and delivery volume over the reporting period"
            />
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyRevenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#64748b" tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })} />
                    <YAxis stroke="#64748b" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#f8fafc' }}
                      formatter={(value, name) => [
                        name === 'revenue' ? `${value.toLocaleString()} OMR` : value,
                        name === 'revenue' ? 'Revenue' : 'Deliveries'
                      ]}
                      labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Management Summary */}
          <section className="mb-10">
            <SectionHeader
              title="Management Summary"
              subtitle="Key findings and recommendations"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Findings */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="text-green-400" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Key Findings</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-300">
                      <strong className="text-white">97.7% delivery success rate</strong> - exceeds industry standard of 95%
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-300">
                      <strong className="text-white">Muscat region</strong> generates 58% of total revenue ({revenueByRegion.find(r => r.name === 'Muscat')?.revenue.toLocaleString()} OMR)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-300">
                      <strong className="text-white">Top 3 drivers</strong> (Hamad, Said, Ahmed) maintain 99%+ success rates
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-300">
                      <strong className="text-white">Urban routes</strong> are 60% more time-efficient per delivery than long-haul
                    </span>
                  </li>
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/5 rounded-xl p-6 border border-yellow-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <AlertTriangle className="text-yellow-400" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Recommendations</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <XCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-300">
                      <strong className="text-white">Address Musandam route</strong> - 88% success rate needs investigation (border delays)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-300">
                      <strong className="text-white">Implement pre-delivery confirmation</strong> to reduce "customer closed/not home" failures
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-300">
                      <strong className="text-white">Expand Dhofar coverage</strong> - highest revenue per delivery (91.4 OMR avg)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-300">
                      <strong className="text-white">Vehicle maintenance check</strong> for VH-008 after breakdown incident
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-slate-700/50">
            <p className="text-slate-500 text-sm">
              Report generated for Sarooj Water Distribution | Data period: January 1-7, 2024
            </p>
          </footer>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;

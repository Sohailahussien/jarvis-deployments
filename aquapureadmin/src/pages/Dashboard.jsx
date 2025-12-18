import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { STORAGE_KEYS } from '../services/mockData';
import StatusBadge from '../components/common/StatusBadge';
import { format } from 'date-fns';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    production: [],
    equipment: [],
    alerts: [],
    waterQuality: [],
    processes: []
  });

  useEffect(() => {
    // Load all data from localStorage
    const production = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTION) || '[]');
    const equipment = JSON.parse(localStorage.getItem(STORAGE_KEYS.EQUIPMENT) || '[]');
    const alerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALERTS) || '[]');
    const waterQuality = JSON.parse(localStorage.getItem(STORAGE_KEYS.WATER_QUALITY) || '[]');
    const processes = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROCESSES) || '[]');

    setStats({ production, equipment, alerts, waterQuality, processes });
  }, []);

  // Calculate summary metrics
  const totalProduction = stats.production.reduce((sum, p) => sum + p.waterProduced, 0);
  const avgEfficiency = stats.production.length > 0
    ? (stats.production.reduce((sum, p) => sum + p.efficiency, 0) / stats.production.length).toFixed(1)
    : 0;
  const activeAlerts = stats.alerts.filter(a => a.status === 'active').length;
  const operationalEquipment = stats.equipment.filter(e => e.status === 'operational').length;
  const runningProcesses = stats.processes.filter(p => p.status === 'running').length;

  // Prepare chart data
  const productionChartData = stats.production.slice(0, 7).reverse().map(p => ({
    date: format(new Date(p.date), 'MMM d'),
    produced: p.waterProduced,
    target: p.waterTarget
  }));

  const equipmentStatusData = [
    { name: 'Operational', value: stats.equipment.filter(e => e.status === 'operational').length },
    { name: 'Maintenance', value: stats.equipment.filter(e => e.status === 'maintenance').length },
    { name: 'Warning', value: stats.equipment.filter(e => e.status === 'warning').length },
    { name: 'Critical', value: stats.equipment.filter(e => e.status === 'critical').length },
  ].filter(d => d.value > 0);

  const alertsByType = [
    { type: 'Critical', count: stats.alerts.filter(a => a.type === 'critical' && a.status === 'active').length },
    { type: 'Warning', count: stats.alerts.filter(a => a.type === 'warning' && a.status === 'active').length },
    { type: 'Info', count: stats.alerts.filter(a => a.type === 'info' && a.status === 'active').length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-dark-400 mt-1">Real-time overview of your water treatment operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Total Production</p>
              <p className="text-2xl font-bold text-white mt-1">{(totalProduction / 1000).toFixed(1)}k</p>
              <p className="text-xs text-dark-500">cubic meters</p>
            </div>
            <div className="p-3 bg-primary-600/20 rounded-lg">
              <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Avg Efficiency</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{avgEfficiency}%</p>
              <p className="text-xs text-dark-500">across all plants</p>
            </div>
            <div className="p-3 bg-green-600/20 rounded-lg">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Active Alerts</p>
              <p className={`text-2xl font-bold mt-1 ${activeAlerts > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {activeAlerts}
              </p>
              <p className="text-xs text-dark-500">require attention</p>
            </div>
            <div className={`p-3 rounded-lg ${activeAlerts > 0 ? 'bg-red-600/20' : 'bg-green-600/20'}`}>
              <svg className={`w-6 h-6 ${activeAlerts > 0 ? 'text-red-400' : 'text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Equipment</p>
              <p className="text-2xl font-bold text-white mt-1">
                {operationalEquipment}/{stats.equipment.length}
              </p>
              <p className="text-xs text-dark-500">operational</p>
            </div>
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm">Processes</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                {runningProcesses}/{stats.processes.length}
              </p>
              <p className="text-xs text-dark-500">running</p>
            </div>
            <div className="p-3 bg-cyan-600/20 rounded-lg">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Production Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Area type="monotone" dataKey="target" stroke="#64748b" fill="#334155" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="produced" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equipment Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Equipment Status</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={equipmentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {equipmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {equipmentStatusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-dark-400">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {stats.alerts.filter(a => a.status === 'active').slice(0, 4).map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-dark-900 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'critical' ? 'bg-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{alert.title}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{alert.source}</p>
                </div>
                <StatusBadge status={alert.priority} />
              </div>
            ))}
            {stats.alerts.filter(a => a.status === 'active').length === 0 && (
              <div className="text-center py-8 text-dark-400">
                <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">No active alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Alert Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Alert Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertsByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis dataKey="type" type="category" stroke="#64748b" fontSize={12} width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Water Quality */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Water Quality</h3>
          <div className="space-y-3">
            {stats.waterQuality.slice(0, 4).map(sample => (
              <div key={sample.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg">
                <div>
                  <p className="text-sm text-white">{sample.sampleId}</p>
                  <p className="text-xs text-dark-400">{sample.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-dark-200">TDS: {sample.tds}</p>
                  <StatusBadge status={sample.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

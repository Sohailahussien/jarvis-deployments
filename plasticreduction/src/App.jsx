import { Component, useState, useEffect } from 'react'
import {
  Factory, TrendingUp, Target, BarChart3, Settings,
  Droplets, DollarSign, Warehouse, ChevronDown,
  Sun, Moon, X, Activity, Gauge, Zap, Recycle,
  Bell, Package, QrCode, Calculator, Leaf, AlertTriangle,
  LogOut, Shield, Users
} from 'lucide-react'
import useStore from './store/useStore'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './components/LoginPage'
import AdminLayout from './components/AdminLayout'
import UserManagement from './components/admin/UserManagement'
import ProductionManagement from './components/admin/ProductionManagement'
import EquipmentManagement from './components/admin/EquipmentManagement'
import WaterQualityManagement from './components/admin/WaterQualityManagement'
import ProcessManagement from './components/admin/ProcessManagement'
import AlertManagement from './components/admin/AlertManagement'
import KPICard from './components/KPICard'
import StrategyCard from './components/StrategyCard'
import WasteChart from './components/WasteChart'
import ActionModal from './components/ActionModal'
import RecommendationPanel from './components/RecommendationPanel'
import ProductCard from './components/ProductCard'
import ProductModal from './components/ProductModal'
import ReturnTracking from './components/ReturnTracking'
import WhatIfSimulator from './components/WhatIfSimulator'
import ProductionMetricsPanel from './components/ProductionMetricsPanel'
import ProcessOptimizationPanel from './components/ProcessOptimizationPanel'
import WaterQualityPanel from './components/WaterQualityPanel'
import EquipmentHealthPanel from './components/EquipmentHealthPanel'
import ProductionOutputPanel from './components/ProductionOutputPanel'

import saroojLogo from '/sarooj-logo.png'

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
          <div className="bg-gray-800 rounded-lg p-8 max-w-lg text-center border border-red-500/30">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">An unexpected error occurred.</p>
            <pre className="text-left bg-black/30 rounded p-3 mb-4 text-xs text-red-400 overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// Admin Panel Component
function AdminPanel() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const { auditLog } = useAuth()

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />
      case 'production':
        return <ProductionManagement />
      case 'equipment':
        return <EquipmentManagement />
      case 'water-quality':
        return <WaterQualityManagement />
      case 'process':
        return <ProcessManagement />
      case 'alerts':
        return <AlertManagement />
      case 'audit':
        return <AuditLogView auditLog={auditLog} />
      case 'settings':
        return <AdminSettings />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </AdminLayout>
  )
}

// Admin Dashboard Component
function AdminDashboard() {
  const { users, auditLog } = useAuth()
  const { alerts, getPlantOEE, getProcessHealth, getEquipmentHealth } = useStore()

  const plantOEE = getPlantOEE()
  const processHealth = getProcessHealth()
  const equipmentHealth = getEquipmentHealth()
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged)
  const recentActivity = auditLog.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-slate-400 text-sm">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Gauge className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{(plantOEE * 100).toFixed(1)}%</p>
              <p className="text-slate-400 text-sm">Plant OEE</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{unacknowledgedAlerts.length}</p>
              <p className="text-slate-400 text-sm">Active Alerts</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{processHealth.avgEfficiency.toFixed(0)}%</p>
              <p className="text-slate-400 text-sm">Process Health</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map(entry => (
              <div key={entry.id} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {entry.userName?.charAt(0) || 'S'}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{entry.details}</p>
                  <p className="text-slate-500 text-xs">{entry.userName} - {new Date(entry.timestamp).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  entry.action.includes('DELETE') ? 'bg-red-500/20 text-red-400' :
                  entry.action.includes('CREATE') || entry.action.includes('ADD') ? 'bg-green-500/20 text-green-400' :
                  entry.action.includes('LOGIN') ? 'bg-blue-500/20 text-blue-400' :
                  'bg-slate-500/20 text-slate-400'
                }`}>
                  {entry.action}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No recent activity</p>
        )}
      </div>
    </div>
  )
}

// Audit Log View Component
function AuditLogView({ auditLog }) {
  const [filter, setFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('all')

  const filteredLog = auditLog.filter(entry => {
    const matchesSearch = filter === '' ||
      entry.details.toLowerCase().includes(filter.toLowerCase()) ||
      entry.userName.toLowerCase().includes(filter.toLowerCase())
    const matchesAction = actionFilter === 'all' || entry.action === actionFilter
    return matchesSearch && matchesAction
  })

  const actions = [...new Set(auditLog.map(e => e.action))]

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Details']
    const rows = filteredLog.map(e => [
      new Date(e.timestamp).toISOString(),
      e.userName,
      e.action,
      e.details
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Audit Log</h2>
          <p className="text-slate-400 text-sm mt-1">Track all system activities</p>
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          Export CSV
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search..."
          className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Actions</option>
          {actions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Timestamp</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">User</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Action</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredLog.slice(0, 50).map(entry => (
              <tr key={entry.id} className="hover:bg-slate-700/50">
                <td className="px-6 py-4 text-slate-300 text-sm">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4 text-white text-sm">{entry.userName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    entry.action.includes('DELETE') ? 'bg-red-500/20 text-red-400' :
                    entry.action.includes('CREATE') || entry.action.includes('ADD') ? 'bg-green-500/20 text-green-400' :
                    entry.action.includes('LOGIN') ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {entry.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300 text-sm">{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLog.length === 0 && (
          <div className="p-8 text-center text-slate-400">No entries found</div>
        )}
      </div>
    </div>
  )
}

// Admin Settings Component
function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <p className="text-slate-400 text-sm mt-1">System configuration</p>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <p className="text-slate-400">Settings panel coming soon...</p>
      </div>
    </div>
  )
}

function AppContent() {
  const { user, logout, hasPermission } = useAuth()
  const [selectedStrategy, setSelectedStrategy] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [filterStatus, setFilterStatus] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [showSettings, setShowSettings] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('sarooj-theme')
    return saved || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('sarooj-theme', theme)
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode')
    } else {
      document.documentElement.classList.remove('light-mode')
    }
  }, [theme])

  const {
    sustainability,
    monthlyTrend,
    wasteSources,
    strategies,
    products,
    utilities,
    alerts,
    productionOutput,
    getKPIs,
    getStrategyStats,
    getProductStats,
    getPlantOEE,
    getProcessHealth,
    getEquipmentHealth,
    acknowledgeAlert
  } = useStore()

  const wasteData = sustainability.plastic
  const kpis = getKPIs()
  const strategyStats = getStrategyStats()
  const productStats = getProductStats()
  const plantOEE = getPlantOEE()
  const processHealth = getProcessHealth()
  const equipmentHealth = getEquipmentHealth()

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged)

  const filteredProducts = products.filter(p =>
    productFilter === 'all' || p.category === productFilter
  )

  const filteredStrategies = strategies.filter(s =>
    filterStatus === 'all' || s.status === filterStatus
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/80 border-b border-gray-700/50 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={saroojLogo} alt="Sarooj" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-white">Sarooj Manufacturing</h1>
                <p className="text-xs text-gray-400">Water Bottling Process Optimization</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Alerts Indicator */}
              {unacknowledgedAlerts.length > 0 && (
                <div className="relative">
                  <button className="p-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-amber-400" />
                  </button>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unacknowledgedAlerts.length}
                  </span>
                </div>
              )}
              {/* OEE Display */}
              <div className="text-right hidden md:block">
                <p className="text-sm text-gray-400">Plant OEE</p>
                <p className={`text-lg font-bold ${plantOEE * 100 >= 85 ? 'text-green-400' : plantOEE * 100 >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {(plantOEE * 100).toFixed(1)}%
                </p>
              </div>

              {/* Admin Panel Access - Only for admins and operators */}
              {(user?.role === 'admin' || hasPermission('edit_production')) && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
                  title="Admin Panel"
                >
                  <Shield className="w-5 h-5 text-purple-400" />
                </button>
              )}

              <button
                onClick={() => setShowSettings(true)}
                className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-700">
                <div className="hidden md:block text-right">
                  <p className="text-sm text-white font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                </div>
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <button
                  onClick={logout}
                  className="p-2 bg-gray-700/50 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors text-gray-400"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/50 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'process', label: 'Process', icon: Activity },
              { id: 'equipment', label: 'Equipment', icon: Settings },
              { id: 'products', label: 'Products', icon: Droplets },
              { id: 'returns', label: 'Returns', icon: QrCode },
              { id: 'simulator', label: 'What-If', icon: Calculator },
              { id: 'strategies', label: 'Optimization', icon: Target },
              { id: 'sustainability', label: 'Sustainability', icon: Leaf },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-blue-400'
                    : 'text-gray-400 border-transparent hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <KPICard
                title="Plant OEE"
                value={(plantOEE * 100).toFixed(1)}
                unit="%"
                icon={Gauge}
                color="blue"
                target={85}
                targetLabel="World Class"
              />
              <KPICard
                title="Daily Output"
                value={(productionOutput.daily.reduce((a, d) => a + d.bottles, 0) / 7 / 1000).toFixed(0)}
                unit="K/day"
                icon={Factory}
                color="emerald"
              />
              <KPICard
                title="Process Health"
                value={processHealth.avgEfficiency.toFixed(1)}
                unit="%"
                icon={Activity}
                color="cyan"
              />
              <KPICard
                title="Equipment Uptime"
                value={((equipmentHealth.running / equipmentHealth.total) * 100).toFixed(0)}
                unit="%"
                icon={Settings}
                color="purple"
              />
              <KPICard
                title="Water Recovery"
                value={utilities.water.recoveryRate.toFixed(1)}
                unit="%"
                icon={Droplets}
                color="blue"
              />
              <KPICard
                title="Energy Usage"
                value={(utilities.electricity.current).toFixed(0)}
                unit="kW"
                icon={Zap}
                color="yellow"
              />
            </div>

            {/* Main Panels Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ProductionOutputPanel />
              <ProductionMetricsPanel />
            </div>

            {/* Process & Quality Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ProcessOptimizationPanel />
              <WaterQualityPanel />
            </div>

            {/* Alerts & Recommendations */}
            {unacknowledgedAlerts.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-white font-semibold">Active Alerts</h3>
                  <span className="text-xs text-gray-500">({unacknowledgedAlerts.length} unacknowledged)</span>
                </div>
                <div className="space-y-2">
                  {unacknowledgedAlerts.slice(0, 3).map(alert => (
                    <div
                      key={alert.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        alert.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
                        alert.type === 'alert' ? 'bg-red-500/10 border border-red-500/20' :
                        'bg-blue-500/10 border border-blue-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-4 h-4 ${
                          alert.type === 'warning' ? 'text-amber-400' :
                          alert.type === 'alert' ? 'text-red-400' :
                          'text-blue-400'
                        }`} />
                        <div>
                          <p className="text-white text-sm">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.timestamp}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700/50"
                      >
                        Acknowledge
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Process Monitoring</h2>
              <p className="text-gray-400 text-sm">Real-time process stage monitoring and optimization</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <ProcessOptimizationPanel />
              <WaterQualityPanel />
            </div>
            <ProductionOutputPanel />
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Equipment Management</h2>
              <p className="text-gray-400 text-sm">Monitor equipment health and maintenance schedules</p>
            </div>
            <EquipmentHealthPanel />
            <div className="grid lg:grid-cols-2 gap-6">
              <ProductionMetricsPanel />
              <RecommendationPanel />
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header with Product Lineup Image */}
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/20 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <img
                  src="/products-lineup.png"
                  alt="Sarooj Product Lineup"
                  className="w-full lg:w-1/3 h-auto rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Sarooj Water Products</h2>
                  <p className="text-gray-400 mb-4">Complete lineup of bottled drinking water products with production and sales analytics</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-400">{products.length}</p>
                      <p className="text-xs text-gray-500">Products</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-green-400">{(productStats.totalRevenue / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-gray-500">Revenue (OMR)</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-amber-400">{productStats.totalPlasticUsed.toFixed(0)}</p>
                      <p className="text-xs text-gray-500">Plastic (kg)</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-purple-400">{productStats.sellThroughRate.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">Sell-Through</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard
                title="Total Production"
                value={(productStats.totalProduction / 1000).toFixed(0)}
                unit="K units"
                icon={Factory}
                color="blue"
              />
              <KPICard
                title="Total Sales"
                value={(productStats.totalSales / 1000).toFixed(0)}
                unit="K units"
                icon={TrendingUp}
                color="green"
              />
              <KPICard
                title="Gross Profit"
                value={(productStats.grossProfit / 1000).toFixed(1)}
                unit="K OMR"
                icon={DollarSign}
                color="emerald"
              />
              <KPICard
                title="Inventory"
                value={(productStats.totalInventory / 1000).toFixed(0)}
                unit="K units"
                icon={Warehouse}
                color="purple"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Product Catalog</h3>
                <p className="text-gray-400 text-sm">Click a product for detailed analytics</p>
              </div>
              <div className="relative">
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Products</option>
                  <option value="returnable">Returnable</option>
                  <option value="single-use">Single-Use</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Droplets className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No products found with the selected filter</p>
              </div>
            )}
          </div>
        )}

        {/* Return Tracking Tab */}
        {activeTab === 'returns' && <ReturnTracking />}

        {/* What-If Simulator Tab */}
        {activeTab === 'simulator' && <WhatIfSimulator />}

        {/* Optimization Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Optimization Strategies</h2>
                <p className="text-gray-400 text-sm">Track and manage process improvement initiatives</p>
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                  <option value="Research">Research</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Strategy Impact Summary */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Total Initiatives</p>
                <p className="text-3xl font-bold text-white">{strategyStats.total}</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-400">{strategyStats.completed}</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-blue-400">{strategyStats.inProgress}</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Achieved Savings</p>
                <p className="text-3xl font-bold text-emerald-400">{strategyStats.achievedReduction.toLocaleString()}</p>
                <p className="text-xs text-gray-500">kg/year</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStrategies.map(strategy => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onSelect={setSelectedStrategy}
                />
              ))}
            </div>

            {filteredStrategies.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No strategies found with the selected filter</p>
              </div>
            )}
          </div>
        )}

        {/* Sustainability Tab */}
        {activeTab === 'sustainability' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Sustainability Metrics</h2>
              <p className="text-gray-400 text-sm">Track environmental impact and resource efficiency</p>
            </div>

            {/* Sustainability KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard
                title="Recycling Rate"
                value={kpis.recyclingRate.toFixed(1)}
                unit="%"
                icon={Recycle}
                color="green"
                target={wasteData.yearlyTarget.recyclingPercent}
                targetLabel="Year Target"
              />
              <KPICard
                title="Water Recovery"
                value={utilities.water.recoveryRate.toFixed(1)}
                unit="%"
                icon={Droplets}
                color="cyan"
              />
              <KPICard
                title="Energy Intensity"
                value={sustainability.energy.energyIntensity.toFixed(2)}
                unit="kWh/L"
                icon={Zap}
                color="yellow"
              />
              <KPICard
                title="CO2 Footprint"
                value={sustainability.energy.carbonFootprint.toFixed(2)}
                unit="kg/L"
                icon={Leaf}
                color="emerald"
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              <WasteChart
                type="area"
                data={monthlyTrend}
                title="Monthly Plastic Usage Trend"
              />
              <WasteChart
                type="pie"
                data={wasteSources}
                title="Waste Sources Breakdown"
              />
            </div>

            {/* Waste Sources Details */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Waste Source Analysis</h3>
              <div className="space-y-3">
                {wasteSources.map((source, index) => (
                  <div
                    key={source.source}
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4'][index] }}
                      />
                      <div>
                        <p className="text-white text-sm font-medium">{source.source}</p>
                        <p className="text-gray-500 text-xs">{source.amount.toLocaleString()} kg ({source.percent}%)</p>
                      </div>
                    </div>
                    {source.reducible ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Reducible
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                        Fixed
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Reducible Waste</span>
                  <span className="text-green-400 font-bold">
                    {wasteSources.filter(s => s.reducible).reduce((acc, s) => acc + s.amount, 0).toLocaleString()} kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Strategy Modal */}
      {selectedStrategy && (
        <ActionModal
          strategy={selectedStrategy}
          onClose={() => setSelectedStrategy(null)}
        />
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 light:bg-white rounded-xl max-w-md w-full border border-gray-700 light:border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-700 light:border-gray-200">
              <h2 className="text-lg font-semibold text-white light:text-gray-900">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-700 light:hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Theme Toggle */}
              <div>
                <label className="text-sm text-gray-400 light:text-gray-600 block mb-2">Appearance</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-blue-500 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span className="text-sm">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                      theme === 'light'
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span className="text-sm">Light</span>
                  </button>
                </div>
              </div>

              {/* App Info */}
              <div className="pt-4 border-t border-gray-700 light:border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Sarooj Manufacturing Dashboard v2.0
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div className="fixed inset-0 z-50">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setShowAdminPanel(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
              <span>Close Admin</span>
            </button>
          </div>
          <AdminPanel />
        </div>
      )}
    </div>
  )
}

// Main App with Authentication
function AuthenticatedApp() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <AppContent />
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

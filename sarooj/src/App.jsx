import { Component } from 'react'
import useStore from './store/useStore'
import useDataLoader from './hooks/useDataLoader'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Overview from './pages/Overview'
import WaterQuality from './pages/WaterQuality'
import Distribution from './pages/Distribution'
import Energy from './pages/Energy'
import Maintenance from './pages/Maintenance'

// Error Boundary Component
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
              className="px-4 py-2 bg-sarooj-600 hover:bg-sarooj-700 rounded-lg text-white transition-colors"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Page renderer based on active section
function PageContent() {
  const { activeSection, loading, error, data } = useStore()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sarooj-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sarooj-600 hover:bg-sarooj-700 rounded-lg text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  switch (activeSection) {
    case 'overview':
      return <Overview />
    case 'water-quality':
      return <WaterQuality />
    case 'distribution':
      return <Distribution />
    case 'energy':
      return <Energy />
    case 'maintenance':
      return <Maintenance />
    case 'customers':
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Customer Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Coming soon</p>
        </div>
      )
    case 'complaints':
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Complaint Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Coming soon</p>
        </div>
      )
    default:
      return <Overview />
  }
}

// Main App Content
function AppContent() {
  useDataLoader()
  const { sidebarOpen } = useStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <Header />
        <main className="p-4 md:p-6">
          <PageContent />
        </main>
      </div>
    </div>
  )
}

// Root App Component
export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

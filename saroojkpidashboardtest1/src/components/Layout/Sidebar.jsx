import {
  LayoutDashboard,
  Droplets,
  Network,
  Zap,
  Wrench,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react'
import useStore from '../../store/useStore'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'water-quality', label: 'Water Quality', icon: Droplets },
  { id: 'distribution', label: 'Distribution', icon: Network },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'complaints', label: 'Complaints', icon: MessageSquare },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, activeSection, setActiveSection, darkMode, toggleDarkMode } = useStore()

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sarooj-500 to-sarooj-700 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-gray-900 dark:text-white">Sarooj</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">KPI Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-sarooj-100 dark:bg-sarooj-900/30 text-sarooj-700 dark:text-sarooj-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              } ${!sidebarOpen && 'justify-center'}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-sarooj-600 dark:text-sarooj-400' : ''}`} />
              {sidebarOpen && <span className="font-medium animate-fade-in">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer actions */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className={`flex ${sidebarOpen ? 'justify-between' : 'flex-col gap-2'} items-center`}>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </aside>
  )
}

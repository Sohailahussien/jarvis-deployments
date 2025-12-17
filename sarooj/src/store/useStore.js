import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Data state
  data: null,
  loading: true,
  error: null,

  // UI state
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  sidebarOpen: true,
  activeSection: 'overview',

  // Filter state
  selectedStation: 'all',
  selectedZone: 'all',
  selectedFacility: 'all',
  dateRange: {
    start: null,
    end: null,
  },

  // Actions
  setData: (data) => set({ data, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),

  toggleDarkMode: () => {
    const newMode = !get().darkMode
    set({ darkMode: newMode })
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setActiveSection: (section) => set({ activeSection: section }),

  setSelectedStation: (station) => set({ selectedStation: station }),
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  setSelectedFacility: (facility) => set({ selectedFacility: facility }),

  setDateRange: (start, end) => set({ dateRange: { start, end } }),

  // Initialize dark mode
  initDarkMode: () => {
    const isDark = get().darkMode
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  },
}))

export default useStore

import { useEffect } from 'react'
import { loadAllData } from '../services/dataService'
import useStore from '../store/useStore'

export function useDataLoader() {
  const { setData, setError, setLoading, initDarkMode } = useStore()

  useEffect(() => {
    initDarkMode()

    async function fetchData() {
      try {
        setLoading(true)
        const data = await loadAllData()
        setData(data)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError(err.message || 'Failed to load dashboard data')
      }
    }

    fetchData()
  }, [setData, setError, setLoading, initDarkMode])
}

export default useDataLoader

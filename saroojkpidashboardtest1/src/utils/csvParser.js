import Papa from 'papaparse'

export async function loadCSV(filename) {
  try {
    const response = await fetch(`/${filename}`)
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`)
    }
    const text = await response.text()
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header) => header.trim(),
    })
    return result.data
  } catch (error) {
    console.error(`Error loading ${filename}:`, error)
    return []
  }
}

export function parseDate(dateString) {
  if (!dateString) return null
  return new Date(dateString)
}

export function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined || isNaN(num)) return '-'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatCurrency(num) {
  if (num === null || num === undefined || isNaN(num)) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatPercent(num, decimals = 1) {
  if (num === null || num === undefined || isNaN(num)) return '-'
  return `${num.toFixed(decimals)}%`
}

export function calculateAverage(arr, field) {
  const values = arr.map(item => item[field]).filter(v => v !== null && v !== undefined && !isNaN(v))
  if (values.length === 0) return 0
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

export function calculateSum(arr, field) {
  return arr.reduce((sum, item) => {
    const val = item[field]
    return sum + (val && !isNaN(val) ? val : 0)
  }, 0)
}

export function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const value = item[key]
    if (!groups[value]) {
      groups[value] = []
    }
    groups[value].push(item)
    return groups
  }, {})
}

export function getUniqueValues(arr, field) {
  return [...new Set(arr.map(item => item[field]).filter(Boolean))]
}

export function filterByDateRange(data, startDate, endDate, dateField = 'timestamp') {
  return data.filter(item => {
    const itemDate = parseDate(item[dateField])
    if (!itemDate) return false
    return itemDate >= startDate && itemDate <= endDate
  })
}

export function getDateRange(data, dateField = 'timestamp') {
  const dates = data
    .map(item => parseDate(item[dateField]))
    .filter(d => d !== null)
    .sort((a, b) => a - b)

  if (dates.length === 0) return { start: null, end: null }
  return { start: dates[0], end: dates[dates.length - 1] }
}

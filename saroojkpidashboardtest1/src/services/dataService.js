import { loadCSV } from '../utils/csvParser'

const DATA_FILES = {
  waterQuality: 'water-quality-monitoring.csv',
  distribution: 'distribution-network-performance.csv',
  energy: 'energy-usage.csv',
  maintenance: 'maintenance-records.csv',
  consumption: 'customer-consumption.csv',
  complaints: 'customer-complaints.csv',
}

let dataCache = {}

export async function loadAllData() {
  const results = await Promise.all([
    loadCSV(DATA_FILES.waterQuality),
    loadCSV(DATA_FILES.distribution),
    loadCSV(DATA_FILES.energy),
    loadCSV(DATA_FILES.maintenance),
    loadCSV(DATA_FILES.consumption),
    loadCSV(DATA_FILES.complaints),
  ])

  dataCache = {
    waterQuality: results[0],
    distribution: results[1],
    energy: results[2],
    maintenance: results[3],
    consumption: results[4],
    complaints: results[5],
  }

  return dataCache
}

export function getWaterQualityData() {
  return dataCache.waterQuality || []
}

export function getDistributionData() {
  return dataCache.distribution || []
}

export function getEnergyData() {
  return dataCache.energy || []
}

export function getMaintenanceData() {
  return dataCache.maintenance || []
}

export function getConsumptionData() {
  return dataCache.consumption || []
}

export function getComplaintsData() {
  return dataCache.complaints || []
}

export function getAllData() {
  return dataCache
}

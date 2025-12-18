import { calculateAverage, calculateSum, groupBy, getUniqueValues } from '../utils/csvParser'

// Water Quality KPIs
export function calculateWaterQualityKPIs(data) {
  if (!data || data.length === 0) {
    return {
      overallCompliance: 0,
      chlorineCompliance: 0,
      phCompliance: 0,
      turbidityCompliance: 0,
      avgChlorine: 0,
      avgPH: 0,
      avgTurbidity: 0,
      stationCount: 0,
      totalReadings: 0,
    }
  }

  const totalReadings = data.length
  const compliantReadings = data.filter(d => d.overall_compliant === 'Yes').length
  const chlorineCompliant = data.filter(d => d.chlorine_compliant === 'Yes').length
  const phCompliant = data.filter(d => d.ph_compliant === 'Yes').length
  const turbidityCompliant = data.filter(d => d.turbidity_compliant === 'Yes').length

  return {
    overallCompliance: (compliantReadings / totalReadings) * 100,
    chlorineCompliance: (chlorineCompliant / totalReadings) * 100,
    phCompliance: (phCompliant / totalReadings) * 100,
    turbidityCompliance: (turbidityCompliant / totalReadings) * 100,
    avgChlorine: calculateAverage(data, 'chlorine_mg_l'),
    avgPH: calculateAverage(data, 'ph'),
    avgTurbidity: calculateAverage(data, 'turbidity_ntu'),
    stationCount: getUniqueValues(data, 'station').length,
    totalReadings,
  }
}

export function getWaterQualityByStation(data) {
  const grouped = groupBy(data, 'station')
  return Object.entries(grouped).map(([station, readings]) => ({
    station: station.replace('Station-', '').replace(/-/g, ' '),
    stationId: station,
    compliance: (readings.filter(r => r.overall_compliant === 'Yes').length / readings.length) * 100,
    avgChlorine: calculateAverage(readings, 'chlorine_mg_l'),
    avgPH: calculateAverage(readings, 'ph'),
    avgTurbidity: calculateAverage(readings, 'turbidity_ntu'),
    readings: readings.length,
  }))
}

// Distribution Network KPIs
export function calculateDistributionKPIs(data) {
  if (!data || data.length === 0) {
    return {
      avgNRW: 0,
      totalFlowRate: 0,
      avgPressure: 0,
      pressureCompliance: 0,
      zoneCount: 0,
      totalBilledConsumption: 0,
    }
  }

  const pressureCompliant = data.filter(d => d.pressure_compliant === 'Yes').length

  return {
    avgNRW: calculateAverage(data, 'nrw_percent'),
    totalFlowRate: calculateAverage(data, 'flow_rate_gpm'),
    avgPressure: calculateAverage(data, 'pressure_psi'),
    pressureCompliance: (pressureCompliant / data.length) * 100,
    zoneCount: getUniqueValues(data, 'zone').length,
    totalBilledConsumption: calculateSum(data, 'billed_consumption_gpm'),
  }
}

export function getDistributionByZone(data) {
  const grouped = groupBy(data, 'zone')
  return Object.entries(grouped).map(([zone, readings]) => ({
    zone: zone.replace('Zone-', '').replace(/-/g, ' '),
    zoneId: zone,
    avgFlowRate: calculateAverage(readings, 'flow_rate_gpm'),
    avgPressure: calculateAverage(readings, 'pressure_psi'),
    avgNRW: calculateAverage(readings, 'nrw_percent'),
    pressureCompliance: (readings.filter(r => r.pressure_compliant === 'Yes').length / readings.length) * 100,
  }))
}

// Energy KPIs
export function calculateEnergyKPIs(data) {
  if (!data || data.length === 0) {
    return {
      totalConsumption: 0,
      totalCost: 0,
      avgEfficiency: 0,
      totalWaterProduced: 0,
      facilityCount: 0,
      avgCostPerKwh: 0,
    }
  }

  const productionData = data.filter(d => d.water_produced_gallons && !isNaN(d.water_produced_gallons))

  return {
    totalConsumption: calculateSum(data, 'energy_consumption_kwh'),
    totalCost: calculateSum(data, 'energy_cost_usd'),
    avgEfficiency: calculateAverage(productionData, 'energy_efficiency_gal_per_kwh'),
    totalWaterProduced: calculateSum(productionData, 'water_produced_gallons'),
    facilityCount: getUniqueValues(data, 'facility').length,
    avgCostPerKwh: calculateAverage(data, 'energy_rate_per_kwh'),
  }
}

export function getEnergyByFacility(data) {
  const grouped = groupBy(data, 'facility')
  return Object.entries(grouped).map(([facility, readings]) => ({
    facility: facility.replace(/-/g, ' '),
    facilityId: facility,
    totalConsumption: calculateSum(readings, 'energy_consumption_kwh'),
    totalCost: calculateSum(readings, 'energy_cost_usd'),
    avgEfficiency: calculateAverage(readings.filter(r => r.energy_efficiency_gal_per_kwh), 'energy_efficiency_gal_per_kwh'),
  }))
}

// Maintenance KPIs
export function calculateMaintenanceKPIs(data) {
  if (!data || data.length === 0) {
    return {
      totalWorkOrders: 0,
      completedWorkOrders: 0,
      completionRate: 0,
      avgDowntime: 0,
      totalCost: 0,
      criticalCount: 0,
      emergencyCount: 0,
      preventiveCount: 0,
      correctiveCount: 0,
    }
  }

  const completed = data.filter(d => d.completed === 'Yes')
  const critical = data.filter(d => d.priority === 'Critical')
  const emergency = data.filter(d => d.maintenance_type === 'Emergency')
  const preventive = data.filter(d => d.maintenance_type === 'Preventive')
  const corrective = data.filter(d => d.maintenance_type === 'Corrective')

  return {
    totalWorkOrders: data.length,
    completedWorkOrders: completed.length,
    completionRate: (completed.length / data.length) * 100,
    avgDowntime: calculateAverage(data, 'downtime_hours'),
    totalCost: calculateSum(data, 'cost_usd'),
    criticalCount: critical.length,
    emergencyCount: emergency.length,
    preventiveCount: preventive.length,
    correctiveCount: corrective.length,
  }
}

export function getMaintenanceByAssetType(data) {
  const grouped = groupBy(data, 'asset_type')
  return Object.entries(grouped).map(([assetType, records]) => ({
    assetType: assetType.replace(/-/g, ' '),
    count: records.length,
    totalCost: calculateSum(records, 'cost_usd'),
    avgDowntime: calculateAverage(records, 'downtime_hours'),
    partsReplaced: records.filter(r => r.parts_replaced === 'Yes').length,
  }))
}

export function getMaintenanceByFailureMode(data) {
  const withFailure = data.filter(d => d.failure_mode)
  const grouped = groupBy(withFailure, 'failure_mode')
  return Object.entries(grouped).map(([mode, records]) => ({
    failureMode: mode.replace(/-/g, ' '),
    count: records.length,
    avgDowntime: calculateAverage(records, 'downtime_hours'),
    totalCost: calculateSum(records, 'cost_usd'),
  }))
}

// Customer KPIs
export function calculateCustomerKPIs(consumptionData, complaintsData) {
  const consumption = consumptionData || []
  const complaints = complaintsData || []

  if (consumption.length === 0) {
    return {
      totalCustomers: 0,
      totalRevenue: 0,
      avgConsumption: 0,
      overdueAmount: 0,
      collectionRate: 0,
      totalComplaints: 0,
      openComplaints: 0,
      avgResolutionTime: 0,
      satisfactionRate: 0,
    }
  }

  const uniqueCustomers = getUniqueValues(consumption, 'customer_id')
  const paidAmount = calculateSum(consumption.filter(c => c.payment_status === 'Paid'), 'bill_amount_usd')
  const totalBilled = calculateSum(consumption, 'bill_amount_usd')
  const overdueRecords = consumption.filter(c => c.payment_status === 'Overdue')

  const resolvedComplaints = complaints.filter(c => c.resolution_hours)
  const satisfiedCustomers = complaints.filter(c => c.customer_satisfied === 'Yes')

  return {
    totalCustomers: uniqueCustomers.length,
    totalRevenue: totalBilled,
    avgConsumption: calculateAverage(consumption, 'consumption_gallons'),
    overdueAmount: calculateSum(overdueRecords, 'bill_amount_usd'),
    collectionRate: totalBilled > 0 ? (paidAmount / totalBilled) * 100 : 0,
    totalComplaints: complaints.length,
    openComplaints: complaints.filter(c => c.status === 'Open').length,
    avgResolutionTime: calculateAverage(resolvedComplaints, 'resolution_hours'),
    satisfactionRate: resolvedComplaints.length > 0 ? (satisfiedCustomers.length / resolvedComplaints.length) * 100 : 0,
  }
}

export function getCustomersByType(data) {
  const grouped = groupBy(data, 'customer_type')
  return Object.entries(grouped).map(([type, records]) => ({
    type,
    customers: getUniqueValues(records, 'customer_id').length,
    totalConsumption: calculateSum(records, 'consumption_gallons'),
    totalRevenue: calculateSum(records, 'bill_amount_usd'),
    avgBill: calculateAverage(records, 'bill_amount_usd'),
  }))
}

export function getComplaintsByType(data) {
  const grouped = groupBy(data, 'complaint_type')
  return Object.entries(grouped).map(([type, records]) => ({
    type: type.replace(/-/g, ' '),
    count: records.length,
    avgResolutionTime: calculateAverage(records.filter(r => r.resolution_hours), 'resolution_hours'),
    satisfactionRate: records.filter(r => r.customer_satisfied === 'Yes').length / records.filter(r => r.customer_satisfied).length * 100 || 0,
  }))
}

export function getComplaintsByPriority(data) {
  const grouped = groupBy(data, 'priority')
  return Object.entries(grouped).map(([priority, records]) => ({
    priority,
    count: records.length,
    open: records.filter(r => r.status === 'Open').length,
    avgResolutionTime: calculateAverage(records.filter(r => r.resolution_hours), 'resolution_hours'),
  }))
}

// Time series aggregation
export function aggregateByMonth(data, dateField = 'timestamp') {
  const monthlyData = {}

  data.forEach(item => {
    const date = new Date(item[dateField])
    if (isNaN(date.getTime())) return

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = []
    }
    monthlyData[monthKey].push(item)
  })

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, records]) => ({
      month,
      records,
      count: records.length,
    }))
}

export function aggregateByDay(data, dateField = 'timestamp') {
  const dailyData = {}

  data.forEach(item => {
    const date = new Date(item[dateField])
    if (isNaN(date.getTime())) return

    const dayKey = date.toISOString().split('T')[0]
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = []
    }
    dailyData[dayKey].push(item)
  })

  return Object.entries(dailyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, records]) => ({
      day,
      records,
      count: records.length,
    }))
}

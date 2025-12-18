// Mock data for admin panel
export const mockUsers = [
  { id: 'usr_001', name: 'Ahmed Al-Rashidi', email: 'ahmed@aquapure.om', role: 'admin', department: 'Management', status: 'active', lastLogin: '2024-12-14T08:30:00Z', createdAt: '2024-01-15T00:00:00Z' },
  { id: 'usr_002', name: 'Fatima Al-Balushi', email: 'fatima@aquapure.om', role: 'operator', department: 'Operations', status: 'active', lastLogin: '2024-12-14T07:45:00Z', createdAt: '2024-02-20T00:00:00Z' },
  { id: 'usr_003', name: 'Mohammed Al-Habsi', email: 'mohammed@aquapure.om', role: 'technician', department: 'Maintenance', status: 'active', lastLogin: '2024-12-13T16:20:00Z', createdAt: '2024-03-10T00:00:00Z' },
  { id: 'usr_004', name: 'Sara Al-Kindi', email: 'sara@aquapure.om', role: 'analyst', department: 'Quality Control', status: 'active', lastLogin: '2024-12-14T09:00:00Z', createdAt: '2024-04-05T00:00:00Z' },
  { id: 'usr_005', name: 'Khalid Al-Farsi', email: 'khalid@aquapure.om', role: 'operator', department: 'Operations', status: 'inactive', lastLogin: '2024-12-01T14:30:00Z', createdAt: '2024-05-12T00:00:00Z' },
];

export const mockProduction = [
  { id: 'prod_001', date: '2024-12-14', plantId: 'P1', plantName: 'Sarooj Main', waterProduced: 45000, waterTarget: 50000, efficiency: 92.5, energyUsed: 12500, status: 'operational' },
  { id: 'prod_002', date: '2024-12-14', plantId: 'P2', plantName: 'Sarooj East', waterProduced: 32000, waterTarget: 35000, efficiency: 94.1, energyUsed: 8200, status: 'operational' },
  { id: 'prod_003', date: '2024-12-13', plantId: 'P1', plantName: 'Sarooj Main', waterProduced: 48500, waterTarget: 50000, efficiency: 97.0, energyUsed: 12100, status: 'operational' },
  { id: 'prod_004', date: '2024-12-13', plantId: 'P2', plantName: 'Sarooj East', waterProduced: 34200, waterTarget: 35000, efficiency: 97.7, energyUsed: 8050, status: 'operational' },
  { id: 'prod_005', date: '2024-12-12', plantId: 'P1', plantName: 'Sarooj Main', waterProduced: 46800, waterTarget: 50000, efficiency: 93.6, energyUsed: 12300, status: 'maintenance' },
];

export const mockEquipment = [
  { id: 'eq_001', name: 'RO Membrane Unit A', type: 'Reverse Osmosis', location: 'Sarooj Main', status: 'operational', lastMaintenance: '2024-11-15', nextMaintenance: '2025-02-15', healthScore: 95, runtime: 8760 },
  { id: 'eq_002', name: 'High Pressure Pump 1', type: 'Pump', location: 'Sarooj Main', status: 'operational', lastMaintenance: '2024-10-20', nextMaintenance: '2025-01-20', healthScore: 88, runtime: 7200 },
  { id: 'eq_003', name: 'Pre-treatment Filter Bank', type: 'Filtration', location: 'Sarooj Main', status: 'maintenance', lastMaintenance: '2024-12-10', nextMaintenance: '2025-03-10', healthScore: 72, runtime: 6500 },
  { id: 'eq_004', name: 'Chemical Dosing System', type: 'Dosing', location: 'Sarooj East', status: 'operational', lastMaintenance: '2024-11-28', nextMaintenance: '2025-02-28', healthScore: 91, runtime: 5800 },
  { id: 'eq_005', name: 'UV Sterilization Unit', type: 'Disinfection', location: 'Sarooj East', status: 'warning', lastMaintenance: '2024-09-15', nextMaintenance: '2024-12-15', healthScore: 65, runtime: 9200 },
];

export const mockWaterQuality = [
  { id: 'wq_001', sampleId: 'WQ-2024-1214-001', date: '2024-12-14', location: 'Sarooj Main Output', tds: 125, ph: 7.2, turbidity: 0.3, chlorine: 0.5, conductivity: 285, status: 'passed' },
  { id: 'wq_002', sampleId: 'WQ-2024-1214-002', date: '2024-12-14', location: 'Sarooj East Output', tds: 118, ph: 7.4, turbidity: 0.2, chlorine: 0.6, conductivity: 270, status: 'passed' },
  { id: 'wq_003', sampleId: 'WQ-2024-1213-001', date: '2024-12-13', location: 'Sarooj Main Output', tds: 130, ph: 7.1, turbidity: 0.4, chlorine: 0.4, conductivity: 295, status: 'passed' },
  { id: 'wq_004', sampleId: 'WQ-2024-1213-002', date: '2024-12-13', location: 'Distribution Point A', tds: 145, ph: 7.3, turbidity: 0.6, chlorine: 0.3, conductivity: 320, status: 'warning' },
  { id: 'wq_005', sampleId: 'WQ-2024-1212-001', date: '2024-12-12', location: 'Sarooj Main Input', tds: 35000, ph: 8.1, turbidity: 2.5, chlorine: 0, conductivity: 52000, status: 'raw' },
];

export const mockProcesses = [
  { id: 'proc_001', name: 'Seawater Intake', stage: 'Pre-treatment', status: 'running', flowRate: 1200, pressure: 2.5, temperature: 28, efficiency: 98.2, startTime: '2024-12-14T00:00:00Z' },
  { id: 'proc_002', name: 'Pre-filtration', stage: 'Pre-treatment', status: 'running', flowRate: 1180, pressure: 3.2, temperature: 27, efficiency: 96.5, startTime: '2024-12-14T00:00:00Z' },
  { id: 'proc_003', name: 'Reverse Osmosis Pass 1', stage: 'Desalination', status: 'running', flowRate: 550, pressure: 65, temperature: 26, efficiency: 94.8, startTime: '2024-12-14T00:00:00Z' },
  { id: 'proc_004', name: 'Reverse Osmosis Pass 2', stage: 'Desalination', status: 'running', flowRate: 520, pressure: 12, temperature: 25, efficiency: 97.1, startTime: '2024-12-14T00:00:00Z' },
  { id: 'proc_005', name: 'Post-treatment Remineralization', stage: 'Post-treatment', status: 'running', flowRate: 510, pressure: 1.5, temperature: 24, efficiency: 99.2, startTime: '2024-12-14T00:00:00Z' },
];

export const mockAlerts = [
  { id: 'alert_001', type: 'warning', title: 'High TDS Level Detected', message: 'TDS reading at Distribution Point A exceeds warning threshold', source: 'Water Quality Sensor WQ-DP-A', timestamp: '2024-12-14T08:45:00Z', status: 'active', priority: 'medium', acknowledged: false },
  { id: 'alert_002', type: 'critical', title: 'Equipment Maintenance Overdue', message: 'UV Sterilization Unit scheduled maintenance is overdue by 1 day', source: 'Maintenance System', timestamp: '2024-12-14T06:00:00Z', status: 'active', priority: 'high', acknowledged: true },
  { id: 'alert_003', type: 'info', title: 'Daily Production Target Met', message: 'Sarooj Main plant has achieved 100% of daily production target', source: 'Production Monitor', timestamp: '2024-12-13T23:00:00Z', status: 'resolved', priority: 'low', acknowledged: true },
  { id: 'alert_004', type: 'warning', title: 'Pressure Fluctuation', message: 'Pressure readings in RO Pass 1 showing unusual fluctuations', source: 'Process Monitor', timestamp: '2024-12-14T07:30:00Z', status: 'active', priority: 'medium', acknowledged: false },
  { id: 'alert_005', type: 'critical', title: 'Pump Efficiency Drop', message: 'High Pressure Pump 1 efficiency dropped below 85%', source: 'Equipment Monitor', timestamp: '2024-12-14T09:15:00Z', status: 'active', priority: 'high', acknowledged: false },
];

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'aquapure_users',
  PRODUCTION: 'aquapure_production',
  EQUIPMENT: 'aquapure_equipment',
  WATER_QUALITY: 'aquapure_water_quality',
  PROCESSES: 'aquapure_processes',
  ALERTS: 'aquapure_alerts',
  AUTH: 'aquapure_auth'
};

// Initialize mock data in localStorage
export function initializeMockData() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTION)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(mockProduction));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EQUIPMENT)) {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(mockEquipment));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WATER_QUALITY)) {
    localStorage.setItem(STORAGE_KEYS.WATER_QUALITY, JSON.stringify(mockWaterQuality));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROCESSES)) {
    localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(mockProcesses));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(mockAlerts));
  }
}

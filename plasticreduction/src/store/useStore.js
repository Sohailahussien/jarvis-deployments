import { create } from 'zustand'

const useStore = create((set, get) => ({
  // ===== PRODUCTION LINE METRICS =====
  productionLines: [
    {
      id: 'line-1',
      name: 'Main Filling Line',
      type: 'filling',
      capacity: 12000, // bottles per hour
      currentSpeed: 10800,
      status: 'running',
      efficiency: 90,
      temperature: 22.5,
      pressure: 2.4, // bar
    },
    {
      id: 'line-2',
      name: 'Secondary Filling Line',
      type: 'filling',
      capacity: 8000,
      currentSpeed: 7200,
      status: 'running',
      efficiency: 90,
      temperature: 23.1,
      pressure: 2.3,
    },
    {
      id: 'line-3',
      name: 'Gallon Filling Station',
      type: 'filling',
      capacity: 1200,
      currentSpeed: 1080,
      status: 'running',
      efficiency: 90,
      temperature: 21.8,
      pressure: 1.8,
    }
  ],

  // ===== PROCESS STAGE METRICS =====
  processStages: {
    waterTreatment: {
      name: 'Water Treatment',
      status: 'optimal',
      metrics: {
        flowRate: 45.2, // m³/hour
        tds: 42, // Total Dissolved Solids (ppm) - target < 50
        ph: 7.2, // target 6.5-8.5
        chlorine: 0.3, // ppm - target 0.2-0.5
        turbidity: 0.15, // NTU - target < 0.5
        conductivity: 85, // µS/cm
        ozonelevel: 0.4, // ppm
        uvDose: 40, // mJ/cm²
      },
      efficiency: 98.5,
      uptime: 99.2,
    },
    blowMolding: {
      name: 'Blow Molding',
      status: 'optimal',
      metrics: {
        preformTemp: 105, // °C
        blowPressure: 38, // bar
        moldTemp: 12, // °C
        cycleTime: 4.2, // seconds
        rejectRate: 0.8, // %
        outputRate: 9600, // bottles/hour
      },
      efficiency: 94.2,
      uptime: 96.8,
    },
    filling: {
      name: 'Filling',
      status: 'optimal',
      metrics: {
        fillAccuracy: 99.4, // %
        fillSpeed: 18000, // bottles/hour (all lines)
        fillTemp: 18, // °C
        nitrogenLevel: 0.02, // % (for still water)
        carbonationLevel: 0, // volumes CO2 (0 for still)
        headspace: 15, // mm
      },
      efficiency: 96.8,
      uptime: 98.1,
    },
    capping: {
      name: 'Capping',
      status: 'warning',
      metrics: {
        torque: 18.5, // Nm
        torqueVariance: 2.1, // Nm (target < 1.5)
        applicationRate: 17800, // caps/hour
        rejectRate: 1.4, // %
        leakTestPass: 98.6, // %
      },
      efficiency: 92.1,
      uptime: 97.5,
    },
    labeling: {
      name: 'Labeling',
      status: 'optimal',
      metrics: {
        labelAccuracy: 97.9, // %
        labelSpeed: 17500, // labels/hour
        adhesionStrength: 95, // % of target
        alignment: 99.1, // %
        rejectRate: 2.1, // %
      },
      efficiency: 93.5,
      uptime: 98.8,
    },
    packaging: {
      name: 'Packaging',
      status: 'optimal',
      metrics: {
        packingSpeed: 180, // cases/hour
        shrinkTemp: 175, // °C
        palletAccuracy: 99.5, // %
        wrapTension: 85, // % of target
        caseIntegrity: 99.8, // %
      },
      efficiency: 95.2,
      uptime: 99.1,
    },
  },

  // ===== WATER QUALITY DATA =====
  waterQuality: {
    source: {
      tds: 320, // ppm
      ph: 7.8,
      hardness: 180, // ppm CaCO3
      alkalinity: 120, // ppm
      sulfate: 45, // ppm
      chloride: 35, // ppm
      nitrate: 8, // ppm
    },
    postTreatment: {
      tds: 42,
      ph: 7.2,
      hardness: 25,
      alkalinity: 40,
      sulfate: 12,
      chloride: 10,
      nitrate: 2,
    },
    compliance: {
      omanStandard: true,
      whoGuidelines: true,
      gccStandard: true,
      lastLabTest: '2024-10-28',
      nextLabTest: '2024-11-04',
    },
    hourlyReadings: [
      { time: '06:00', tds: 41, ph: 7.1, turbidity: 0.12 },
      { time: '08:00', tds: 42, ph: 7.2, turbidity: 0.14 },
      { time: '10:00', tds: 43, ph: 7.2, turbidity: 0.15 },
      { time: '12:00', tds: 42, ph: 7.3, turbidity: 0.13 },
      { time: '14:00', tds: 41, ph: 7.2, turbidity: 0.14 },
      { time: '16:00', tds: 42, ph: 7.1, turbidity: 0.16 },
      { time: '18:00', tds: 43, ph: 7.2, turbidity: 0.15 },
      { time: '20:00', tds: 42, ph: 7.2, turbidity: 0.14 },
    ],
  },

  // ===== EQUIPMENT STATUS =====
  equipment: [
    { id: 'eq-1', name: 'RO System Unit 1', type: 'treatment', status: 'running', health: 94, nextMaintenance: '2024-11-15', runtime: 2840 },
    { id: 'eq-2', name: 'RO System Unit 2', type: 'treatment', status: 'running', health: 91, nextMaintenance: '2024-11-12', runtime: 3120 },
    { id: 'eq-3', name: 'UV Sterilizer', type: 'treatment', status: 'running', health: 98, nextMaintenance: '2024-12-01', runtime: 1560 },
    { id: 'eq-4', name: 'Ozone Generator', type: 'treatment', status: 'running', health: 89, nextMaintenance: '2024-11-08', runtime: 3800 },
    { id: 'eq-5', name: 'Blow Molder A', type: 'production', status: 'running', health: 87, nextMaintenance: '2024-11-10', runtime: 4200 },
    { id: 'eq-6', name: 'Blow Molder B', type: 'production', status: 'maintenance', health: 72, nextMaintenance: '2024-11-02', runtime: 5100 },
    { id: 'eq-7', name: 'Filler Line 1', type: 'production', status: 'running', health: 92, nextMaintenance: '2024-11-20', runtime: 2100 },
    { id: 'eq-8', name: 'Filler Line 2', type: 'production', status: 'running', health: 88, nextMaintenance: '2024-11-18', runtime: 2800 },
    { id: 'eq-9', name: 'Capper Unit 1', type: 'production', status: 'running', health: 78, nextMaintenance: '2024-11-05', runtime: 4500 },
    { id: 'eq-10', name: 'Capper Unit 2', type: 'production', status: 'running', health: 85, nextMaintenance: '2024-11-14', runtime: 3200 },
    { id: 'eq-11', name: 'Labeler Main', type: 'production', status: 'running', health: 90, nextMaintenance: '2024-11-22', runtime: 1980 },
    { id: 'eq-12', name: 'Shrink Wrapper', type: 'packaging', status: 'running', health: 95, nextMaintenance: '2024-12-05', runtime: 1200 },
    { id: 'eq-13', name: 'Palletizer', type: 'packaging', status: 'running', health: 93, nextMaintenance: '2024-11-25', runtime: 1650 },
    { id: 'eq-14', name: 'Conveyor System', type: 'utility', status: 'running', health: 96, nextMaintenance: '2024-12-10', runtime: 980 },
  ],

  // ===== PRODUCTION EFFICIENCY METRICS =====
  productionMetrics: {
    // OEE components
    availability: 87.5, // % - uptime vs scheduled time
    performance: 92.3, // % - actual speed vs designed speed
    quality: 96.8, // % - good units vs total units
    // Yield metrics
    currentYield: 94.2, // % - good output vs input
    targetYield: 98.0,
    previousYield: 93.1,
    // Downtime breakdown (hours/month)
    downtime: {
      plannedMaintenance: 24,
      unplannedMaintenance: 18,
      changeovers: 12,
      materialShortage: 6,
      qualityIssues: 8,
    },
    // Quality defects breakdown
    defects: {
      labelingErrors: 2.1,
      sealingDefects: 1.4,
      bottleMalformation: 0.8,
      contaminants: 0.5,
      fillLevelVariance: 0.4,
    },
  },

  // ===== PRODUCTION OUTPUT DATA =====
  productionOutput: {
    daily: [
      { date: 'Mon', bottles: 145000, target: 150000, efficiency: 96.7 },
      { date: 'Tue', bottles: 152000, target: 150000, efficiency: 101.3 },
      { date: 'Wed', bottles: 148000, target: 150000, efficiency: 98.7 },
      { date: 'Thu', bottles: 155000, target: 150000, efficiency: 103.3 },
      { date: 'Fri', bottles: 142000, target: 150000, efficiency: 94.7 },
      { date: 'Sat', bottles: 138000, target: 140000, efficiency: 98.6 },
      { date: 'Sun', bottles: 95000, target: 100000, efficiency: 95.0 },
    ],
    monthly: [
      { month: 'Jan', output: 4200000, target: 4500000, oee: 78.2 },
      { month: 'Feb', output: 4350000, target: 4500000, oee: 80.5 },
      { month: 'Mar', output: 4480000, target: 4500000, oee: 82.1 },
      { month: 'Apr', output: 4520000, target: 4500000, oee: 83.8 },
      { month: 'May', output: 4680000, target: 4800000, oee: 84.2 },
      { month: 'Jun', output: 4750000, target: 4800000, oee: 85.1 },
      { month: 'Jul', output: 4820000, target: 4800000, oee: 86.4 },
      { month: 'Aug', output: 4900000, target: 5000000, oee: 86.8 },
      { month: 'Sep', output: 4950000, target: 5000000, oee: 87.5 },
      { month: 'Oct', output: 5020000, target: 5000000, oee: 88.2 },
      { month: 'Nov', output: null, target: 5000000, oee: null },
      { month: 'Dec', output: null, target: 5000000, oee: null },
    ],
  },

  // ===== ENERGY & UTILITIES =====
  utilities: {
    electricity: {
      current: 285, // kW
      daily: 6840, // kWh
      monthly: 205200, // kWh
      costPerKwh: 0.025, // OMR
      peakUsage: 340, // kW
      offPeakUsage: 220, // kW
    },
    water: {
      sourceIntake: 180, // m³/day
      productOutput: 145, // m³/day (bottled water)
      processWaste: 25, // m³/day
      recycled: 10, // m³/day
      recoveryRate: 80.6, // %
    },
    compressedAir: {
      pressure: 7.2, // bar
      flow: 850, // m³/hour
      dewPoint: -40, // °C
      oilContent: 0.003, // ppm
    },
    nitrogen: {
      purity: 99.5, // %
      pressure: 6, // bar
      consumption: 120, // m³/day
    },
  },

  // ===== SUSTAINABILITY METRICS (renamed from wasteData) =====
  sustainability: {
    plastic: {
      currentMonth: {
        totalPlasticUsed: 12500, // kg
        recycledPlastic: 3750, // kg
        landfillPlastic: 2500, // kg
        reusedPlastic: 1250, // kg
        inProcessWaste: 5000, // kg
      },
      previousMonth: {
        totalPlasticUsed: 14200,
        recycledPlastic: 2840,
        landfillPlastic: 4260,
        reusedPlastic: 710,
        inProcessWaste: 6390,
      },
      yearlyTarget: {
        reductionPercent: 30,
        recyclingPercent: 50,
        landfillPercent: 10,
      }
    },
    water: {
      waterIntensity: 1.24, // liters of source water per liter produced
      wastewaterTreatment: 95, // % treated
      recyclingRate: 40, // % of process water recycled
    },
    energy: {
      energyIntensity: 0.14, // kWh per liter produced
      renewablePercent: 15, // % from solar
      carbonFootprint: 0.08, // kg CO2 per liter
    },
  },

  // ===== Monthly trend data (keeping for charts) =====
  monthlyTrend: [
    { month: 'Jan', total: 15200, recycled: 2280, landfill: 6080, reused: 760 },
    { month: 'Feb', total: 14800, recycled: 2664, landfill: 5180, reused: 888 },
    { month: 'Mar', total: 14500, recycled: 2900, landfill: 4640, reused: 1015 },
    { month: 'Apr', total: 14200, recycled: 2840, landfill: 4260, reused: 710 },
    { month: 'May', total: 13800, recycled: 3174, landfill: 3588, reused: 966 },
    { month: 'Jun', total: 13400, recycled: 3350, landfill: 3216, reused: 1072 },
    { month: 'Jul', total: 13000, recycled: 3510, landfill: 2860, reused: 1170 },
    { month: 'Aug', total: 12800, recycled: 3584, landfill: 2688, reused: 1152 },
    { month: 'Sep', total: 12600, recycled: 3654, landfill: 2520, reused: 1197 },
    { month: 'Oct', total: 12500, recycled: 3750, landfill: 2500, reused: 1250 },
    { month: 'Nov', total: null, recycled: null, landfill: null, reused: null },
    { month: 'Dec', total: null, recycled: null, landfill: null, reused: null },
  ],

  // ===== Waste sources breakdown =====
  wasteSources: [
    { source: 'Packaging Materials', amount: 4500, percent: 36, reducible: true },
    { source: 'Pipe Fittings', amount: 2875, percent: 23, reducible: true },
    { source: 'Container Linings', amount: 2125, percent: 17, reducible: false },
    { source: 'Protective Wrapping', amount: 1625, percent: 13, reducible: true },
    { source: 'Lab Equipment', amount: 875, percent: 7, reducible: false },
    { source: 'Other', amount: 500, percent: 4, reducible: true },
  ],

  // ===== Product catalog with production and sales data =====
  products: [
    {
      id: 1,
      name: '5 Gallon Dispenser Bottle',
      size: '18.9L',
      image: 'dispenser-5gal',
      plasticWeight: 750, // grams per unit
      monthlyProduction: 15000,
      monthlySales: 14200,
      unitPrice: 2.5, // OMR
      productionCost: 1.2,
      inventory: 2400,
      trend: [12000, 13500, 14000, 14500, 14800, 14200],
      category: 'returnable',
      plasticType: 'PC (Polycarbonate)',
      recyclable: true,
      returns: 85, // % return rate
    },
    {
      id: 2,
      name: '4 Gallon Jug',
      size: '15L',
      image: 'jug-4gal',
      plasticWeight: 580,
      monthlyProduction: 8000,
      monthlySales: 7650,
      unitPrice: 1.8,
      productionCost: 0.9,
      inventory: 1200,
      trend: [6500, 7000, 7200, 7500, 7800, 7650],
      category: 'returnable',
      plasticType: 'PC (Polycarbonate)',
      recyclable: true,
      returns: 78,
    },
    {
      id: 3,
      name: '1.5L Family Bottle',
      size: '1.5L',
      image: 'bottle-1.5l',
      plasticWeight: 38,
      monthlyProduction: 120000,
      monthlySales: 115000,
      unitPrice: 0.25,
      productionCost: 0.12,
      inventory: 25000,
      trend: [95000, 102000, 108000, 112000, 118000, 115000],
      category: 'single-use',
      plasticType: 'PET',
      recyclable: true,
      returns: 0,
    },
    {
      id: 4,
      name: '500ml Standard',
      size: '500ml',
      image: 'bottle-500ml',
      plasticWeight: 18,
      monthlyProduction: 250000,
      monthlySales: 242000,
      unitPrice: 0.15,
      productionCost: 0.06,
      inventory: 45000,
      trend: [210000, 225000, 235000, 240000, 248000, 242000],
      category: 'single-use',
      plasticType: 'PET',
      recyclable: true,
      returns: 0,
    },
    {
      id: 5,
      name: '330ml Compact',
      size: '330ml',
      image: 'bottle-330ml',
      plasticWeight: 12,
      monthlyProduction: 180000,
      monthlySales: 175000,
      unitPrice: 0.12,
      productionCost: 0.05,
      inventory: 32000,
      trend: [150000, 160000, 168000, 172000, 178000, 175000],
      category: 'single-use',
      plasticType: 'PET',
      recyclable: true,
      returns: 0,
    },
    {
      id: 6,
      name: '200ml Mini',
      size: '200ml',
      image: 'bottle-200ml',
      plasticWeight: 8,
      monthlyProduction: 100000,
      monthlySales: 96000,
      unitPrice: 0.08,
      productionCost: 0.03,
      inventory: 18000,
      trend: [82000, 88000, 92000, 95000, 98000, 96000],
      category: 'single-use',
      plasticType: 'PET',
      recyclable: true,
      returns: 0,
    },
  ],

  // ===== OPTIMIZATION STRATEGIES (renamed from strategies) =====
  strategies: [
    {
      id: 1,
      title: 'Optimize Blow Molding Parameters',
      description: 'Fine-tune preform temperature and blow pressure profiles to reduce bottle defects and improve material efficiency.',
      potentialReduction: 2500,
      cost: 8000,
      roi: 6,
      difficulty: 'Medium',
      status: 'In Progress',
      implementedPercent: 65,
      category: 'process',
      impact: { yield: 1.2, oee: 2.1, quality: 1.5 }
    },
    {
      id: 2,
      title: 'Predictive Maintenance Implementation',
      description: 'Deploy IoT sensors on critical equipment for condition monitoring and predictive maintenance alerts.',
      potentialReduction: 1800,
      cost: 25000,
      roi: 14,
      difficulty: 'Hard',
      status: 'In Progress',
      implementedPercent: 40,
      category: 'maintenance',
      impact: { yield: 0.8, oee: 4.5, quality: 0.5 }
    },
    {
      id: 3,
      title: 'SMED Changeover Optimization',
      description: 'Implement Single Minute Exchange of Die methodology to reduce changeover times by 50%.',
      potentialReduction: 1200,
      cost: 5000,
      roi: 4,
      difficulty: 'Medium',
      status: 'Planned',
      implementedPercent: 0,
      category: 'process',
      impact: { yield: 0.5, oee: 3.2, quality: 0 }
    },
    {
      id: 4,
      title: 'Water Recovery System Upgrade',
      description: 'Install advanced RO reject water recovery to increase water utilization from 80% to 92%.',
      potentialReduction: 3500,
      cost: 45000,
      roi: 18,
      difficulty: 'Hard',
      status: 'Research',
      implementedPercent: 10,
      category: 'sustainability',
      impact: { yield: 0, oee: 0.5, quality: 0 }
    },
    {
      id: 5,
      title: 'Capping Torque Control System',
      description: 'Upgrade to servo-controlled capping heads with real-time torque feedback to eliminate sealing defects.',
      potentialReduction: 1500,
      cost: 18000,
      roi: 10,
      difficulty: 'Medium',
      status: 'Completed',
      implementedPercent: 100,
      category: 'quality',
      impact: { yield: 1.8, oee: 1.2, quality: 2.5 }
    },
    {
      id: 6,
      title: 'Vision Inspection System Enhancement',
      description: 'Add AI-powered defect detection at labeling and capping stations for 100% quality inspection.',
      potentialReduction: 2000,
      cost: 35000,
      roi: 12,
      difficulty: 'Hard',
      status: 'In Progress',
      implementedPercent: 55,
      category: 'quality',
      impact: { yield: 1.5, oee: 0.8, quality: 3.2 }
    },
  ],

  // ===== ALERTS & NOTIFICATIONS =====
  alerts: [
    { id: 1, type: 'warning', category: 'equipment', message: 'Capper Unit 1 health at 78% - maintenance recommended', timestamp: '2024-10-30 08:45', acknowledged: false },
    { id: 2, type: 'info', category: 'production', message: 'Daily production target achieved at 14:30', timestamp: '2024-10-30 14:30', acknowledged: true },
    { id: 3, type: 'warning', category: 'quality', message: 'Torque variance above threshold on Line 1', timestamp: '2024-10-30 10:15', acknowledged: false },
    { id: 4, type: 'success', category: 'quality', message: 'Water quality parameters within optimal range', timestamp: '2024-10-30 09:00', acknowledged: true },
    { id: 5, type: 'alert', category: 'maintenance', message: 'Blow Molder B scheduled maintenance overdue', timestamp: '2024-10-29 16:00', acknowledged: false },
  ],

  // ===== ACTIONS =====
  activeActions: [],

  // Update strategy status
  updateStrategy: (id, updates) => set((state) => ({
    strategies: state.strategies.map(s =>
      s.id === id ? { ...s, ...updates } : s
    )
  })),

  // Add action item
  addAction: (action) => set((state) => ({
    activeActions: [...state.activeActions, { ...action, id: Date.now(), createdAt: new Date() }]
  })),

  // Toggle action completion
  toggleAction: (id) => set((state) => ({
    activeActions: state.activeActions.map(a =>
      a.id === id ? { ...a, completed: !a.completed } : a
    )
  })),

  // Remove action
  removeAction: (id) => set((state) => ({
    activeActions: state.activeActions.filter(a => a.id !== id)
  })),

  // Acknowledge alert
  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map(a =>
      a.id === id ? { ...a, acknowledged: true } : a
    )
  })),

  // ===== COMPUTED VALUES / GETTERS =====

  // Get overall plant OEE
  getPlantOEE: () => {
    const { productionMetrics } = get()
    const { availability, performance, quality } = productionMetrics
    return (availability * performance * quality) / 10000
  },

  // Get process stage health
  getProcessHealth: () => {
    const { processStages } = get()
    const stages = Object.values(processStages)
    const avgEfficiency = stages.reduce((acc, s) => acc + s.efficiency, 0) / stages.length
    const avgUptime = stages.reduce((acc, s) => acc + s.uptime, 0) / stages.length
    const warnings = stages.filter(s => s.status === 'warning').length
    const critical = stages.filter(s => s.status === 'critical').length
    return { avgEfficiency, avgUptime, warnings, critical, total: stages.length }
  },

  // Get equipment health summary
  getEquipmentHealth: () => {
    const { equipment } = get()
    const running = equipment.filter(e => e.status === 'running').length
    const maintenance = equipment.filter(e => e.status === 'maintenance').length
    const avgHealth = equipment.reduce((acc, e) => acc + e.health, 0) / equipment.length
    const needsMaintenance = equipment.filter(e => e.health < 80).length
    const upcomingMaintenance = equipment.filter(e => {
      const maintenanceDate = new Date(e.nextMaintenance)
      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return maintenanceDate <= weekFromNow
    }).length
    return { running, maintenance, avgHealth, needsMaintenance, upcomingMaintenance, total: equipment.length }
  },

  // Calculate waste KPIs (keeping for compatibility)
  getKPIs: () => {
    const { sustainability, monthlyTrend } = get()
    const current = sustainability.plastic.currentMonth
    const previous = sustainability.plastic.previousMonth

    const recyclingRate = (current.recycledPlastic / current.totalPlasticUsed) * 100
    const landfillRate = (current.landfillPlastic / current.totalPlasticUsed) * 100
    const reuseRate = (current.reusedPlastic / current.totalPlasticUsed) * 100
    const diversionRate = ((current.recycledPlastic + current.reusedPlastic) / current.totalPlasticUsed) * 100

    const totalReduction = ((previous.totalPlasticUsed - current.totalPlasticUsed) / previous.totalPlasticUsed) * 100
    const recyclingImprovement = recyclingRate - (previous.recycledPlastic / previous.totalPlasticUsed) * 100
    const landfillReduction = (previous.landfillPlastic / previous.totalPlasticUsed) * 100 - landfillRate

    return {
      recyclingRate,
      landfillRate,
      reuseRate,
      diversionRate,
      totalReduction,
      recyclingImprovement,
      landfillReduction,
      totalPlasticUsed: current.totalPlasticUsed,
      recycledPlastic: current.recycledPlastic,
      landfillPlastic: current.landfillPlastic,
      reusedPlastic: current.reusedPlastic,
    }
  },

  // Get strategy stats
  getStrategyStats: () => {
    const { strategies } = get()
    const completed = strategies.filter(s => s.status === 'Completed').length
    const inProgress = strategies.filter(s => s.status === 'In Progress').length
    const totalPotential = strategies.reduce((acc, s) => acc + s.potentialReduction, 0)
    const achievedReduction = strategies.reduce((acc, s) =>
      acc + (s.potentialReduction * s.implementedPercent / 100), 0
    )

    return { completed, inProgress, totalPotential, achievedReduction, total: strategies.length }
  },

  // Get production efficiency metrics and recommendations
  getProductionMetrics: () => {
    const { productionMetrics } = get()
    const { availability, performance, quality, currentYield, targetYield, previousYield, downtime, defects } = productionMetrics

    // Calculate OEE
    const oee = (availability * performance * quality) / 10000

    // Calculate total downtime
    const totalDowntime = Object.values(downtime).reduce((a, b) => a + b, 0)

    // Identify top downtime causes
    const downtimeSorted = Object.entries(downtime)
      .map(([cause, hours]) => ({ cause, hours, percent: (hours / totalDowntime) * 100 }))
      .sort((a, b) => b.hours - a.hours)

    // Identify top defects
    const totalDefectRate = Object.values(defects).reduce((a, b) => a + b, 0)
    const defectsSorted = Object.entries(defects)
      .map(([type, rate]) => ({ type, rate, percent: (rate / totalDefectRate) * 100 }))
      .sort((a, b) => b.rate - a.rate)

    // Generate OEE recommendations
    const oeeRecommendations = []

    if (availability < 90) {
      oeeRecommendations.push({
        id: 'oee-1',
        priority: 'high',
        category: 'Availability',
        title: 'Reduce Unplanned Downtime',
        description: `Unplanned maintenance accounts for ${downtime.unplannedMaintenance}h/month. Implement predictive maintenance using vibration sensors and temperature monitoring.`,
        impact: `+${((90 - availability) * 0.5).toFixed(1)}% OEE potential`,
        actions: ['Install IoT sensors on critical equipment', 'Set up predictive maintenance alerts', 'Train maintenance team on condition-based maintenance']
      })
    }

    if (downtime.changeovers > 10) {
      oeeRecommendations.push({
        id: 'oee-2',
        priority: 'medium',
        category: 'Availability',
        title: 'Optimize Changeover Process',
        description: `Changeovers consume ${downtime.changeovers}h/month. Apply SMED (Single Minute Exchange of Die) methodology to reduce setup times.`,
        impact: `-${Math.round(downtime.changeovers * 0.4)}h changeover time`,
        actions: ['Video record current changeover process', 'Identify external vs internal activities', 'Standardize changeover procedures']
      })
    }

    if (performance < 95) {
      oeeRecommendations.push({
        id: 'oee-3',
        priority: 'high',
        category: 'Performance',
        title: 'Address Speed Losses',
        description: `Current performance is ${performance}% of designed speed. Analyze minor stoppages and identify bottlenecks.`,
        impact: `+${((95 - performance) * 0.8).toFixed(1)}% throughput`,
        actions: ['Conduct time-motion studies', 'Identify and eliminate micro-stoppages', 'Optimize conveyor speeds']
      })
    }

    if (quality < 98) {
      oeeRecommendations.push({
        id: 'oee-4',
        priority: 'medium',
        category: 'Quality',
        title: 'Reduce Quality Defects',
        description: `Quality rate is ${quality}%. Focus on ${defectsSorted[0]?.type.replace(/([A-Z])/g, ' $1').trim()} (${defectsSorted[0]?.rate}% defect rate).`,
        impact: `+${((98 - quality) * 0.9).toFixed(1)}% quality rate`,
        actions: ['Implement SPC on critical parameters', 'Root cause analysis for top defects', 'Operator training on quality standards']
      })
    }

    // Generate Yield recommendations
    const yieldRecommendations = []
    const yieldGap = targetYield - currentYield

    if (yieldGap > 2) {
      yieldRecommendations.push({
        id: 'yield-1',
        priority: 'high',
        category: 'Material Efficiency',
        title: 'Reduce Raw Material Waste',
        description: `Current yield is ${currentYield}%, ${yieldGap.toFixed(1)}% below target. Focus on preform injection optimization.`,
        impact: `${(yieldGap * 0.6).toFixed(1)}% yield improvement potential`,
        actions: ['Optimize preform temperature profiles', 'Calibrate injection molding parameters', 'Implement material traceability']
      })
    }

    if (defects.sealingDefects > 1) {
      yieldRecommendations.push({
        id: 'yield-2',
        priority: 'high',
        category: 'Sealing Quality',
        title: 'Improve Cap Sealing Process',
        description: `Sealing defects at ${defects.sealingDefects}% cause significant yield loss. Torque calibration and cap alignment needed.`,
        impact: `-${(defects.sealingDefects * 0.7).toFixed(1)}% defect rate`,
        actions: ['Calibrate torque settings on cappers', 'Check cap feeder alignment', 'Inspect sealing surface condition']
      })
    }

    if (defects.labelingErrors > 1.5) {
      yieldRecommendations.push({
        id: 'yield-3',
        priority: 'medium',
        category: 'Labeling',
        title: 'Optimize Labeling Station',
        description: `Labeling errors at ${defects.labelingErrors}% are above benchmark. Vision system calibration required.`,
        impact: `-${(defects.labelingErrors * 0.5).toFixed(1)}% rejection rate`,
        actions: ['Recalibrate vision inspection system', 'Check label adhesive quality', 'Adjust label applicator pressure']
      })
    }

    if (defects.bottleMalformation > 0.5) {
      yieldRecommendations.push({
        id: 'yield-4',
        priority: 'medium',
        category: 'Blow Molding',
        title: 'Reduce Bottle Malformation',
        description: `Bottle malformation at ${defects.bottleMalformation}%. Review blow molding parameters and mold maintenance.`,
        impact: `-${(defects.bottleMalformation * 0.8).toFixed(1)}% scrap rate`,
        actions: ['Inspect mold cooling channels', 'Optimize blow pressure profile', 'Schedule preventive mold maintenance']
      })
    }

    if (downtime.materialShortage > 4) {
      yieldRecommendations.push({
        id: 'yield-5',
        priority: 'medium',
        category: 'Supply Chain',
        title: 'Improve Material Availability',
        description: `Material shortages cause ${downtime.materialShortage}h downtime/month. Review inventory management.`,
        impact: `+${downtime.materialShortage}h production time`,
        actions: ['Implement safety stock levels', 'Set up automatic reorder points', 'Develop backup supplier relationships']
      })
    }

    return {
      oee,
      availability,
      performance,
      quality,
      currentYield,
      targetYield,
      yieldGap,
      yieldImprovement: currentYield - previousYield,
      totalDowntime,
      downtimeSorted,
      defectsSorted,
      totalDefectRate,
      oeeRecommendations,
      yieldRecommendations,
      worldClassOEE: 85, // benchmark
      worldClassYield: 98, // benchmark
    }
  },

  // Get process optimization recommendations
  getProcessRecommendations: () => {
    const { processStages, equipment } = get()
    const recommendations = []

    // Check each process stage
    Object.entries(processStages).forEach(([key, stage]) => {
      if (stage.efficiency < 95) {
        recommendations.push({
          id: `proc-${key}`,
          stage: stage.name,
          priority: stage.efficiency < 90 ? 'high' : 'medium',
          title: `Improve ${stage.name} Efficiency`,
          currentValue: stage.efficiency,
          targetValue: 95,
          gap: 95 - stage.efficiency,
          type: 'efficiency'
        })
      }
      if (stage.status === 'warning' || stage.status === 'critical') {
        recommendations.push({
          id: `alert-${key}`,
          stage: stage.name,
          priority: stage.status === 'critical' ? 'critical' : 'high',
          title: `Address ${stage.name} ${stage.status.toUpperCase()}`,
          status: stage.status,
          type: 'alert'
        })
      }
    })

    // Check equipment health
    equipment.filter(e => e.health < 85).forEach(eq => {
      recommendations.push({
        id: `equip-${eq.id}`,
        stage: eq.name,
        priority: eq.health < 75 ? 'high' : 'medium',
        title: `Maintain ${eq.name}`,
        currentValue: eq.health,
        targetValue: 90,
        type: 'maintenance'
      })
    })

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  },

  // Get product statistics
  getProductStats: () => {
    const { products } = get()
    const totalProduction = products.reduce((acc, p) => acc + p.monthlyProduction, 0)
    const totalSales = products.reduce((acc, p) => acc + p.monthlySales, 0)
    const totalRevenue = products.reduce((acc, p) => acc + (p.monthlySales * p.unitPrice), 0)
    const totalCost = products.reduce((acc, p) => acc + (p.monthlyProduction * p.productionCost), 0)
    const totalPlasticUsed = products.reduce((acc, p) => acc + (p.monthlyProduction * p.plasticWeight / 1000), 0) // kg
    const totalInventory = products.reduce((acc, p) => acc + p.inventory, 0)

    return {
      totalProduction,
      totalSales,
      totalRevenue,
      totalCost,
      grossProfit: totalRevenue - totalCost,
      profitMargin: ((totalRevenue - totalCost) / totalRevenue) * 100,
      totalPlasticUsed,
      totalInventory,
      sellThroughRate: (totalSales / totalProduction) * 100,
    }
  },

  // Compatibility alias for wasteData
  get wasteData() {
    return get().sustainability.plastic
  },
}))

export default useStore

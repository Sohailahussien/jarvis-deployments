const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const analyticsService = require('../services/analyticsService');

// Health check
router.get('/health', (req, res) => res.json({ status: 'ok' }));

// Dashboard Overview
router.get('/dashboard/overview', async (req, res) => {
  try {
    const overview = await analyticsService.getDashboardOverview();
    res.json({ success: true, data: overview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Water Quality Routes
router.get('/water-quality', async (req, res) => {
  try {
    const data = await dataService.getWaterQuality();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/water-quality/analysis', async (req, res) => {
  try {
    const analysis = await analyticsService.analyzeWaterQuality();
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Distribution Network Routes (NRW)
router.get('/distribution', async (req, res) => {
  try {
    const data = await dataService.getDistribution();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/distribution/nrw-analysis', async (req, res) => {
  try {
    const analysis = await analyticsService.analyzeNRW();
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Energy Routes
router.get('/energy', async (req, res) => {
  try {
    const data = await dataService.getEnergy();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/energy/analysis', async (req, res) => {
  try {
    const analysis = await analyticsService.analyzeEnergy();
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Maintenance Routes
router.get('/maintenance', async (req, res) => {
  try {
    const data = await dataService.getMaintenance();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/maintenance/analysis', async (req, res) => {
  try {
    const analysis = await analyticsService.analyzeMaintenance();
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Customer Routes
router.get('/customers/consumption', async (req, res) => {
  try {
    const data = await dataService.getConsumption();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/customers/complaints', async (req, res) => {
  try {
    const data = await dataService.getComplaints();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/customers/analysis', async (req, res) => {
  try {
    const analysis = await analyticsService.analyzeCustomers();
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Compliance Routes
router.get('/compliance/report', async (req, res) => {
  try {
    const report = await analyticsService.generateComplianceReport();
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await analyticsService.getAlerts();
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { getSummary, getCacheStats, getLatencyStats } = require('./metrics');
const { Request } = require('./requestModel');
const { GuardrailViolation } = require('../guardrails/guardrailModel');
const authMiddleware = require('../../middlewares/authMiddleware');

// Summary metrics
router.get('/summary', authMiddleware, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const summary = await getSummary(startDate, endDate);
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
});

// Cache metrics
router.get('/cache', authMiddleware, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await getCacheStats(startDate, endDate);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// Latency metrics
router.get('/latency', authMiddleware, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await getLatencyStats(startDate, endDate);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// Get requests
router.get('/requests', authMiddleware, async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const requests = await Request.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
});

// Get guardrail violations
router.get('/guardrails', authMiddleware, async (req, res, next) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const violations = await GuardrailViolation.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: violations });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


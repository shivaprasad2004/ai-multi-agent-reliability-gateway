const express = require('express');
const router = express.Router();
require('../../config/associations');
const { Agent } = require('./agentModel');
const { Model } = require('../models/modelModel');
const { Provider } = require('../providers/providerModel');
const authMiddleware = require('../../middlewares/authMiddleware');

// Get all agents
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const agents = await Agent.findAll({
      include: [{
        model: Model,
        include: [{ model: Provider }]
      }],
      order: [['orderIndex', 'ASC']]
    });
    res.json({ success: true, data: agents });
  } catch (error) {
    next(error);
  }
});

// Create agent
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { name, role, modelId, orderIndex, taskType } = req.body;
    const agent = await Agent.create({
      name,
      role,
      modelId,
      orderIndex: orderIndex || 0,
      taskType: taskType || null
    });
    res.status(201).json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
});

// Update agent
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, modelId, orderIndex, taskType } = req.body;
    const agent = await Agent.findByPk(id);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }
    await agent.update({ name, role, modelId, orderIndex, taskType });
    res.json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
});

// Reorder agents
router.post('/reorder', authMiddleware, async (req, res, next) => {
  try {
    const { agentIds } = req.body; // Array of agent IDs in new order
    for (let i = 0; i < agentIds.length; i++) {
      await Agent.update({ orderIndex: i }, { where: { id: agentIds[i] } });
    }
    res.json({ success: true, message: 'Agents reordered' });
  } catch (error) {
    next(error);
  }
});

// Delete agent
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findByPk(id);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }
    await agent.destroy();
    res.json({ success: true, message: 'Agent deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


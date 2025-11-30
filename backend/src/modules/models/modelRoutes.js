const express = require('express');
const router = express.Router();
require('../../config/associations');
const { Model } = require('./modelModel');
const { Provider } = require('../providers/providerModel');
const authMiddleware = require('../../middlewares/authMiddleware');

// Get all models
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const models = await Model.findAll({
      include: [{ model: Provider }]
    });
    res.json({ success: true, data: models });
  } catch (error) {
    next(error);
  }
});

// Create model
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { providerId, modelName, costPerToken, contextWindow, enabled } = req.body;
    const model = await Model.create({
      providerId,
      modelName,
      costPerToken: costPerToken || 0,
      contextWindow: contextWindow || 4096,
      enabled: enabled !== false
    });
    res.status(201).json({ success: true, data: model });
  } catch (error) {
    next(error);
  }
});

// Update model
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { providerId, modelName, costPerToken, contextWindow, enabled } = req.body;
    const model = await Model.findByPk(id);
    if (!model) {
      return res.status(404).json({ success: false, error: 'Model not found' });
    }
    await model.update({ providerId, modelName, costPerToken, contextWindow, enabled });
    res.json({ success: true, data: model });
  } catch (error) {
    next(error);
  }
});

// Delete model
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const model = await Model.findByPk(id);
    if (!model) {
      return res.status(404).json({ success: false, error: 'Model not found' });
    }
    await model.destroy();
    res.json({ success: true, message: 'Model deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


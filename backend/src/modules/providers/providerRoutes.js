const express = require('express');
const router = express.Router();
const { Provider } = require('./providerModel');
const authMiddleware = require('../../middlewares/authMiddleware');

// Get all providers
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const providers = await Provider.findAll();
    res.json({ success: true, data: providers });
  } catch (error) {
    next(error);
  }
});

// Create provider
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { name, baseUrl, enabled } = req.body;
    const provider = await Provider.create({ name, baseUrl, enabled: enabled !== false });
    res.status(201).json({ success: true, data: provider });
  } catch (error) {
    next(error);
  }
});

// Update provider
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, baseUrl, enabled } = req.body;
    const provider = await Provider.findByPk(id);
    if (!provider) {
      return res.status(404).json({ success: false, error: 'Provider not found' });
    }
    await provider.update({ name, baseUrl, enabled });
    res.json({ success: true, data: provider });
  } catch (error) {
    next(error);
  }
});

// Delete provider
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findByPk(id);
    if (!provider) {
      return res.status(404).json({ success: false, error: 'Provider not found' });
    }
    await provider.destroy();
    res.json({ success: true, message: 'Provider deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


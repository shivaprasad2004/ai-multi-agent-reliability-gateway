const express = require('express');
const router = express.Router();
const { ApiKey } = require('./apiKeyModel');
const { generateApiKey } = require('../../utils/crypto');
const authMiddleware = require('../../middlewares/authMiddleware');

// Get user's API keys
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const keys = await ApiKey.findAll({
      where: { userId: req.user.id }
    });
    res.json({ success: true, data: keys });
  } catch (error) {
    next(error);
  }
});

// Create API key
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { dailyLimit } = req.body;
    const key = generateApiKey();
    const apiKey = await ApiKey.create({
      userId: req.user.id,
      key,
      status: 'active',
      dailyLimit: dailyLimit || null
    });
    res.status(201).json({ success: true, data: apiKey });
  } catch (error) {
    next(error);
  }
});

// Update API key
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, dailyLimit } = req.body;
    const apiKey = await ApiKey.findByPk(id);
    if (!apiKey || apiKey.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'API key not found' });
    }
    await apiKey.update({ status, dailyLimit });
    res.json({ success: true, data: apiKey });
  } catch (error) {
    next(error);
  }
});

// Delete API key
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const apiKey = await ApiKey.findByPk(id);
    if (!apiKey || apiKey.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: 'API key not found' });
    }
    await apiKey.destroy();
    res.json({ success: true, message: 'API key deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


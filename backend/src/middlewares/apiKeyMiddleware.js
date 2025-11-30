const { ApiKey } = require('../modules/apiKeys/apiKeyModel');

async function apiKeyMiddleware(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ success: false, error: 'API key required' });
    }

    const keyRecord = await ApiKey.findOne({
      where: { key: apiKey, status: 'active' }
    });

    if (!keyRecord) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { Op } = require('sequelize');
    const { Request } = require('../modules/metrics/requestModel');
    
    const todayCount = await Request.count({
      where: {
        apiKeyId: keyRecord.id,
        createdAt: { [Op.gte]: today }
      }
    });

    if (keyRecord.dailyLimit && todayCount >= keyRecord.dailyLimit) {
      return res.status(429).json({ success: false, error: 'Daily limit exceeded' });
    }

    req.apiKey = keyRecord;
    req.userId = keyRecord.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'API key validation failed' });
  }
}

module.exports = apiKeyMiddleware;


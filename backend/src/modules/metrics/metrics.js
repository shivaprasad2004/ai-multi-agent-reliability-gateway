const { Request } = require('./requestModel');
const { Op } = require('sequelize');

async function logRequest(data) {
  try {
    await Request.create({
      userId: data.userId || null,
      apiKeyId: data.apiKeyId || null,
      taskType: data.taskType || null,
      providerId: data.providerId || null,
      modelId: data.modelId || null,
      agentRole: data.agentRole || null,
      latencyMs: data.latencyMs || null,
      inputTokens: data.inputTokens || null,
      outputTokens: data.outputTokens || null,
      status: data.status || 'success',
      errorCode: data.errorCode || null,
      cacheHit: data.cacheHit || false
    });
  } catch (error) {
    console.error('Metrics log error:', error);
  }
}

async function getSummary(startDate, endDate) {
  const where = {};
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

  const total = await Request.count({ where });
  const success = await Request.count({ where: { ...where, status: 'success' } });
  const errors = await Request.count({ where: { ...where, status: 'error' } });
  const cacheHits = await Request.count({ where: { ...where, cacheHit: true } });

  const avgLatency = await Request.findOne({
    where,
    attributes: [
      [Request.sequelize.fn('AVG', Request.sequelize.col('latencyMs')), 'avgLatency']
    ],
    raw: true
  });

  return {
    total,
    success,
    errors,
    cacheHits,
    cacheHitRate: total > 0 ? (cacheHits / total * 100).toFixed(2) : 0,
    avgLatencyMs: avgLatency?.avgLatency ? Math.round(avgLatency.avgLatency) : 0
  };
}

async function getCacheStats(startDate, endDate) {
  const where = {};
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

  const total = await Request.count({ where });
  const hits = await Request.count({ where: { ...where, cacheHit: true } });
  const misses = total - hits;

  return {
    total,
    hits,
    misses,
    hitRate: total > 0 ? (hits / total * 100).toFixed(2) : 0
  };
}

async function getLatencyStats(startDate, endDate) {
  const where = {};
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) where.createdAt[Op.lte] = new Date(endDate);
  }

  const stats = await Request.findOne({
    where,
    attributes: [
      [Request.sequelize.fn('AVG', Request.sequelize.col('latencyMs')), 'avg'],
      [Request.sequelize.fn('MIN', Request.sequelize.col('latencyMs')), 'min'],
      [Request.sequelize.fn('MAX', Request.sequelize.col('latencyMs')), 'max']
    ],
    raw: true
  });

  // Calculate percentiles manually
  const allRequests = await Request.findAll({
    where,
    attributes: ['latencyMs'],
    order: [['latencyMs', 'ASC']],
    raw: true
  });

  const latencies = allRequests.map(r => r.latencyMs || 0).filter(l => l > 0);
  const getPercentile = (arr, percentile) => {
    if (arr.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * arr.length) - 1;
    return arr[Math.max(0, index)];
  };

  return {
    avg: Math.round(stats?.avg || 0),
    min: stats?.min || 0,
    max: stats?.max || 0,
    p50: getPercentile(latencies, 50),
    p95: getPercentile(latencies, 95),
    p99: getPercentile(latencies, 99)
  };
}

module.exports = {
  logRequest,
  getSummary,
  getCacheStats,
  getLatencyStats
};


const { CacheEntry } = require('./cacheModel');
const { sha256 } = require('../../utils/crypto');
const { Op } = require('sequelize');

function normalizePrompt(prompt) {
  return prompt.trim().toLowerCase().replace(/\s+/g, ' ');
}

function computeCacheKey(taskType, prompt, pipelineConfig) {
  const normalized = normalizePrompt(prompt);
  const configStr = JSON.stringify(pipelineConfig || {});
  const combined = `${taskType || ''}|${normalized}|${configStr}`;
  return sha256(combined);
}

async function getCachedResponse(cacheKey) {
  try {
    const entry = await CacheEntry.findOne({
      where: { cacheKey }
    });

    if (entry) {
      // Update hit stats
      entry.hitCount += 1;
      entry.lastHitAt = new Date();
      await entry.save();

      return JSON.parse(entry.responseJson);
    }

    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

async function setCachedResponse(cacheKey, requestHash, response, providerId, modelId) {
  try {
    await CacheEntry.upsert({
      cacheKey,
      requestHash,
      responseJson: JSON.stringify(response),
      providerId,
      modelId,
      hitCount: 0,
      lastHitAt: new Date()
    });
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

async function clearOldCache(daysOld = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await CacheEntry.destroy({
      where: {
        lastHitAt: { [Op.lt]: cutoffDate }
      }
    });
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

module.exports = {
  computeCacheKey,
  getCachedResponse,
  setCachedResponse,
  clearOldCache
};


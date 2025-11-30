const { runPipeline } = require('./pipeline');
const { computeCacheKey, getCachedResponse, setCachedResponse } = require('../cache/cache');
const { logRequest } = require('../metrics/metrics');

async function chat(req, res, next) {
  const startTime = Date.now();
  let requestId = null;

  try {
    const { prompt, taskType, expectJson, jsonSchema, maxTokens, temperature, pipelineConfig } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const userId = req.userId || null;
    const apiKeyId = req.apiKey?.id || null;

    // Check cache
    const cacheKey = computeCacheKey(taskType, prompt, pipelineConfig);
    const cached = await getCachedResponse(cacheKey);

    if (cached && process.env.CACHE_ENABLED !== 'false') {
      const latencyMs = Date.now() - startTime;

      await logRequest({
        userId,
        apiKeyId,
        taskType,
        latencyMs,
        status: 'success',
        cacheHit: true
      });

      return res.json({
        success: true,
        data: {
          content: cached.content,
          inputTokens: cached.inputTokens,
          outputTokens: cached.outputTokens,
          latencyMs,
          cacheHit: true
        }
      });
    }

    // Run pipeline
    const result = await runPipeline(prompt, {
      taskType,
      userId,
      apiKeyId,
      expectJson,
      jsonSchema,
      maxTokens,
      temperature,
      apiKey: req.headers['x-provider-api-key']
    });

    const latencyMs = Date.now() - startTime;

    // Store in cache
    if (process.env.CACHE_ENABLED !== 'false') {
      await setCachedResponse(
        cacheKey,
        cacheKey,
        result,
        result.providerId,
        result.modelId
      );
    }

    // Log final request
    await logRequest({
      userId,
      apiKeyId,
      taskType,
      latencyMs: result.latencyMs,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      status: 'success',
      cacheHit: false
    });

    res.json({
      success: true,
      data: {
        content: result.content,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        latencyMs: result.latencyMs,
        cacheHit: false
      }
    });
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    await logRequest({
      userId: req.userId || null,
      apiKeyId: req.apiKey?.id || null,
      taskType: req.body?.taskType,
      latencyMs,
      status: 'error',
      errorCode: error.message
    });

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = { chat };


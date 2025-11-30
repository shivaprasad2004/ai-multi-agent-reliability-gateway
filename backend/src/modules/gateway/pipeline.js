require('../../config/associations');
const { Agent } = require('../agents/agentModel');
const { Model } = require('../models/modelModel');
const { Provider } = require('../providers/providerModel');
const { createAdapter } = require('../providers/providerAdapter');
const { withRetry, withTimeout, withFallback, withCircuitBreaker, CircuitBreaker } = require('./reliability');
const { validateInput, validateOutput, logViolations } = require('../guardrails/guardrails');
const { logRequest } = require('../metrics/metrics');

const circuitBreaker = new CircuitBreaker(
  parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || 5),
  parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT_MS || 60000)
);

async function getAgentsForPipeline(taskType = null) {
  const where = taskType ? { taskType } : { taskType: null };
  const agents = await Agent.findAll({
    where,
    order: [['orderIndex', 'ASC']],
    include: [{
      model: Model,
      include: [{ model: Provider }]
    }]
  });

  return agents;
}

async function callLLM(agent, prompt, options = {}) {
  const model = agent.Model;
  const provider = model.Provider;
  
  if (!provider.enabled || !model.enabled) {
    throw new Error(`Provider ${provider.name} or model ${model.modelName} is disabled`);
  }

  const adapter = createAdapter(provider.name, {
    apiKey: options.apiKey,
    baseUrl: provider.baseUrl
  });

  const startTime = Date.now();
  let result;
  let errorCode = null;

  try {
    result = await withCircuitBreaker(
      circuitBreaker,
      provider.name,
      () => withRetry(
        () => withTimeout(
          adapter.call(prompt, {
            model: model.modelName,
            maxTokens: options.maxTokens,
            temperature: options.temperature,
            timeout: parseInt(process.env.REQUEST_TIMEOUT_MS || 30000)
          }),
          parseInt(process.env.REQUEST_TIMEOUT_MS || 30000)
        ),
        { maxRetries: parseInt(process.env.MAX_RETRIES || 3) }
      )
    );

    const latencyMs = Date.now() - startTime;

    // Log metrics
    await logRequest({
      providerId: provider.id,
      modelId: model.id,
      agentRole: agent.role,
      latencyMs,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      status: 'success',
      cacheHit: false
    });

    return {
      content: result.content,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      latencyMs,
      providerId: provider.id,
      modelId: model.id
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    errorCode = error.message;

    await logRequest({
      providerId: provider.id,
      modelId: model.id,
      agentRole: agent.role,
      latencyMs,
      status: 'error',
      errorCode
    });

    throw error;
  }
}

async function runPipeline(input, options = {}) {
  const { taskType, userId, apiKeyId, expectJson, jsonSchema } = options;

  // Input validation
  const inputViolations = validateInput(input, {
    maxLength: 10000,
    forbiddenPatterns: options.forbiddenPatterns
  });

  if (inputViolations.length > 0) {
    await logViolations(null, inputViolations);
    throw new Error('Input validation failed');
  }

  // Get agents for pipeline
  const agents = await getAgentsForPipeline(taskType);
  
  if (agents.length === 0) {
    throw new Error('No agents configured for pipeline');
  }

  let currentInput = input;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalLatency = 0;
  let requestId = null;

  // Run through pipeline: generator → safety → quality
  for (const agent of agents) {
    try {
      const result = await callLLM(agent, currentInput, {
        apiKey: options.apiKey,
        maxTokens: options.maxTokens,
        temperature: options.temperature
      });

      currentInput = result.content;
      totalInputTokens += result.inputTokens;
      totalOutputTokens += result.outputTokens;
      totalLatency += result.latencyMs;

      // Output validation after each stage
      const outputViolations = validateOutput(result.content, {
        checkPII: agent.role === 'safety',
        checkToxicity: agent.role === 'safety',
        expectJson: agent.role === 'quality' && expectJson,
        jsonSchema: agent.role === 'quality' && expectJson ? jsonSchema : null
      });

      if (outputViolations.length > 0) {
        await logViolations(requestId, outputViolations);
        
        if (agent.role === 'safety' && outputViolations.some(v => v.type === 'pii' || v.type === 'toxicity')) {
          throw new Error('Safety check failed: PII or toxicity detected');
        }
      }
    } catch (error) {
      throw new Error(`Pipeline stage ${agent.role} failed: ${error.message}`);
    }
  }

  // Final output validation
  const finalViolations = validateOutput(currentInput, {
    checkPII: true,
    checkToxicity: true,
    expectJson,
    jsonSchema
  });

  if (finalViolations.length > 0) {
    await logViolations(requestId, finalViolations);
  }

  return {
    content: currentInput,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    latencyMs: totalLatency
  };
}

module.exports = {
  runPipeline,
  getAgentsForPipeline,
  callLLM
};


const axios = require('axios');
const { Request } = require('../modules/metrics/requestModel');
const { GuardrailViolation } = require('../modules/guardrails/guardrailModel');

// Real-time data generator
function generateRealTimeData() {
  const prompts = [
    "What is artificial intelligence and how does it work?",
    "Explain machine learning algorithms in detail",
    "How do neural networks process information?",
    "What are the applications of deep learning?",
    "Describe natural language processing techniques",
    "What is computer vision and its use cases?",
    "Explain reinforcement learning concepts",
    "How does transfer learning work?",
    "What are the ethical considerations in AI?",
    "Describe the future of artificial intelligence",
    "How do transformers work in NLP?",
    "What is the difference between AI and ML?",
    "Explain gradient descent optimization",
    "How do convolutional neural networks work?",
    "What are generative adversarial networks?",
    "Describe the architecture of large language models",
    "How does attention mechanism work?",
    "What is fine-tuning in machine learning?",
    "Explain the concept of overfitting",
    "How do you evaluate model performance?",
    "What are the challenges in AI deployment?",
    "Describe MLOps best practices",
    "How do you handle imbalanced datasets?",
    "What is feature engineering?",
    "Explain cross-validation techniques"
  ];

  const taskTypes = ['chat', 'analysis', 'code', 'question', 'explanation'];
  const statuses = ['success', 'error'];
  
  return {
    prompt: prompts[Math.floor(Math.random() * prompts.length)],
    taskType: taskTypes[Math.floor(Math.random() * taskTypes.length)],
    status: Math.random() > 0.1 ? statuses[0] : statuses[1], // 90% success rate
    latencyMs: Math.floor(500 + Math.random() * 3000), // 500-3500ms
    inputTokens: Math.floor(10 + Math.random() * 200),
    outputTokens: Math.floor(20 + Math.random() * 500),
    cacheHit: Math.random() > 0.8, // 20% cache hit rate
    errorCode: Math.random() > 0.9 ? 'Timeout' : null
  };
}

// Generate bulk test data
async function generateBulkRequests(count, userId, apiKeyId, providerId, modelId) {
  const requests = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const data = generateRealTimeData();
    const timeOffset = Math.floor(Math.random() * 86400000); // Last 24 hours
    const createdAt = new Date(now - timeOffset);
    
    requests.push({
      userId: userId || null,
      apiKeyId: apiKeyId || null,
      taskType: data.taskType,
      providerId: providerId || null,
      modelId: modelId || null,
      agentRole: ['generator', 'safety', 'quality'][Math.floor(Math.random() * 3)],
      latencyMs: data.latencyMs,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
      status: data.status,
      errorCode: data.errorCode,
      cacheHit: data.cacheHit,
      createdAt
    });
  }
  
  return requests;
}

// Generate bulk guardrail violations
async function generateBulkViolations(count, requestIds) {
  const violations = [];
  const types = ['pii', 'toxicity', 'length', 'pattern', 'json_schema'];
  const details = [
    'PII detected: email pattern found',
    'PII detected: phone number pattern found',
    'PII detected: SSN pattern found',
    'Potential toxicity detected: harmful keyword',
    'Input exceeds maximum length',
    'Forbidden pattern detected in input',
    'Invalid JSON structure',
    'Missing required fields in JSON response'
  ];
  
  for (let i = 0; i < count; i++) {
    const requestId = requestIds[Math.floor(Math.random() * requestIds.length)];
    violations.push({
      requestId: requestId || null,
      type: types[Math.floor(Math.random() * types.length)],
      details: details[Math.floor(Math.random() * details.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000))
    });
  }
  
  return violations;
}

// Real-time load test
async function runLoadTest(apiKey, options = {}) {
  const {
    duration = 60, // seconds
    requestsPerSecond = 5,
    endpoint = 'http://localhost:4000/api/v1/ai/chat',
    verbose = false
  } = options;

  const prompts = [
    "What is AI?",
    "Explain machine learning",
    "How do neural networks work?",
    "What is deep learning?",
    "Describe NLP applications"
  ];

  let totalRequests = 0;
  let successCount = 0;
  let errorCount = 0;
  let totalLatency = 0;
  const startTime = Date.now();
  const endTime = startTime + (duration * 1000);

  console.log(`Starting load test: ${requestsPerSecond} req/s for ${duration} seconds...`);

  const interval = 1000 / requestsPerSecond; // ms between requests
  const requests = [];

  while (Date.now() < endTime) {
    const requestStart = Date.now();
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];

    const request = axios.post(
      endpoint,
      {
        prompt,
        taskType: 'chat'
      },
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )
      .then(response => {
        const latency = Date.now() - requestStart;
        totalLatency += latency;
        successCount++;
        totalRequests++;
        
        if (verbose) {
          console.log(`✓ Request ${totalRequests}: ${latency}ms - ${response.data.data?.content?.substring(0, 50)}...`);
        }
      })
      .catch(error => {
        const latency = Date.now() - requestStart;
        totalLatency += latency;
        errorCount++;
        totalRequests++;
        
        if (verbose) {
          console.log(`✗ Request ${totalRequests}: ${error.response?.status || 'ERROR'} - ${error.message}`);
        }
      });

    requests.push(request);

    // Wait before next request
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  // Wait for all requests to complete
  await Promise.allSettled(requests);

  const totalTime = (Date.now() - startTime) / 1000;
  const avgLatency = totalLatency / totalRequests;
  const successRate = (successCount / totalRequests) * 100;
  const actualRPS = totalRequests / totalTime;

  console.log('\n=== Load Test Results ===');
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Success Rate: ${successRate.toFixed(2)}%`);
  console.log(`Average Latency: ${avgLatency.toFixed(2)}ms`);
  console.log(`Actual RPS: ${actualRPS.toFixed(2)}`);
  console.log(`Total Time: ${totalTime.toFixed(2)}s`);

  return {
    totalRequests,
    successCount,
    errorCount,
    successRate,
    avgLatency,
    actualRPS,
    totalTime
  };
}

module.exports = {
  generateRealTimeData,
  generateBulkRequests,
  generateBulkViolations,
  runLoadTest
};


const bcrypt = require('bcryptjs');
const waitForDb = require('./waitForDb');
require('./associations');
const { User } = require('../modules/users/userModel');
const { ApiKey } = require('../modules/apiKeys/apiKeyModel');
const { Provider } = require('../modules/providers/providerModel');
const { Model } = require('../modules/models/modelModel');
const { Agent } = require('../modules/agents/agentModel');
const { Request } = require('../modules/metrics/requestModel');
const { GuardrailViolation } = require('../modules/guardrails/guardrailModel');
const { generateApiKey } = require('../utils/crypto');

async function seedTestData() {
  try {
    await waitForDb();
    console.log('Seeding test data...');

    // Get admin user
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminUser) {
      console.log('Admin user not found. Run seed.js first.');
      return;
    }

    // Get mock provider and model
    const mockProvider = await Provider.findOne({ where: { name: 'mock' } });
    if (!mockProvider) {
      console.log('Mock provider not found. Run seed.js first.');
      return;
    }

    const mockModel = await Model.findOne({ where: { providerId: mockProvider.id } });
    if (!mockModel) {
      console.log('Mock model not found. Run seed.js first.');
      return;
    }

    // Create test API key
    const existingApiKey = await ApiKey.findOne({ where: { userId: adminUser.id } });
    let testApiKey;
    if (!existingApiKey) {
      testApiKey = await ApiKey.create({
        userId: adminUser.id,
        key: generateApiKey(),
        status: 'active',
        dailyLimit: 1000
      });
      console.log('Test API key created:', testApiKey.key);
    } else {
      testApiKey = existingApiKey;
      console.log('Using existing API key:', testApiKey.key);
    }

    // Create sample requests/metrics
    const sampleRequests = [
      {
        userId: adminUser.id,
        apiKeyId: testApiKey.id,
        taskType: 'chat',
        providerId: mockProvider.id,
        modelId: mockModel.id,
        agentRole: 'generator',
        latencyMs: 1200,
        inputTokens: 15,
        outputTokens: 45,
        status: 'success',
        cacheHit: false,
        createdAt: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        userId: adminUser.id,
        apiKeyId: testApiKey.id,
        taskType: 'chat',
        providerId: mockProvider.id,
        modelId: mockModel.id,
        agentRole: 'safety',
        latencyMs: 800,
        inputTokens: 45,
        outputTokens: 42,
        status: 'success',
        cacheHit: false,
        createdAt: new Date(Date.now() - 3300000) // 55 minutes ago
      },
      {
        userId: adminUser.id,
        apiKeyId: testApiKey.id,
        taskType: 'chat',
        providerId: mockProvider.id,
        modelId: mockModel.id,
        agentRole: 'quality',
        latencyMs: 950,
        inputTokens: 42,
        outputTokens: 50,
        status: 'success',
        cacheHit: false,
        createdAt: new Date(Date.now() - 3000000) // 50 minutes ago
      },
      {
        userId: adminUser.id,
        apiKeyId: testApiKey.id,
        taskType: 'analysis',
        providerId: mockProvider.id,
        modelId: mockModel.id,
        agentRole: 'generator',
        latencyMs: 2100,
        inputTokens: 120,
        outputTokens: 200,
        status: 'success',
        cacheHit: true,
        createdAt: new Date(Date.now() - 2400000) // 40 minutes ago
      },
      {
        userId: adminUser.id,
        apiKeyId: testApiKey.id,
        taskType: 'code',
        providerId: mockProvider.id,
        modelId: mockModel.id,
        agentRole: 'generator',
        latencyMs: 1800,
        inputTokens: 80,
        outputTokens: 150,
        status: 'success',
        cacheHit: false,
        createdAt: new Date(Date.now() - 1800000) // 30 minutes ago
      },
      {
        userId: adminUser.id,
        apiKeyId: testApiKey.id,
        taskType: 'chat',
        providerId: mockProvider.id,
        modelId: mockModel.id,
        agentRole: 'generator',
        latencyMs: 500,
        inputTokens: 20,
        outputTokens: 30,
        status: 'success',
        cacheHit: true,
        createdAt: new Date(Date.now() - 1200000) // 20 minutes ago
      },
      {
        userId: adminUser.id,
        apiKeyId: testApiKey.id,
        taskType: 'chat',
        providerId: mockProvider.id,
        modelId: mockModel.id,
        agentRole: 'safety',
        latencyMs: 650,
        inputTokens: 30,
        outputTokens: 28,
        status: 'success',
        cacheHit: false,
        createdAt: new Date(Date.now() - 900000) // 15 minutes ago
      },
      {
        userId: adminUser.id,
        apiKeyId: testApiKey.id,
        taskType: 'chat',
        providerId: mockProvider.id,
        modelId: mockModel.id,
        agentRole: 'quality',
        latencyMs: 720,
        inputTokens: 28,
        outputTokens: 35,
        status: 'success',
        cacheHit: false,
        createdAt: new Date(Date.now() - 600000) // 10 minutes ago
      },
      {
        userId: adminUser.id,
        apiKeyId: testApiKey.id,
        taskType: 'analysis',
        providerId: mockProvider.id,
        modelId: mockModel.id,
        agentRole: 'generator',
        latencyMs: 2500,
        inputTokens: 150,
        outputTokens: 300,
        status: 'error',
        errorCode: 'Timeout exceeded',
        cacheHit: false,
        createdAt: new Date(Date.now() - 300000) // 5 minutes ago
      },
      {
        userId: adminUser.id,
        apiKeyId: testApiKey.id,
        taskType: 'chat',
        providerId: mockProvider.id,
        modelId: mockModel.id,
        agentRole: 'generator',
        latencyMs: 1100,
        inputTokens: 25,
        outputTokens: 40,
        status: 'success',
        cacheHit: false,
        createdAt: new Date(Date.now() - 60000) // 1 minute ago
      }
    ];

    // Check if requests already exist
    const existingRequests = await Request.count();
    if (existingRequests === 0) {
      await Request.bulkCreate(sampleRequests);
      console.log(`Created ${sampleRequests.length} sample requests`);
    } else {
      console.log(`Requests already exist (${existingRequests} total). Skipping.`);
    }

    // Create sample guardrail violations
    const sampleViolations = [
      {
        requestId: sampleRequests[2]?.id || null,
        type: 'pii',
        details: 'PII detected: email pattern found in output',
        createdAt: new Date(Date.now() - 3000000)
      },
      {
        requestId: sampleRequests[4]?.id || null,
        type: 'length',
        details: 'Input exceeds maximum length of 10000 characters',
        createdAt: new Date(Date.now() - 1800000)
      },
      {
        requestId: sampleRequests[8]?.id || null,
        type: 'toxicity',
        details: 'Potential toxicity detected: harmful keyword found',
        createdAt: new Date(Date.now() - 300000)
      }
    ];

    const existingViolations = await GuardrailViolation.count();
    if (existingViolations === 0) {
      // Get actual request IDs
      const requests = await Request.findAll({ limit: 10, order: [['createdAt', 'DESC']] });
      if (requests.length >= 3) {
        sampleViolations[0].requestId = requests[2].id;
        sampleViolations[1].requestId = requests[4]?.id || requests[3].id;
        sampleViolations[2].requestId = requests[8]?.id || requests[requests.length - 1].id;
      }
      await GuardrailViolation.bulkCreate(sampleViolations);
      console.log(`Created ${sampleViolations.length} sample guardrail violations`);
    } else {
      console.log(`Guardrail violations already exist (${existingViolations} total). Skipping.`);
    }

    // Create additional test providers (optional)
    const openaiProvider = await Provider.findOne({ where: { name: 'openai' } });
    if (!openaiProvider) {
      const newOpenAI = await Provider.create({
        name: 'openai',
        baseUrl: 'https://api.openai.com/v1',
        enabled: false // Disabled by default (no API key)
      });
      console.log('Created OpenAI provider (disabled - add API key to enable)');
    }

    const geminiProvider = await Provider.findOne({ where: { name: 'gemini' } });
    if (!geminiProvider) {
      const newGemini = await Provider.create({
        name: 'gemini',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        enabled: false // Disabled by default (no API key)
      });
      console.log('Created Gemini provider (disabled - add API key to enable)');
    }

    console.log('');
    console.log('✅ Test data seeding completed!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Sample requests: ${await Request.count()}`);
    console.log(`   - Guardrail violations: ${await GuardrailViolation.count()}`);
    console.log(`   - Providers: ${await Provider.count()}`);
    console.log(`   - Models: ${await Model.count()}`);
    console.log(`   - Agents: ${await Agent.count()}`);
    console.log('');
    console.log('🔑 Test API Key:', testApiKey.key);
    console.log('');
    console.log('🌐 Access the dashboard at: http://localhost:3000');
    console.log('   Login: admin@example.com / Admin123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Test data seeding error:', error);
    process.exit(1);
  }
}

seedTestData();


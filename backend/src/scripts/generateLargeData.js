require('dotenv').config();
const waitForDb = require('../config/waitForDb');
require('../config/associations');
const { User } = require('../modules/users/userModel');
const { ApiKey } = require('../modules/apiKeys/apiKeyModel');
const { Provider } = require('../modules/providers/providerModel');
const { Model } = require('../modules/models/modelModel');
const { Request } = require('../modules/metrics/requestModel');
const { GuardrailViolation } = require('../modules/guardrails/guardrailModel');
const { generateBulkRequests, generateBulkViolations } = require('../utils/loadTest');

async function generateLargeData() {
  try {
    await waitForDb();
    console.log('Generating large test dataset...\n');

    // Get admin user
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminUser) {
      console.error('Admin user not found');
      process.exit(1);
    }

    // Get or create API key
    let apiKey = await ApiKey.findOne({ where: { userId: adminUser.id } });
    if (!apiKey) {
      const { generateApiKey } = require('../utils/crypto');
      apiKey = await ApiKey.create({
        userId: adminUser.id,
        key: generateApiKey(),
        status: 'active',
        dailyLimit: 100000
      });
    }

    // Get mock provider and model
    const mockProvider = await Provider.findOne({ where: { name: 'mock' } });
    const mockModel = await Model.findOne({ where: { providerId: mockProvider.id } });

    const counts = {
      requests: parseInt(process.argv[2]) || 1000,
      violations: parseInt(process.argv[3]) || 100
    };

    console.log(`Generating ${counts.requests} requests and ${counts.violations} violations...\n`);

    // Generate requests in batches
    const batchSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < counts.requests; i += batchSize) {
      const batchCount = Math.min(batchSize, counts.requests - i);
      const requests = await generateBulkRequests(
        batchCount,
        adminUser.id,
        apiKey.id,
        mockProvider.id,
        mockModel.id
      );

      await Request.bulkCreate(requests);
      totalInserted += batchCount;
      
      process.stdout.write(`\rProgress: ${totalInserted}/${counts.requests} requests inserted...`);
    }

    console.log('\n✓ Requests generated');

    // Get some request IDs for violations
    const sampleRequests = await Request.findAll({
      limit: Math.min(counts.violations * 2, 1000),
      attributes: ['id']
    });
    const requestIds = sampleRequests.map(r => r.id);

    // Generate violations
    const violations = await generateBulkViolations(counts.violations, requestIds);
    await GuardrailViolation.bulkCreate(violations);
    console.log(`✓ ${violations.length} violations generated`);

    // Summary
    const totalRequests = await Request.count();
    const totalViolations = await GuardrailViolation.count();
    const successCount = await Request.count({ where: { status: 'success' } });
    const errorCount = await Request.count({ where: { status: 'error' } });
    const cacheHits = await Request.count({ where: { cacheHit: true } });

    console.log('\n=== Dataset Summary ===');
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Cache Hits: ${cacheHits}`);
    console.log(`Cache Hit Rate: ${((cacheHits / totalRequests) * 100).toFixed(2)}%`);
    console.log(`Guardrail Violations: ${totalViolations}`);
    console.log('\n✅ Large dataset generation complete!');
    console.log('\nRefresh your dashboard to see the data!');

    process.exit(0);
  } catch (error) {
    console.error('Error generating data:', error);
    process.exit(1);
  }
}

generateLargeData();


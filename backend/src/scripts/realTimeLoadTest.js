require('dotenv').config();
const waitForDb = require('../config/waitForDb');
require('../config/associations');
const { User } = require('../modules/users/userModel');
const { ApiKey } = require('../modules/apiKeys/apiKeyModel');
const { runLoadTest } = require('../utils/loadTest');

async function startRealTimeLoadTest() {
  try {
    await waitForDb();

    // Get admin user and API key
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminUser) {
      console.error('Admin user not found');
      process.exit(1);
    }

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

    const duration = parseInt(process.argv[2]) || 60; // seconds
    const rps = parseInt(process.argv[3]) || 5; // requests per second
    const endpoint = process.argv[4] || 'http://localhost:4000/api/v1/ai/chat';

    console.log(`\n🚀 Starting Real-Time Load Test`);
    console.log(`Duration: ${duration} seconds`);
    console.log(`Rate: ${rps} requests/second`);
    console.log(`Endpoint: ${endpoint}\n`);

    await runLoadTest(apiKey.key, {
      duration,
      requestsPerSecond: rps,
      endpoint,
      verbose: false
    });

    process.exit(0);
  } catch (error) {
    console.error('Load test error:', error);
    process.exit(1);
  }
}

startRealTimeLoadTest();


const sequelize = require('./db');
const waitForDb = require('./waitForDb');
require('./associations');
const { User } = require('../modules/users/userModel');
const { ApiKey } = require('../modules/apiKeys/apiKeyModel');
const { Provider } = require('../modules/providers/providerModel');
const { Model } = require('../modules/models/modelModel');
const { Agent } = require('../modules/agents/agentModel');
const { RoutingRule } = require('../modules/routing/routingModel');
const { CacheEntry } = require('../modules/cache/cacheModel');
const { Request } = require('../modules/metrics/requestModel');
const { GuardrailViolation } = require('../modules/guardrails/guardrailModel');

async function migrate() {
  try {
    await waitForDb();
    console.log('Database connection established.');

    // Sync all models
    await User.sync({ alter: true });
    await ApiKey.sync({ alter: true });
    await Provider.sync({ alter: true });
    await Model.sync({ alter: true });
    await Agent.sync({ alter: true });
    await RoutingRule.sync({ alter: true });
    await CacheEntry.sync({ alter: true });
    await Request.sync({ alter: true });
    await GuardrailViolation.sync({ alter: true });

    console.log('Database migrations completed.');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrate();


const { User } = require('../modules/users/userModel');
const { ApiKey } = require('../modules/apiKeys/apiKeyModel');
const { Provider } = require('../modules/providers/providerModel');
const { Model } = require('../modules/models/modelModel');
const { Agent } = require('../modules/agents/agentModel');
const { RoutingRule } = require('../modules/routing/routingModel');
const { CacheEntry } = require('../modules/cache/cacheModel');
const { Request } = require('../modules/metrics/requestModel');
const { GuardrailViolation } = require('../modules/guardrails/guardrailModel');

// User associations
User.hasMany(ApiKey, { foreignKey: 'userId' });
ApiKey.belongsTo(User, { foreignKey: 'userId' });

// Provider associations
Provider.hasMany(Model, { foreignKey: 'providerId' });
Model.belongsTo(Provider, { foreignKey: 'providerId' });

// Model associations
Model.hasMany(Agent, { foreignKey: 'modelId' });
Agent.belongsTo(Model, { foreignKey: 'modelId' });

// Routing associations
RoutingRule.belongsTo(Model, { foreignKey: 'primaryModelId', as: 'primaryModel' });
RoutingRule.belongsTo(Model, { foreignKey: 'backupModelId', as: 'backupModel' });

// Cache associations
CacheEntry.belongsTo(Provider, { foreignKey: 'providerId' });
CacheEntry.belongsTo(Model, { foreignKey: 'modelId' });

// Request associations
Request.belongsTo(User, { foreignKey: 'userId' });
Request.belongsTo(ApiKey, { foreignKey: 'apiKeyId' });
Request.belongsTo(Provider, { foreignKey: 'providerId' });
Request.belongsTo(Model, { foreignKey: 'modelId' });

// Guardrail associations
GuardrailViolation.belongsTo(Request, { foreignKey: 'requestId' });

module.exports = {};


const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  apiKeyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'api_keys',
      key: 'id'
    }
  },
  taskType: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  providerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'providers',
      key: 'id'
    }
  },
  modelId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'models',
      key: 'id'
    }
  },
  agentRole: {
    type: DataTypes.ENUM('generator', 'safety', 'quality'),
    allowNull: true
  },
  latencyMs: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  inputTokens: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  outputTokens: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('success', 'error', 'timeout'),
    defaultValue: 'success'
  },
  errorCode: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  cacheHit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'requests',
  timestamps: false
});

module.exports = { Request };


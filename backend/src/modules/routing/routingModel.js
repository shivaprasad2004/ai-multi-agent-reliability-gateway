const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RoutingRule = sequelize.define('RoutingRule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  taskType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  primaryModelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'models',
      key: 'id'
    }
  },
  backupModelId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'models',
      key: 'id'
    }
  },
  strategy: {
    type: DataTypes.ENUM('primary', 'backup', 'round-robin'),
    defaultValue: 'primary'
  }
}, {
  tableName: 'routing_rules',
  timestamps: false
});

module.exports = { RoutingRule };


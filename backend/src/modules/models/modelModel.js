const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Model = sequelize.define('Model', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  providerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'providers',
      key: 'id'
    }
  },
  modelName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  costPerToken: {
    type: DataTypes.DECIMAL(10, 8),
    defaultValue: 0
  },
  contextWindow: {
    type: DataTypes.INTEGER,
    defaultValue: 4096
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'models',
  timestamps: false
});

module.exports = { Model };


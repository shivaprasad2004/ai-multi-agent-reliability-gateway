const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('generator', 'safety', 'quality'),
    allowNull: false
  },
  modelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'models',
      key: 'id'
    }
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  taskType: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'agents',
  timestamps: false
});

module.exports = { Agent };


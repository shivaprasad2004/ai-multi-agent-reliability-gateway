const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const GuardrailViolation = sequelize.define('GuardrailViolation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'requests',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('pii', 'toxicity', 'length', 'pattern', 'json_schema'),
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'guardrail_violations',
  timestamps: false
});

module.exports = { GuardrailViolation };


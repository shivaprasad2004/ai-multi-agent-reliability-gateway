const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const CacheEntry = sequelize.define('CacheEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cacheKey: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  requestHash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true
  },
  responseJson: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  providerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  modelId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastHitAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  hitCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'cache_entries',
  timestamps: false
});

module.exports = { CacheEntry };


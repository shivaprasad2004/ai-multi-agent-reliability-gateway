const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Provider = sequelize.define('Provider', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  baseUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'providers',
  timestamps: false
});

module.exports = { Provider };


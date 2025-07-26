const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Employee = require('./employee');
const Asset = require('./asset');

const AssetHistory = sequelize.define('AssetHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  asset_name: {
    type: DataTypes.STRING(500),
    allowNull: false,
    references: {
      model: 'assets',
      key: 'make'
    }
  },
  employee_name: {
    type: DataTypes.STRING(500),
    allowNull: true,
    references: {
      model: 'employees',
      key: 'name'
    },
    onDelete: 'SET NULL'
  },
  action_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  action_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'assethistory',
  timestamps: false 
});

module.exports = AssetHistory;

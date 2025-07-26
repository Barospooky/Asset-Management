const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  serial_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  asset_type: {  
    type: DataTypes.STRING,
    allowNull: false,
  },
  purchase_date: {
    type: DataTypes.DATEONLY,
  },
  purchase_price: { 
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Available', 'Issued', 'Scraped'),
    defaultValue: 'Available',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'assets',
  timestamps: false
});

module.exports = Asset;
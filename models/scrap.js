const { DataTypes } = require('sequelize');
const sequelize = require('../db');

  const AssetScrap = sequelize.define("AssetScrap", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scrap_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    scrap_reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'assetscrap',
    timestamps: false
  });

 module.exports = AssetScrap;


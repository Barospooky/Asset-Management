const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const AssetReturn = sequelize.define('AssetReturn', {
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    asset_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    return_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    return_reason: {
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
    tableName: 'assetreturn',
    timestamps: false
  });
  
module.exports = AssetReturn;

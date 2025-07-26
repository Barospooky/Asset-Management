const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const AssetIssue = sequelize.define('AssetIssue', {
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
    issue_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    remarks: {
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
    tableName: 'AssetIssue',
    timestamps: false
  });
  
module.exports = AssetIssue;

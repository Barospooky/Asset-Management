const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define('Branch', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'branch',
    timestamps: false 
  });

  Branch.associate = models => {
    Branch.hasMany(models.Asset, { foreignKey: 'branch_id' });
  };

  return Branch;
};

const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  join_date: DataTypes.DATEONLY,
  leave_date: DataTypes.DATEONLY,
  branch_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'branch',
      key: 'id'
    }
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
  tableName: 'employees',
  timestamps: false
});

module.exports = Employee;

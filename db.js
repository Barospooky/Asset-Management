const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('asset_management', 'postgres', 'Barani@2003', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;

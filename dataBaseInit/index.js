const { Sequelize } = require('sequelize');
const { databaseOptions } = require('../config');

const sequelize = new Sequelize(databaseOptions);
(async function() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully');
  } catch (err) {
    console.log('Connection failed:', err);
  } 
})();

module.exports.sequelize = sequelize;

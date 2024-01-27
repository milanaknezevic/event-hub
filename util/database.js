const Sequelize = require('sequelize')
const sequelize = new Sequelize('event_hub_db', 'root', 'milana', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;
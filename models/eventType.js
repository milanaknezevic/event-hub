const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const EventType = sequelize.define("EventType", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
}, {
    tableName: 'EventType',
});

module.exports = EventType;

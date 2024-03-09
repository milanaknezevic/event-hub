const Sequelize = require('sequelize');

const sequelize = require('../util/database')
const User = require('./user')
const {USER_STATUS} = require("./enums");

const Event = sequelize.define("Event", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING(1024),
        allowNull: false,
    },
    startTime: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    endTime: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    status: { //0 nije poceo 1 u toku  2 zavrsen 3 obrisna
        type: Sequelize.SMALLINT,
        allowNull: false,
        default: 0
    },
}, {
    tableName: 'Event',
});

module.exports = Event;
const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const {USER_ROLES, PRIORITY} = require("./enums");

const Ticket = sequelize.define("Ticket", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    question: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    answer: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    priority: {//visok srednj nizak
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: PRIORITY.LOW
    },
    status: {//opened closed in progress
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: USER_ROLES.CUSTOMER
    },
    creationDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}, {
    tableName: 'Ticket',
});


module.exports = Ticket;

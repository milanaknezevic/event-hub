const Sequelize = require('sequelize');
const sequelize = require('../util/database');

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
    priority: {
        type: Sequelize.SMALLINT,
        allowNull: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    creationDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },

});

module.exports = Ticket;

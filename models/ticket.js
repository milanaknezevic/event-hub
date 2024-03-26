const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const {USER_ROLES, PRIORITY, STATUS} = require("./enums");

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
        allowNull: true,
        defaultValue: PRIORITY.LOW,
        validate: {
            isIn: {
                args: [Object.values(PRIORITY)],
                msg: 'Invalid priority value',
            },
        }
    },
    status: {//opened closed in progress
        type: Sequelize.SMALLINT,
        allowNull: true,
        defaultValue: STATUS.OPENED,
        validate: {
            isIn: {
                args: [Object.values(STATUS)],
                msg: 'Invalid ticket status value',
            },
        }
    },
    creationDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    read: {
        type: Sequelize.SMALLINT,
        allowNull: true,
        defaultValue: 0 // 0 je false tj nije procitano, 1 procitano , 2 pregledao klijent/organizer
    },
}, {
    tableName: 'Ticket',
});


module.exports = Ticket;

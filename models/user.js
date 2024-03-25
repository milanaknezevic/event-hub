const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Event = require('./event')
const {USER_STATUS, USER_ROLES} = require("./enums");

const User = sequelize.define("User", {
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
    lastname: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(45),
        validate: {
            isEmail: true,
        },
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    phoneNumber: {
        type: Sequelize.STRING(45),
        allowNull: false,
    },
    role: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        default: USER_ROLES.CLIENT,
        validate: {
            isIn: {
                args: [Object.values(USER_ROLES)],
                msg: 'Invalid user role value',
            },
        }
    },
    status: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        default: USER_STATUS.REQUESTED
    },
    avatar: {
        type: Sequelize.STRING(1024),
        allowNull: true,
    },

}, {
    tableName: 'User',
});

module.exports = User;

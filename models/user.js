const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Event=require('./event')

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
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.SMALLINT,
        allowNull: false,
    },
    status: {
        type: Sequelize.SMALLINT,
        allowNull: false,
    },
    avatar: {
        type: Sequelize.STRING(1024),
        allowNull: true,
    }
});

module.exports = User;

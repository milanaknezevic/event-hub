const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Invitation = sequelize.define("Invitation", {
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    event_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    statusCreator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    statusGuest: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    read:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
}, {
    tableName: 'Invitation',
});

module.exports = Invitation;

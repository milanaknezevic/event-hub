const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Invitation = sequelize.define("Invitation", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
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
}, {
    tableName: 'Invitation',
});

module.exports = Invitation;

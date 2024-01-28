const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Location = sequelize.define("Location", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    address: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'Location',
});

module.exports = Location;

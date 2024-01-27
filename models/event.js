const Sequelize = require('sequelize');

const sequelize = require('../util/database')
const User = require('./user')

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
});

// Event.belongsTo(User, {foreignKey:'creator_id' ,constraints: true, onDelete: 'CASCADE'});


module.exports = Event;
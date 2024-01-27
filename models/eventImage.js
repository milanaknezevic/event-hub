const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const EventImage = sequelize.define("EventImage", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    image: {
        type: Sequelize.STRING(1024),
        allowNull: false,
    }
});

module.exports = EventImage;

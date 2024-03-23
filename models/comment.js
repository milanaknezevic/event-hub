const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Comment = sequelize.define("Comment", {
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
    creationDate: {
        type: Sequelize.DATE,
        allowNull: false,
    }
}, {
    tableName: 'Comment',
});
module.exports = Comment;

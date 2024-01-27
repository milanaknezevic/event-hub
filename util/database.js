const {Sequelize,DataType} = require('sequelize');

const sequelize = new Sequelize('event_hub_db', 'postgres', 'milana123', {
    host: 'localhost',
    dialect: 'postgres',
    define: {
        timestamps: false
    },
});

try {
     sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


module.exports = sequelize;

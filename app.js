const express = require("express")

const sequelize = require('./util/database')

const app = express()
const Comment = require('./models/comment')
const Event = require('./models/event')
const EventImage = require('./models/eventImage')
const EventType = require('./models/eventType')
const Invitation = require('./models/invitation')
const Location = require('./models/location')
const Ticket = require('./models/ticket')
const User = require('./models/user')

User.hasMany(Event, {as: 'events'});
EventType.hasMany(Event, {as: 'events'})
Location.hasMany(Event, {as: 'events'})
Event.belongsTo(User, {foreignKey: 'creator_id', constraints: true, onDelete: 'CASCADE'});
Event.belongsTo(EventType, {foreignKey: 'eventType_id', constraints: true, onDelete: 'CASCADE'});
Event.belongsTo(Location, {foreignKey: 'location_id', constraints: true, onDelete: 'CASCADE'});

Event.hasMany(Comment, {as: 'comments'});
User.hasMany(Comment, {as: 'comments'});
Comment.belongsTo(Event, {foreignKey: 'event_id', constraints: true, onDelete: 'CASCADE'});
Comment.belongsTo(User, {foreignKey: 'user_id', constraints: true, onDelete: 'CASCADE'});

Event.hasMany(EventImage, {as: 'eventImages'});
EventImage.belongsTo(Event, {foreignKey: 'event_id', constraints: true, onDelete: 'CASCADE'});

User.hasMany(Ticket, {as: 'createdTickets'});
User.hasMany(Ticket, {as: 'assignedTickets'});
Ticket.belongsTo(User, {foreignKey: 'client_id', constraints: true, onDelete: 'CASCADE'});
Ticket.belongsTo(User, {foreignKey: 'support_id', constraints: true, onDelete: 'CASCADE'});

User.belongsToMany(Event,{through: Invitation});
Event.belongsToMany(User,{through: Invitation});

app.get('/', (req, res) => {
    res.send("hello2")
})

app.listen(3000, () => {
    console.log("milana")
})
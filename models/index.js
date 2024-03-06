const Comment = require('./comment')
const Event = require('./event')
const EventImage = require('./eventImage')
const EventType = require('./eventType')
const Invitation = require('./invitation')
const Location = require('./location')
const Ticket = require('./ticket')
const User = require('./user')

User.hasMany(Event, {as: 'events', foreignKey: 'creator_id'});
EventType.hasMany(Event, {as: 'events', foreignKey: 'eventType_id'})
Location.hasMany(Event, {as: 'events', foreignKey: 'location_id'})
Event.belongsTo(User, {foreignKey: 'creator_id', constraints: true, onDelete: 'CASCADE'});
Event.belongsTo(EventType, {foreignKey: 'eventType_id', constraints: true, onDelete: 'CASCADE'});
Event.belongsTo(Location, {foreignKey: 'location_id', constraints: true, onDelete: 'CASCADE'});

Event.hasMany(Comment, {as: 'eventComments', foreignKey: 'event_id'});
Comment.belongsTo(Event, {foreignKey: 'event_id', as: 'eventComments', constraints: true, onDelete: 'CASCADE'});

User.hasMany(Comment, {as: 'userComments', foreignKey: 'user_id'});
Comment.belongsTo(User, {foreignKey: 'user_id', as: 'userComments', constraints: true, onDelete: 'CASCADE'});

Event.hasMany(EventImage, {as: 'eventImages', foreignKey: 'event_id'});
EventImage.belongsTo(Event, {foreignKey: 'event_id', as: 'eventImages', constraints: true, onDelete: 'CASCADE'});



// User.hasMany(Ticket, {as: 'createdTickets', foreignKey: 'client_id'});
// User.hasMany(Ticket, {as: 'assignedTickets',foreignKey: 'support_id'});
// Ticket.belongsTo(User, {foreignKey: 'client_id', constraints: true, onDelete: 'CASCADE'});
// Ticket.belongsTo(User, {foreignKey: 'support_id', constraints: true, onDelete: 'CASCADE'});
User.hasMany(Ticket, { as: 'createdTickets', foreignKey: 'client_id' });
User.hasMany(Ticket, { as: 'assignedTickets', foreignKey: 'support_id' });
Ticket.belongsTo(User, { foreignKey: 'client_id', as: 'createdTicket', constraints: true, onDelete: 'CASCADE' });
Ticket.belongsTo(User, { foreignKey: 'support_id', as: 'assignedToTicket', constraints: true, onDelete: 'CASCADE' });


User.belongsToMany(Event, {through: 'Invitation', foreignKey: 'user_id', as: 'invitedEvents'});
Event.belongsToMany(User, {through: 'Invitation', foreignKey: 'event_id', as: 'attendingUsers'});

Invitation.belongsTo(User, {foreignKey: 'user_id',as: 'invitedUser', constraints: true, onDelete: 'CASCADE'});
Invitation.belongsTo(Event, {foreignKey: 'event_id',as: 'event', constraints: true, onDelete: 'CASCADE'});



module.exports = {
    Comment,
    Event,
    EventImage,
    EventType,
    Invitation,
    Location,
    Ticket,
    User,
};
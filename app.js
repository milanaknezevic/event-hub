const express = require("express")
const sequelize = require('./util/database')
require('dotenv').config();

const bodyParser = require('body-parser')
const app = express()


app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json())
//app.use(express.urlencoded({extended: true}))
const cors = require('cors')


const corsOption = {
    origin: "*"
};

app.use(cors(corsOption))



const userRouter = require('./routes/user-routes')
app.use('/api/users', userRouter)


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

User.belongsToMany(Event, {through: Invitation});
Event.belongsToMany(User, {through: Invitation});

app.get('/', (req, res) => {
    res.send("hello2")
})

// console.log("DATABASE_NAME ", process.env.DATABASE_NAME)
// console.log("USERNAME_DB ", process.env.USERNAME_DB)
// console.log("ROOT ", process.env.ROOT)
// console.log("PORT ", process.env.PORT)
// console.log("TEST ", process.env.TEST)
app.listen(process.env.PORT, () => {
    console.log("milana")
})
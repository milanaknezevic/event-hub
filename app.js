require('dotenv').config();

const express = require("express")
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const corsOption = {origin: "*"};
const {Comment, Event, EventImage, EventType, Invitation, Location, Ticket, User} = require('./models');
const userRouter = require('./routes/user-routes')
const locationRouter = require('./routes/location-routes')
const eventTypeRouter = require('./routes/eventType-routes')
const eventImageRouter = require('./routes/eventImage-routes')
const eventRouter = require('./routes/event-routes')


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors(corsOption))
app.use('/api/users', userRouter)
app.use('/api/locations', locationRouter);
app.use('/api/eventTypes', eventTypeRouter)
app.use('/api/eventImages', eventImageRouter);
app.use('/api/events', eventRouter)

app.get('/', (req, res) => {
    res.send("hello2")
})
app.listen(process.env.PORT, () => {
    console.log("milana")
})
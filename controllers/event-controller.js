const Event = require("../models/event");

const addEvent = async (req, res) => {
    try {
        const eventData = {
            name: req.body.name,
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            creator_id: req.body.creator_id,
            eventType_id: req.body.eventType_id,
            location_id: req.body.location_id
        };
        const newEvent = await Event.create(eventData);
        res.status(201).json({
            message: 'Event added succesfuly',
            eventType: newEvent
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const getAllEvent = async (req, res) => {
    try {
        let events = await Event.findAll({});
        res.status(200).send({events});
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};


module.exports = {
    addEvent,
    getAllEvent
}
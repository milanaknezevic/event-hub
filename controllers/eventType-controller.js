const EventType = require("../models/eventType");

const addEventType = async (req, res) => {
    try {
        const eventTypeData = {
            name: req.body.name,
        };
        const newEventType = await EventType.create(eventTypeData);
        res.status(201).json({
            message: 'Event Type added succesfuly',
            eventType: newEventType
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const getAllEventTypes = async (req, res) => {
    try {
        let eventTypes = await EventType.findAll({});
        res.json(eventTypes);
        // res.status(200).send({ eventTypes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


module.exports = {
    addEventType,
    getAllEventTypes
}
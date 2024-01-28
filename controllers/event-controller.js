const Event = require("../models/event");
const Location = require("../models/location");
const EventType = require("../models/eventType")
const EventImage = require("../models/eventImage");
const Comment = require("../models/comment")
const User=require('../models/user')
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
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getEventById = async (req, res) => {
    try {
        let id = req.params.id
        let event = await Event.findOne({
            where: {id: id},
            include: [
                {model: EventImage, as: 'eventImages'},
                {
                    model: Comment,
                    as: 'eventComments',
                    include:[{
                        model: User,
                        as:'userComments'
                    }]
                }
            ]
        })
        res.status(200).send(event)
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getAllEvents = async (req, res) => {
    try {
        let events = await Event.findAll({
            include: [{model: EventImage, as: 'eventImages'}]
        });
        res.status(200).send({events});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getEventsByLocationId = async (req, res) => {
    try {

        let locationId = req.params.locationId
        const location = await Location.findByPk(locationId);

        if (!location) {
            return res.status(404).json({error: 'Location not found.'});
        }
        const events = await Event.findAll({
            include: [
                {model: Location, where: {id: locationId}},
                {model: EventImage, as: 'eventImages'},
            ],
        });
        return res.status(200).json(events);
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getEventsByEventTypeId = async (req, res) => {
    try {

        let eventTypeId = req.params.eventTypeId
        const eventType = await EventType.findByPk(eventTypeId);

        if (!eventType) {
            return res.status(404).json({error: 'Event Type not found.'});
        }
        const events = await Event.findAll({
            include: [
                {model: EventType, where: {id: eventTypeId}},
                {model: EventImage, as: 'eventImages'},
            ],
        });
        return res.status(200).json(events);
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const deleteEvent = async (req, res) => {
    try {
        let id = req.params.id
        await Event.destroy({where: {id: id}})
        res.status(200).send('Event is deleted!')
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const updateEvent = async (req, res) => {
    const eventId = req.params.id;
    const updatedProperties = req.body;
    try {
        const existingEvent = await Event.findByPk(eventId);

        if (!existingEvent) {
            return res.status(404).json({success: false, message: 'Event not found.'});
        }
        await existingEvent.update(updatedProperties);

        res.status(200).json({success: true, message: 'Event properties updated successfully.', user: existingEvent});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    addEvent,
    deleteEvent,
    updateEvent,
    getEventsByLocationId,
    getEventsByEventTypeId
}
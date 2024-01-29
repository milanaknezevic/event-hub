const Event = require("../models/event");
const Location = require("../models/location");
const EventType = require("../models/eventType")
const EventImage = require("../models/eventImage");
const Comment = require("../models/comment")
const User = require('../models/user')
const Invitation=require('../models/invitation')
const Sequelize = require('sequelize');
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
                    include: [{
                        model: User,
                        as: 'userComments'
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
const filterEvents = async (req, res) => {
    try {
        const {name, startDate, endDate} = req.query;
        const query = {};

        if (name) {
            query.name = { [Sequelize.Op.iLike]: `%${name}%` };
        }

        if (startDate !== undefined && endDate !== undefined && startDate !== "" && endDate !== "") {
            const parseStartDate = new Date(startDate);
            const parseEndDate = new Date(endDate);

            if (!isNaN(parseStartDate) && !isNaN(parseEndDate)) {
                query.startTime = {
                    [Sequelize.Op.gte]: parseStartDate,
                    [Sequelize.Op.lte]: parseEndDate,
                };
                query.endTime = {
                    [Sequelize.Op.gte]: parseStartDate,
                    [Sequelize.Op.lte]: parseEndDate,
                };
            } else {
                return res.status(400).json({success: false, message: 'Invalid date format.'});
            }
        }

        const events = await Event.findAll({where: query});

        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};
// const getAllEventGuests = async (req, res) => {
//     try {
//         let id = req.params.id;
//         const event = await Event.findByPk(id);
//
//         if (!event) {
//             return res.status(404).json({error: 'Event not found.'});
//         }
//         let statusOption = parseInt(req.query.status, 10);
//
// //0=prihvatili pozivnice, 1= nisu prihvatili pzoivnice
//         let guests;
//         switch (statusOption) {
//             case 0:
//                 guests = await User.findAll({
//                     include: [{
//                         model: Event,
//                         through: {
//                             model: Invitation,
//                             where: {
//                                 statusGuest: true,
//                             },
//                         },
//                         where: {
//                             id: eventId,
//                         },
//                     }],
//                 });
//                 break;
//             default:
//                 return res.status(400).json({error: 'Invalid status option.'});
//
//         }
//
//         return res.status(200).json({success: true, guests: guests});
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({success: false, message: 'Internal server error.'});
//     }
// };

module.exports = {
    getAllEvents,
    getEventById,
    addEvent,
    deleteEvent,
    updateEvent,
    getEventsByLocationId,
    getEventsByEventTypeId,
    filterEvents
}
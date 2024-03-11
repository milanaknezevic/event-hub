const Event = require("../models/event");
const Location = require("../models/location");
const EventType = require("../models/eventType")
const EventImage = require("../models/eventImage");
const Comment = require("../models/comment")
const User = require('../models/user')
const Invitation = require('../models/invitation')
const Sequelize = require('sequelize');
const {USER_ROLES, USER_STATUS} = require("../models/enums");
const moment = require('moment');
const addEvent = async (req, res) => {
    try {
        const eventData = req.body;
        const startTime = moment(eventData.startTime, 'DD.MM.YYYY. HH:mm').toDate();
        const endTime = moment(eventData.endTime, 'DD.MM.YYYY. HH:mm').toDate();
        const {eventImagesName, invitations, ...rest} = eventData;
        rest.creator_id = req.user.id;
        rest.startTime = startTime
        rest.endTime = endTime
        const newEvent = await Event.create({...rest,});
        const eventImages = eventImagesName.map(async (imageName) => {
            await EventImage.create({
                event_id: newEvent.id,
                image: imageName
            });
        });
        await Promise.all(eventImages);
        const sentInvitations = invitations.map(async (user) => {
            const existingInvitation = await Invitation.findOne({
                where: {
                    user_id: user.id,
                    event_id: newEvent.id,
                },
            });
            if (existingInvitation) {
                return res.status(409).json({
                    success: false,
                    message: 'Invitation already exists for the specified user and event.'
                });
            }
            const invitationData = {
                user_id: user.id,
                event_id: newEvent.id,
                statusCreator: req.user.role === 0,
                statusGuest: req.user.role === 2
            };
            await Invitation.create(invitationData);
        });
        await Promise.all(sentInvitations);
        res.status(201).json({
            message: 'Event added succesfuly',
            eventType: newEvent
        });
    } catch (error) {
        console.log("error ", error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getEventById = async (req, res) => {
    try {
        let id = req.params.id;
        let event = await Event.findOne({
            where: {id: id},
            include: [
                {model: EventImage, as: 'eventImages'},
                {
                    model: Comment,
                    as: 'eventComments',
                    include: [{
                        model: User,
                        as: 'userComments',
                        attributes: ['name', 'username', 'lastname']
                    }]
                },
                {
                    model: Location,
                }
                , {
                    model: EventType,
                }
            ],
            attributes: {exclude: ['location_id', 'eventType_id']},
        });
        res.status(200).send(event);
    } catch (error) {

        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

const getAllEvents = async (req, res) => {
    try {
        const {page = 1, size = 10, name, locationId, eventTypeId, status} = req.query;
        let statusOption = parseInt(status, 10);
        let events;
        let dateFilter = {};

        switch (statusOption) {
            case 0:
                dateFilter = {endTime: {[Sequelize.Op.lt]: new Date()}};
                break;
            case 1:
                dateFilter = {
                    startTime: {[Sequelize.Op.lte]: new Date()},
                    endTime: {[Sequelize.Op.gt]: new Date()}
                };
                break;
            case 2:
                dateFilter = {startTime: {[Sequelize.Op.gt]: new Date()}};
                break;
            default:
                break;
        }
        let additionalFilters = {
            ...dateFilter,
        };

        if (locationId) {
            additionalFilters.location_id = locationId;
        }

        if (eventTypeId) {
            additionalFilters.event_type_id = eventTypeId;
        }

        if (name) {
            additionalFilters.name = {[Sequelize.Op.iLike]: `%${name}%`};
        }
        events = await Event.findAll({
            where: additionalFilters,
            include: [
                {model: EventImage, as: 'eventImages'},
            ],
            limit: size,
            offset: (page - 1) * size,
        });
        res.status(200).send({events});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getEventsByLocationId = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const size = req.query.size || 10;
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
            limit: size,
            offset: (page - 1) * size,
        });
        return res.status(200).json(events);
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getEventsByEventTypeId = async (req, res) => {
    try {

        const page = req.query.page || 1;
        const size = req.query.size || 10;
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
            limit: size,
            offset: (page - 1) * size,
        });
        return res.status(200).json(events);
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const deleteEvent = async (req, res) => {
    try {
        let id = req.params.id;
        await Event.update({status: 3}, {where: {id: id}});
        res.status(200).send('Event is deleted!');
    } catch (error) {
        console.log("error ", error);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

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
        const page = req.query.page || 1;
        const size = req.query.size || 10;
        const query = {};

        if (name) {
            query.name = {[Sequelize.Op.iLike]: `%${name}%`};
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

        const events = await Event.findAll({
            where: query,
            limit: size,
            offset: (page - 1) * size
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};
const getAllEventsForGuest = async (req, res) => {

    try {
        let guestId = req.params.guestId;
        const {page = 1, size = 10, name, locationId, eventTypeId, status} = req.query;
        let statusOption = parseInt(status, 10);

        let events;
        let dateFilter = {};
        switch (statusOption) {
            case 0:
                dateFilter = {endTime: {[Sequelize.Op.lt]: new Date()}};
                break;
            case 1:
                dateFilter = {
                    startTime: {[Sequelize.Op.lte]: new Date()},
                    endTime: {[Sequelize.Op.gt]: new Date()}
                };
                break;
            case 2:
                dateFilter = {startTime: {[Sequelize.Op.gt]: new Date()}};
                break;
            default:
                break;
        }
        let additionalFilters = {
            ...dateFilter,
        };

        if (locationId) {
            additionalFilters.location_id = locationId;
        }

        if (eventTypeId) {
            additionalFilters.event_type_id = eventTypeId;
        }

        if (name) {
            additionalFilters.name = {[Sequelize.Op.iLike]: `%${name}%`};
        }
        const invitations = await Invitation.findAll({
            where: {
                user_id: guestId,
                statusCreator: true,
                statusGuest: true,
            },
            include: [{
                model: Event, as: 'event',
                where: additionalFilters,
                include: [
                    {model: EventImage, as: 'eventImages'},
                ]
            }],
            limit: size,
            offset: (page - 1) * size,
        });
        events = invitations.map(invitation => invitation.event);
        return res.status(200).json({events});
    } catch (error) {

        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

module.exports = {
    getAllEvents,
    getEventById,
    addEvent,
    deleteEvent,
    updateEvent,
    getEventsByLocationId,
    getEventsByEventTypeId,
    filterEvents,
    getAllEventsForGuest
}
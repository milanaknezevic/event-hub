const Invitation = require("../models/invitation");
const Event = require("../models/event");
const User = require("../models/user");

const createInvitation = async (req, res) => {
    try {
        const invitationData = {
            user_id: req.body.user_id,
            event_id: req.body.event_id,
            statusCreator: req.body.statusCreator ? req.body.statusCreator : false,
            statusGuest: req.body.statusGuest ? req.body.statusGuest : false,
        };
        const newInvitation = await Invitation.create(invitationData);
        res.status(201).json({
            message: 'Invitation created succesfuly',
            eventType: newInvitation
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const acceptInvitationGuest = async (req, res) => {
    try {
        let {userId, eventId} = req.params
        const existingInvitation = await Invitation.findOne({
            where: {
                user_id: userId,
                event_id: eventId,
            }
        });
        if (existingInvitation) {
            existingInvitation.statusGuest = true;
            await existingInvitation.save();
            res.status(200).json({success: true, message: 'Invitation successfully updated.'})
        } else {
            res.status(404).json({success: false, message: 'Invitation not found.'});
        }

    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const acceptInvitationCreator = async (req, res) => {
    try {
        let {userId, eventId} = req.params
        const existingInvitation = await Invitation.findOne({
            where: {
                user_id: userId,
                event_id: eventId,
            }
        });
        if (existingInvitation) {
            existingInvitation.statusCreator = true;
            await existingInvitation.save();
            res.status(200).json({success: true, message: 'Invitation successfully updated.'})
        } else {
            res.status(404).json({success: false, message: 'Invitation not found.'});
        }

    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getAllInvitation = async (req, res) => {
    try {
        let invitations = await Invitation.findAll();
        res.status(200).send({invitations});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getInvitationById = async (req, res) => {
    try {
        let {userId, eventId} = req.params
        const existingInvitation = await Invitation.findOne({
            where: {
                user_id: userId,
                event_id: eventId,
            }
        });

        if (existingInvitation) {
            res.status(200).send(existingInvitation)
        } else {
            res.status(404).json({success: false, message: 'Invitation not found.'});
        }
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}


const getInvitationByEventId = async (req, res) => {
    try {
        let eventId = req.params.eventId
        let event = await Event.findOne({where: {id: eventId}})
        if (event) {
             let invitations = await Invitation.findAll({
                where: {
                    event_id: eventId,
                    statusCreator: false,
                    statusGuest: true,
                },
                include: [User]
            });
            res.status(200).send(invitations)
        } else {
            res.status(404).json({success: false, message: 'Event not found.'});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
module.exports = {
    createInvitation,
    acceptInvitationGuest,
    acceptInvitationCreator,
    getInvitationById,
    getAllInvitation,
    getInvitationByEventId
}
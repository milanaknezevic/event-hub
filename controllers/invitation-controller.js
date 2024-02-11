const Invitation = require("../models/invitation");
const Event = require("../models/event");
const User = require("../models/user");
const {USER_ROLES, USER_STATUS} = require("../models/enums");

const createInvitation = async (req, res) => {
    try {
        let eventId = req.params
        const invitationData = {
            user_id: req.user.id,
            event_id: eventId,
            statusCreator: req.user.role === 0,
            statusGuest: req.user.role === 2
        };
        const newInvitation = await Invitation.create(invitationData);
        res.status(201).json({
            message: 'Invitation created successfully',
            invitation: newInvitation
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const acceptInvitationGuest = async (req, res) => {
    try {
        let eventId = req.params
        const existingInvitation = await Invitation.findOne({
            where: {
                user_id: req.user.id,
                event_id: eventId,
                statusGuest: false,
                statusCreator: true,
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
        let  eventId = req.params
        const existingInvitation = await Invitation.findOne({
            where: {
                user_id: req.user.id,
                event_id: eventId,
                statusCreator:false,
                statusGuest:true
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
            },
            include: [{
                model: User,
                as: 'invitedUser',
            }, {
                model: Event,
                as: 'event',
            }],
        });

        if (existingInvitation) {
            const mappedInvitation = {
                ...existingInvitation.dataValues,
                invitedUser: {
                    ...existingInvitation.invitedUser.dataValues,
                    role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === existingInvitation.invitedUser.dataValues.role),
                    status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === existingInvitation.invitedUser.dataValues.status),
                },
            };
            res.status(200).send(mappedInvitation)
        } else {
            res.status(404).json({success: false, message: 'Invitation not found.'});
        }
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}


const getInvitationsByEventId = async (req, res) => {
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
                include: [{
                    model: User,
                    as: 'invitedUser',
                }],
            });
            const mappedInvitations = invitations.map(invitation => ({
                ...invitation.dataValues,
                invitedUser: {
                    ...invitation.invitedUser.dataValues,
                    role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === invitation.invitedUser.dataValues.role),
                    status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === invitation.invitedUser.dataValues.status),
                },
            }));

            res.status(200).send(mappedInvitations)
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
    getInvitationsByEventId
}
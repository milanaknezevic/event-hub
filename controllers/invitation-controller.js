const Invitation = require("../models/invitation");
const Event = require("../models/event");
const User = require("../models/user");
const {USER_ROLES, USER_STATUS} = require("../models/enums");
const Sequelize = require("sequelize");
const {EventImage} = require("../models");
const Ticket = require("../models/ticket");
const cron = require("node-cron");

const createInvitation = async (req, res) => {
    try {
        let {eventId, userId} = req.params

        const existingInvitation = await Invitation.findOne({
            where: {
                user_id: userId,
                event_id: eventId,
            },
        });

        if (existingInvitation) {
            return res.status(409).json({
                success: false,
                message: 'Invitation already exists for the specified user and event.'
            });
        }

        const invitationData = {
            user_id: userId,
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
        console.log("error ", error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const acceptInvitationGuest = async (req, res) => {
    try {
        let {eventId} = req.params
        // let numericEventId = parseInt(eventId, 10);
        let accept = req.query.accept;
        const existingInvitation = await Invitation.findOne({
            where: {
                user_id: req.user.id,
                event_id: eventId,
                statusGuest: false,
                statusCreator: true,
            }
        });
        if (existingInvitation) {
            switch (accept) {
                case "true":
                    existingInvitation.statusGuest = true;
                    await existingInvitation.save();
                    res.status(200).json({success: true, message: 'Invitation successfully accepted.'})
                    break;
                case "false":
                    await existingInvitation.destroy();
                    res.status(204).json({success: true, message: 'Invitation successfully declined and deleted.'});
                    break;
                default:
                    break;
            }

        } else {
            res.status(404).json({success: false, message: 'Invitation not found.'});
        }

    } catch (error) {
        console.log("error ", error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const acceptInvitationCreator = async (req, res) => {
    try {
        let {eventId, userId} = req.params
        let accept = req.query.accept;
        const existingInvitation = await Invitation.findOne({
            where: {
                user_id: userId,
                event_id: eventId,
                statusCreator: false,
                statusGuest: true
            }
        });
        if (existingInvitation) {
            switch (accept) {
                case "true":
                    existingInvitation.statusCreator = true;
                    await existingInvitation.save();
                    res.status(200).json({success: true, message: 'Invitation successfully updated.'})
                    break;
                case "false":
                    await existingInvitation.destroy();
                    res.status(204).json({success: true, message: 'Invitation successfully declined and deleted.'});
                    break;
                default:
                    break;

            }
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
const getAllUnacceptedInvitationsForOrganizer = async (req, res) => {
    try {
        let organizerId = req.user.id
        const invitations = await Invitation.findAll({
            where: {
                statusCreator: false,
                statusGuest: true,
            },
            include: [{
                model: User,
                as: 'invitedUser',
            }, {
                model: Event,
                as: 'event',
                where: {
                    creator_id: organizerId,
                    startTime: {[Sequelize.Op.gt]: new Date()}
                }
            }],
            attributes: {exclude: ['user_id', 'event_id']},
        });
        res.status(200).send(invitations)

    } catch (error) {

        res.status(500).json({success: false, message: 'Internal server error.'});
    }

}
const getAllUnacceptedInvitationsForClient = async (req, res) => {
    try {
        let clientId = req.user.id
        const {page = 1, size = 10, status} = req.query;
        const startIndex = (page - 1) * size;
        const endIndex = page * size;

        let statusOption = parseInt(status, 10);
        let invitations;

        switch (statusOption) {
            case 0: //received invitations tj statuc guest false, status creator true
                invitations = await Invitation.findAll({
                    where: {
                        statusCreator: true,
                        statusGuest: false,
                        user_id: clientId
                    },
                    include: [{
                        model: Event,
                        as: 'event',
                        include: [
                            {model: EventImage, as: 'eventImages'}
                        ]
                    }],
                });
                break;
            case 1:
                invitations = await Invitation.findAll({
                    where: {
                        statusCreator: false,
                        statusGuest: true,
                        user_id: clientId
                    },
                    include: [{
                        model: Event,
                        as: 'event',
                        include: [
                            {model: EventImage, as: 'eventImages'}
                        ]
                    }],
                });
                break;
            default:
                break;
        }

        const respInvitations = invitations.slice(startIndex, endIndex);
        for (const invitation of respInvitations) {
            if (invitation.dataValues.read === 0) {
                await Invitation.update({read: 1}, {
                    where: {
                        user_id: invitation.dataValues.user_id,
                        event_id: invitation.dataValues.event_id
                    }
                });
            }
        }

        res.status(200).send({invitations: respInvitations, total: invitations.length});

    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }

}


const getAllUnacceptedInvitations = async (req, res) => {
    try {
        const {eventId} = req.params;
        const invitations = await Invitation.findAll({
            where: {
                statusCreator: true,
                statusGuest: false,
                event_id: eventId
            },
            include: [{
                model: User,
                as: 'invitedUser',
            }],
            attributes: {exclude: ['event_id']},
        });
        //ako ej true to su pozivnice koje je organizer vec psolao i moze da ih ukloni
        const users = invitations.map(value => ({
            ...value.dataValues.invitedUser.dataValues,
            invitationStatus: true
        }));
        const allInivitations = await Invitation.findAll({where: {event_id: eventId}});
        const invitedUserIds = allInivitations.map(invitation => invitation.user_id);
        const allUsers = await User.findAll({
            where: {
                id: {
                    [Sequelize.Op.notIn]: invitedUserIds
                }
            }
        });
//ako je false nije nikad ni slao pozivnicu, pa je moze psolati
        const allUsersWithStatus = allUsers.map(user => ({
            ...user.dataValues,
            invitationStatus: false
        }));
        const allUsersCombined = [...users, ...allUsersWithStatus];
        res.status(200).send({clients: allUsersCombined});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getInvitationsByEventId = async (req, res) => {
    try {
        let eventId = req.params.eventId
        const {page = 1, size = 10} = req.query;
        const startIndex = (page - 1) * size;
        const endIndex = page * size;
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
                },
                    {
                        model: Event,
                        as: 'event',
                    }
                ],
            });

            const respInvitations = invitations.slice(startIndex, endIndex);
            for (const invitation of respInvitations) {
                if (invitation.dataValues.read === 0) {
                    await Invitation.update({read: 1}, {
                        where: {
                            event_id: eventId
                        }
                    });
                }
            }


            const mappedInvitations = respInvitations.map(invitation => ({
                ...invitation.dataValues,
                invitedUser: {
                    ...invitation.invitedUser.dataValues,
                    role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === invitation.invitedUser.dataValues.role),
                    status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === invitation.invitedUser.dataValues.status),
                },
            }));

            res.status(200).send({invitations: mappedInvitations, total: invitations.length})
        } else {
            res.status(404).json({success: false, message: 'Invitation not found.'});
        }
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const organizerUnsendInvitation = async (req, res) => {
    try {
        let eventId = req.params.eventId;
        let userId = req.params.userId;
        await Invitation.destroy({where: {event_id: eventId, user_id: userId}});
        res.status(200).send('Invitation is deleted!');
    } catch (error) {
        console.log("error ", error);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

const clientUnsendInvitation = async (req, res) => {
    try {
        const {eventId} = req.params;
        await Invitation.destroy({where: {event_id: eventId, user_id: req.user.id}});
        res.status(200).send('Invitation is deleted!');
    } catch (error) {
        console.log("error ", error);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getClientNotifications = async (req, res) => {
    try {
        const invitations = await Invitation.findAll({
            where: {read: 0, statusCreator: true, statusGuest: false, user_id: req.user.id},

        })
        res.json({invitationNotification: invitations});

    } catch (error) {
        console.log("error neki brate ", error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}



const deleteUnacceptedInvitations =async () => {
    const invitations = await Invitation.findAll({
        where: Sequelize.or(
            { statusCreator: true, statusGuest: false },
            { statusCreator: false, statusGuest: true }
        ),
        include: [{
            model: Event,
            as: 'event',
            where:{ status:1}
        }],
    });
    for(const  invitation of invitations)
    {
        await Invitation.destroy({where: {event_id: invitation.dataValues.event_id, user_id:  invitation.dataValues.user_id}});

    }


}

cron.schedule('0 */1 * * *', async () => {
    await deleteUnacceptedInvitations();
});
module.exports = {
    getClientNotifications,
    clientUnsendInvitation,
    organizerUnsendInvitation,
    createInvitation,
    getAllUnacceptedInvitationsForOrganizer,
    getAllUnacceptedInvitationsForClient,
    acceptInvitationGuest,
    acceptInvitationCreator,
    getInvitationById,
    getAllInvitation,
    getInvitationsByEventId,
    getAllUnacceptedInvitations
}
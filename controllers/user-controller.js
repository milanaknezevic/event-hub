const User = require("../models/user");
const Event = require("../models/event");
const Invitation = require("../models/invitation");
const {Sequelize} = require("sequelize");
const {USER_ROLES, USER_STATUS} = require("../models/enums");

const addUser = async (req, res) => {
    try {
        const userData = {
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber,
            role: req.body.role,
            status: req.body.status,
            avatar: req.body.avatar,
        };
        const newUser = await User.create(userData);
        const mappedUser = {
            ...newUser.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === newUser.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === newUser.dataValues.status),
        };
        res.status(201).json({
            message: 'User added succesfuly',
            user: mappedUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const getAllUsers = async (req, res) => {
    try {
        let users = await User.findAll({})
        const mappedUsers = users.map(user => ({
            ...user.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === user.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === user.dataValues.status),
        }));
        res.status(200).send({mappedUsers});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getUserById = async (req, res) => {
    try {
        let id = req.params.id
        let user = await User.findOne({where: {id: id}})
        const mappedUser = {
            ...user.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === user.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === user.dataValues.status),
        };
        res.status(200).send(mappedUser)
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const updateAllPropertiesUser = async (req, res) => {
    try {
        let id = req.params.id
        let user = await User.update({where: {id: id}})
        res.status(200).send(user)
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const deleteUser = async (req, res) => {
    try {
        let id = req.params.id
        await User.destroy({where: {id: id}})
        res.status(200).send('User is deleted!')
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updatedProperties = req.body;
    try {
        const existingUser = await User.findByPk(userId);

        if (!existingUser) {
            return res.status(404).json({success: false, message: 'User not found.'});
        }
        await existingUser.update(updatedProperties);
        const mappedUser = {
            ...existingUser.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === existingUser.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === existingUser.dataValues.status),
        };


        res.status(200).json({success: true, message: 'User properties updated successfully.', user: mappedUser});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

const getAllEventsByCreatorId = async (req, res) => {
    try {
        let creatorId = req.params.creatorId;
        const creator = await User.findByPk(creatorId);

        if (!creator) {
            return res.status(404).json({error: 'User not found.'});
        }

        const events = await Event.findAll({
            where: {creator_id: creatorId},
        });


        return res.status(200).json({success: true, events: events});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getAllFinishedEvents = async (req, res) => {
    try {
        let creatorId = req.params.creatorId;
        const creator = await User.findByPk(creatorId);

        if (!creator) {
            return res.status(404).json({error: 'User not found.'});
        }
        let statusOption = parseInt(req.query.status, 10);

//0=finished, 1= in progress, 2= upcoming
        let events;
        switch (statusOption) {
            case 0:
                events = await Event.findAll({
                    where: {
                        creator_id: creatorId,
                        endTime: {[Sequelize.Op.lt]: new Date()}
                    },
                });
                break;
            case 1:
                events = await Event.findAll({
                    where: {
                        creator_id: creatorId,
                        startTime: {[Sequelize.Op.lte]: new Date()},
                        endTime: {[Sequelize.Op.gt]: new Date()}
                    },
                });
                break;
            case 2:
                events = await Event.findAll({
                    where: {
                        creator_id: creatorId,
                        startTime: {[Sequelize.Op.gt]: new Date()}
                    },
                });
                break;
            default:
                return res.status(400).json({error: 'Invalid status option.'});

        }

        return res.status(200).json({success: true, events: events});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getAllEventGuests = async (req, res) => {
    try {
        let eventId = req.params.eventId;
        let statusOption = req.query.status === 'true';
        let invitations;
        switch (statusOption) {
            case true:
                invitations = await Invitation.findAll({
                    where: {
                        event_id: eventId,
                        statusCreator: true,
                        statusGuest: true,
                    },
                    include: [User]
                });
                break;
            case false:
                invitations = await Invitation.findAll({
                    where: {
                        event_id: eventId,
                        statusCreator: true,
                        statusGuest: false,
                    },
                    include: [User]
                });
                break;
            default:
                return res.status(400).json({error: 'Invalid status option.'});

        }
        const users = invitations.map(invitation => invitation.User);

        const mappedUsers = users.map(user => ({
            ...user.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === user.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === user.dataValues.status),
        }));

        return res.status(200).json({users: mappedUsers});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({message: 'Internal server error.'});
    }
};

module.exports = {
    getAllUsers,
    addUser,
    updateAllPropertiesUser,
    getAllEventsByCreatorId,
    getAllFinishedEvents,
    updateUser,
    deleteUser,
    getUserById,
    getAllEventGuests
}
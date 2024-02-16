const User = require("../models/user");
const Event = require("../models/event");
const Invitation = require("../models/invitation");
const {Sequelize} = require("sequelize");
const {USER_ROLES, USER_STATUS} = require("../models/enums");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const EventType = require("../models/eventType");
const EventImage = require("../models/eventImage");


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
            mappedUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const getAllUsers = async (req, res) => {
    try {
        let users = await User.findAll({
            attributes: {exclude: ['password']}
        });
        const mappedUsers = users.map(user => ({
            ...user.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === user.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === user.dataValues.status),
        }));
        res.status(200).send(mappedUsers)
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getUserById = async (req, res) => {
    try {
        let id = req.params.id
        let user = await User.findOne({
            where: {id: id},
            attributes: {exclude: ['password']}
        });
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
    if (req.user.id !== userId) {
        return res.status(401).send('Unauthorized request');
    }
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
        delete mappedUser.password

        res.status(200).json({success: true, message: 'User properties updated successfully.', mappedUser});
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
const getAllOrganizerEvents = async (req, res) => {
    try {
        let creatorId = req.params.creatorId;
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
            creator_id: creatorId,
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

        return res.status(200).json({success: true, events: events});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getAllEventGuests = async (req, res) => {
    try {
        let eventId = req.params.eventId;
        let statusOption = req.query.status;
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
const registerUser = async (req, res) => {
    try {
        const {name, lastname, email, username, password, phoneNumber, role, status, avatar} = req.body;

        const verifyEmail = await User.findOne({where: {email}});
        const verifyUsername = await User.findOne({where: {username}});

        if (verifyEmail) {
            return res.status(403).json({message: 'Email already used'});
        } else if (verifyUsername) {
            return res.status(403).json({message: 'Username already used'});
        }

        const hash = await bcrypt.hash(password, 10);
        const userData = {
            name,
            lastname,
            email,
            username,
            password: hash,
            phoneNumber,
            role,
            status,
            avatar,
        };

        const newUser = await User.create(userData);
        const mappedUser = {
            ...newUser.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === newUser.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === newUser.dataValues.status),
        };
        delete mappedUser.password
        res.status(201).json({
            message: 'User added succesfuly',
            mappedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({where: {username: username}});
        if (!user) {
            return res.status(401).json({message: "Authentication Failed"})
        }
        let isPasswordValid = bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Authentication Failed"
            })
        } else {
            let jwtToken = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            )
            return res.status(200).json({
                accessToken: jwtToken,
                userId: user.userId,

            });

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

module.exports = {
    registerUser,
    getAllUsers,
    addUser,
    updateAllPropertiesUser,
    getAllEventsByCreatorId,
    getAllOrganizerEvents,
    updateUser,
    deleteUser,
    getUserById,
    getAllEventGuests,
    login
};
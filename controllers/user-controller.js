const User = require("../models/user");
const Event = require("../models/event");
const Invitation = require("../models/invitation");
const {Sequelize, where} = require("sequelize");
const {USER_ROLES, USER_STATUS} = require("../models/enums");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const EventImage = require("../models/eventImage");
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');


const addUser = async (req, res) => {
    try {
        const {name, lastname, email, username, password, phoneNumber, role, avatar} = req.body;
        const verifyEmail = await User.findOne({where: {email}});
        const verifyUsername = await User.findOne({where: {username}});

        if (verifyEmail) {
            res.status(400).json({
                errors: [
                    {
                        field: 'email',
                        message: 'Email already exists',
                    },
                ],
            });
            return;
        } else if (verifyUsername) {
            res.status(400).json({
                errors: [
                    {
                        field: 'username',
                        message: 'Username already exists',
                    },
                ],
            });
            return;
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
            status: USER_STATUS.ACTIVE,
            avatar,
            read: false
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
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getAllClients = async (req, res) => {
    try {
        let whereClause = {
            role: {
                [Sequelize.Op.eq]: USER_ROLES.CLIENT
            }
        };
        let users = await User.findAll({
            attributes: {exclude: ['password']},
            where: whereClause,
            order: [['id', 'DESC']],
        });
        const mappedUsers = users.map(user => ({
            ...user.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === user.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === user.dataValues.status),
        }));

        res.status(200).send({clients: mappedUsers});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

const getAllUsers = async (req, res) => {
    try {
        const {page = 1, size = 10, search} = req.query;
        const startIndex = (page - 1) * size;
        const endIndex = page * size;

        let whereClause = {
            role: {
                [Sequelize.Op.not]: USER_ROLES.SUPPORT
            }
        };

        if (search) {
            whereClause = {
                ...whereClause,
                [Sequelize.Op.or]: [
                    {username: {[Sequelize.Op.iLike]: `%${search}%`}},
                    {email: {[Sequelize.Op.iLike]: `%${search}%`}},
                    {name: {[Sequelize.Op.iLike]: `%${search}%`}},
                    {lastname: {[Sequelize.Op.iLike]: `%${search}%`}},
                ]
            };
        }

        let users = await User.findAll({
            attributes: {exclude: ['password']},
            where: whereClause,
            order: [['id', 'DESC']],
        });

        const respUsers = users.slice(startIndex, endIndex);
        const mappedUsers = respUsers.map(user => ({
            ...user.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === user.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === user.dataValues.status),
        }));

        res.status(200).send({users: mappedUsers, total: users.length});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

const getLoggedUser = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const tokenWithoutBearer = token.split(' ')[1];
        const decode = jwt.decode(tokenWithoutBearer)
        const id = decode.id
        await getUserById({params: {id: id}}, res);
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
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
        res.status(200).send(user)
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
        const {id} = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        user.status = USER_STATUS.BLOCKED;

        await user.save();
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

        const verifyEmail = await User.findOne({
            where: {
                email: updatedProperties.email,
                id: {
                    [Sequelize.Op.not]: updatedProperties.id
                }
            }
        });
        const verifyUsername = await User.findOne({
            where: {
                username: updatedProperties.username,
                id: {
                    [Sequelize.Op.not]: updatedProperties.id
                }
            }
        });

        if (verifyEmail) {
            res.status(400).json({
                errors: [
                    {
                        field: 'email',
                        message: 'Email already exists',
                    },
                ],
            });
            return;
        } else if (verifyUsername) {
            res.status(400).json({
                errors: [
                    {
                        field: 'username',
                        message: 'Username already exists',
                    },
                ],
            });
            return;
        }
        if ('id' in updatedProperties) {
            delete updatedProperties.id;
        }

        await User.update(updatedProperties, {
            where: {id: existingUser.id}
        });

        const updatedUser = await User.findByPk(existingUser.id);

        const mappedUser = {
            ...updatedUser.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === updatedUser.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === updatedUser.dataValues.status),
        };
        delete mappedUser.password;

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: mappedUser,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


const updateMyProfile = async (req, res) => {

    let updatedProperties = req.body;

    try {
        const existingUser = await User.findByPk(req.user.id);


        if (!existingUser) {
            return res.status(404).json({success: false, message: 'User not found.'});
        }
        if (existingUser.id !== req.user.id) {
            return res.status(403).json({success: false, message: 'Forbidden.'});
        }

        const verifyEmail = await User.findOne({
            where: {
                email: updatedProperties.email,
                id: {
                    [Sequelize.Op.not]: updatedProperties.id
                }
            }
        });
        const verifyUsername = await User.findOne({
            where: {
                username: updatedProperties.username,
                id: {
                    [Sequelize.Op.not]: updatedProperties.id
                }
            }
        });

        if (verifyEmail) {
            res.status(400).json({
                errors: [
                    {
                        field: 'email',
                        message: 'Email already exists',
                    },
                ],
            });
            return;
        } else if (verifyUsername) {
            res.status(400).json({
                errors: [
                    {
                        field: 'username',
                        message: 'Username already exists',
                    },
                ],
            });
            return;
        }
        if ('id' in updatedProperties) {
            delete updatedProperties.id;
        }

        delete updatedProperties.role
        delete updatedProperties.status

        await User.update(updatedProperties, {
            where: {id: existingUser.id}
        });

        const updatedUser = await User.findByPk(existingUser.id);

        const mappedUser = {
            ...updatedUser.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === updatedUser.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === updatedUser.dataValues.status),
        };
        delete mappedUser.password;

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: mappedUser,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

// const getAllEventsByCreatorId = async (req, res) => {
//     try {
//         let creatorId = req.params.creatorId;
//         const creator = await User.findByPk(creatorId);
//
//         if (!creator) {
//             return res.status(404).json({error: 'User not found.'});
//         }
//
//         const events = await Event.findAll({
//             where: {creator_id: creatorId,
//                 status: {
//                     [Sequelize.Op.ne]: 3
//                 }},
//         });
//
//
//         return res.status(200).json({success: true, events: events});
//     } catch (error) {
//         res.status(500).json({success: false, message: 'Internal server error.'});
//     }
// };
const getAllOrganizerEvents = async (req, res) => {
    try {
        let creatorId = req.user.id;
        const {page = 1, size = 10, search, locationId, eventTypeId, status} = req.query;
        const startIndex = (page - 1) * size;
        const endIndex = page * size;

        let statusOption = parseInt(status, 10);

        let events;
        let dateFilter = {};

        switch (statusOption) {
            case 0: //zavrseni
                dateFilter = {endTime: {[Sequelize.Op.lt]: new Date()}};
                break;
            case 1: //u toku
                dateFilter = {
                    startTime: {[Sequelize.Op.lte]: new Date()},
                    endTime: {[Sequelize.Op.gt]: new Date()}
                };
                break;
            case 2: //upcoming
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
            additionalFilters.location_id = parseInt(locationId);
        }

        if (eventTypeId) {
            additionalFilters.eventType_id = parseInt(eventTypeId);
        }

        if (search) {
            additionalFilters.name = {[Sequelize.Op.iLike]: `%${search}%`};
        }

        events = await Event.findAll({
            where: {
                [Sequelize.Op.and]: [
                    additionalFilters,
                    {status: {[Sequelize.Op.ne]: 3}}
                ]
            },
            include: [
                {model: EventImage, as: 'eventImages'},
            ],
        });

        let respEvents = events.slice(startIndex, endIndex);

        for (let event of respEvents) {
            event.dataValues.invitations = await Invitation.findAll({
                where: {read: 0, statusCreator: false, statusGuest: true, event_id: event.dataValues.id},
            });
        }

        res.status(200).send({events: respEvents, total: events.length});

    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getAllEventGuests = async (req, res) => {
    try {
        let eventId = req.params.eventId;
        let statusOption = req.query.status;
        const {page = 1, size = 10} = req.query;
        const startIndex = (page - 1) * size;
        const endIndex = page * size;
        let invitations;
        switch (statusOption) {
            case "true":
                invitations = await Invitation.findAll({
                    where: {
                        event_id: eventId,
                        statusCreator: true,
                        statusGuest: true,
                    },
                    include: [{model: User, as: 'invitedUser'}]
                });
                break;
            case "false":
                invitations = await Invitation.findAll({
                    where: {
                        event_id: eventId,
                        statusCreator: true,
                        statusGuest: false,
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
                break;
            default:
                return res.status(400).json({error: 'Invalid status option.'});
        }
        // const users = invitations.map(invitation => invitation.invitedUser); // Update mapping with the alias
        //
        // const mappedUsers = users.map(user => ({
        //     ...user.dataValues,
        //     role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === user.dataValues.role),
        //     status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === user.dataValues.status),
        // }));

        const respInvitations = invitations.slice(startIndex, endIndex);

        const mappedInvitations = respInvitations.map(invitation => ({
            ...invitation.dataValues,
            invitedUser: {
                ...invitation.invitedUser.dataValues,
                role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === invitation.invitedUser.dataValues.role),
                status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === invitation.invitedUser.dataValues.status),
            },
        }));

        return res.status(200).json({invitations: mappedInvitations, total: invitations.length});
    } catch (error) {
        res.status(500).json({message: 'Internal server error.'});
    }
};

const registerUser = async (req, res) => {
    try {

        const {name, lastname, email, username, password, phoneNumber, role, avatar} = req.body;

        const verifyEmail = await User.findOne({where: {email}});
        const verifyUsername = await User.findOne({where: {username}});

        if (verifyEmail) {
            res.status(400).json({
                errors: [
                    {
                        field: 'email',
                        message: 'Email already exists',
                    },
                ],
            });
            return;
        } else if (verifyUsername) {
            res.status(400).json({
                errors: [
                    {
                        field: 'username',
                        message: 'Username already exists',
                    },
                ],
            });
            return;
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
            status: USER_STATUS.REQUESTED,
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
            message: 'User registred succesfuly',
            mappedUser
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({
            where: {
                username: username,
                status: USER_STATUS.ACTIVE
            }
        });
        if (!user) {
            return res.status(401).json({message: "Authentication Failed"})
        }
        let isPasswordValid = await bcrypt.compare(password, user.password)
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
                    expiresIn: "3600s",
                }
            )
            return res.status(200).json({
                accessToken: jwtToken,
                userId: user.userId,

            });

        }
    } catch (error) {

        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getUserRoles = async (req, res) => {
    try {
        const userRolesArray = Object.keys(USER_ROLES)
            .map(key => ({id: USER_ROLES[key], name: key}))
            .filter(role => role.id !== 1);
        res.json(userRolesArray);
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getUserRolesForAdmin = async (req, res) => {
    try {
        const userRolesArray = Object.keys(USER_ROLES).map(key => ({id: USER_ROLES[key], name: key}));
        res.json(userRolesArray);
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const getUserStatus = async (req, res) => {
    try {
        const userStatusArray = Object.keys(USER_STATUS).map(key => ({id: USER_STATUS[key], name: key}));
        res.json(userStatusArray);
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const uploadAvatar = async (req, res) => {
    try {
        const {uid} = req.query;
        const extension = ".png"
        const dir = process.env.AVATAR_DIR;
        const imagePath = path.join(dir, uid + extension);
        fs.writeFileSync(imagePath, req.file.buffer);
        res.status(200).json({success: true});
    } catch (error) {

        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};
const notInvitedUsers = async (req, res) => {
    try {
        const eventId = req.params.id
        const {page = 1, size = 10} = req.query;
        const startIndex = (page - 1) * size;
        const endIndex = page * size;

        const invitations = await Invitation.findAll({
            where: {event_id: eventId}
        });

        const invitedUserIds = invitations.map(invitation => invitation.user_id);

        const users = await User.findAll({
            where: {
                id: {[Sequelize.Op.notIn]: invitedUserIds},
                role: USER_ROLES.CLIENT
            }
        });
        const respUsers = users.slice(startIndex, endIndex);


        const mappedUsers = respUsers.map(user => ({
            ...user.dataValues,
            role: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === user.dataValues.role),
            status: Object.keys(USER_STATUS).find(key => USER_STATUS[key] === user.dataValues.status),
        }));

        res.status(200).send({users: mappedUsers, total: users.length});

    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

const changePassword = async (req, res) => {
    try {
        const id = req.user.id;
        const {old_password, new_password, confirm_password} = req.body
        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            return res.status(404).json({success: false, message: 'User not found.'});
        }
        if (existingUser.id !== id) {
            return res.status(403).json({success: false, message: 'Forbidden.'});
        }

        let isPasswordValid = await bcrypt.compare(old_password, existingUser.password)
        if (!isPasswordValid) {
            return res.status(403).json({
                errors: [
                    {
                        field: 'old_password',
                        message: 'Wrong old password',
                    },
                ],
            });

        }
        const hash = await bcrypt.hash(confirm_password, 10);
        const updatedProperties = {
            password: hash
        }
        await User.update(updatedProperties, {
            where: {id: id}
        });
        res.status(200).json({success: true});

    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

const changeEventStatus =async () => {
    const events = await Event.findAll()
    const currentTime = new Date();
    for(let event of events)
    {
        if(event.dataValues.status === 0)
        {
            if (event.dataValues.startTime && new Date(event.dataValues.startTime) >= currentTime) {
                await Event.update({status: 1}, {where: {id: event.dataValues.id}});
            }
        }
        else if(event.dataValues.status === 1)
        {
            if (event.dataValues.endTime && new Date(event.dataValues.endTime) >= currentTime) {
                await Event.update({status: 2}, {where: {id: event.dataValues.id}});
            }
        }

    }
}

cron.schedule('0 */1 * * *', async () => {
    await changeEventStatus();
});

module.exports = {
    changePassword,
    notInvitedUsers,
    uploadAvatar,
    registerUser,
    getAllUsers,
    addUser,
    updateAllPropertiesUser,
    // getAllEventsByCreatorId,
    getAllOrganizerEvents,
    updateUser,
    getUserById,
    getAllEventGuests,
    login,
    getUserRoles,
    updateMyProfile,
    getUserRolesForAdmin,
    getLoggedUser,
    getUserStatus,
    deleteUser, getAllClients
};
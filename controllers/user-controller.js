const User = require("../models/user");
const Location = require("../models/location");
const Event = require("../models/event");
const EventImage = require("../models/eventImage");
const {Sequelize} = require("sequelize");

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
        res.status(201).json({
            message: 'User added succesfuly',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const getAllUsers = async (req, res) => {
    try {
        let users = await User.findAll({})
        res.status(200).send({users});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}
const getUserById = async (req, res) => {
    try {
        let id = req.params.id
        let user = await User.findOne({where: {id: id}})
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

        res.status(200).json({success: true, message: 'User properties updated successfully.', user: existingUser});
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

module.exports = {
    getAllUsers,
    addUser,
    updateAllPropertiesUser,
    getAllEventsByCreatorId,
    getAllFinishedEvents,
    updateUser,
    deleteUser,
    getUserById,
}
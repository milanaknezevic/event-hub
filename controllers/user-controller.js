const db = require("../models/user");
const sequelize = require("../util/database");
const Sequelize = require("sequelize");

const User = db;

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
            message: 'Korisnik uspešno dodat',
            user: newUser
        });
    } catch (error) {
        console.error('Greška prilikom dodavanja korisnika:', error);
        res.status(500).json({
            message: 'Došlo je do greške prilikom dodavanja korisnika.'
        });
    }
}

const getAllUsers = async (req, res) => {
    let users = await User.findAll({})
    res.status(200).send({users});
}
const getOneUser = async (req, res) => {
    let id = req.params.id
    let user = await User.findOne({where: {id: id}})
    res.status(200).send(user)
}

const updateUser = async (req, res) => {
    let id = req.params.id
    let user = await User.update({where: {id: id}})
    res.status(200).send(user)
}

const deleteUser = async (req, res) => {
    let id = req.params.id
    await User.destroy({where: {id: id}})
    res.status(200).send('Product is deleted!')
}

module.exports = {
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser
}
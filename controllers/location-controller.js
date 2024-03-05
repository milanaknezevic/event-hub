const Location = require("../models/location");

const addLocation = async (req, res) => {
    try {
        const locationData = {
            address: req.body.address,
        };
        const newLocation = await Location.create(locationData);
        res.status(201).json({
            message: 'Location added succesfuly',
            location: newLocation
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const getAllLocations = async (req, res) => {
    try {
        let locations = await Location.findAll({});
       res.status(200).send( locations );
    } catch (error) {
       res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


module.exports = {
    addLocation,
    getAllLocations
}
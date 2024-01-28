const EventImage = require("../models/eventImage");

const addEventImage = async (req, res) => {
    try {
        const eventImageData = {
            image: req.body.image,
            event_id:req.body.event_id
        };
        const newEventImage = await EventImage.create(eventImageData);
        res.status(201).json({
            message: 'Event Image added succesfuly',
            eventType: newEventImage
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
}

const getAllEventImages = async (req, res) => {
    try {
        let eventImages = await EventImage.findAll({});
        res.status(200).send({eventImages});
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};


module.exports = {
    addEventImage,
    getAllEventImages
}
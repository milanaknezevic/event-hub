const EventImage = require("../models/eventImage");
const path = require("path");
const fs = require("fs");

const addEventImage = async (req, res) => {
    try {
        const eventImageData = {
            image: req.body.image,
            event_id: req.body.event_id
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


const uploadImages = async (req, res) => {
    try {
        const uids = req.body.uids;
        const images = req.files;
        const extension=".png"
        const dir = process.env.EVENT_IMG_DIR;
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const uid = uids[i];
            const imagePath = path.join(dir, uid + extension);
            fs.writeFileSync(imagePath, image.buffer);
        }

        res.status(200).json({ success: true });
        /*
          const { uid } = req.query;
        const imagePath = path.join(dir, uid+extension);
        fs.writeFileSync(imagePath, req.file.buffer);
        res.status(200).json({success: true});
        * */

    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error.'});
    }
};

module.exports = {
    addEventImage,
    getAllEventImages,
    uploadImages
}
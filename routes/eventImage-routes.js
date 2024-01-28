const eventImageController = require('../controllers/eventImage-controller');
const router = require('express').Router();

router.get('/', eventImageController.getAllEventImages);
router.post('/', eventImageController.addEventImage);

module.exports = router;

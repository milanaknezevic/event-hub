const eventController = require('../controllers/event-controller');
const router = require('express').Router();

router.get('/', eventController.getAllEvent);
router.post('/', eventController.addEvent);

module.exports = router;

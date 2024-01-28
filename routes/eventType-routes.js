const eventTypeController = require('../controllers/eventType-controller');
const router = require('express').Router();

router.get('/', eventTypeController.getAllEventTypes);
router.post('/', eventTypeController.addEventType);

module.exports = router;

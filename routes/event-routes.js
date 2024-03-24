const eventController = require('../controllers/event-controller');
const {verifyUserToken, IsOrganizerOrClient, IsClient, IsOrganizer} = require("../middleware/auth");
const router = require('express').Router();

router.get('/', verifyUserToken, IsClient, eventController.getAllEvents);//http://localhost:3001/api/events?page=2&size=2
router.get('/user', verifyUserToken, IsClient, eventController.getAllEventsForGuest);

router.post('/', verifyUserToken, IsOrganizer, eventController.addEvent);
router.patch('/:id', verifyUserToken, IsOrganizer, eventController.updateEvent)
router.delete('/:id', verifyUserToken, IsOrganizer, eventController.deleteEvent)

router.get('/:id', verifyUserToken, IsOrganizerOrClient, eventController.getEventById);


module.exports = router;

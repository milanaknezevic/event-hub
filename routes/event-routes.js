const eventController = require('../controllers/event-controller');
const {verifyUserToken, IsClient, IsOrganizer} = require("../middleware/auth");
const router = require('express').Router();

router.get('/', verifyUserToken, IsClient, eventController.getAllEvents);//http://localhost:3001/api/events?page=2&size=2
router.get('/user/:guestId', verifyUserToken, IsClient, eventController.getAllEventsForGuest);

router.post('/', verifyUserToken, IsOrganizer, eventController.addEvent);
router.patch('/:id', verifyUserToken, IsOrganizer, eventController.updateEvent)
router.delete('/:id', verifyUserToken, IsOrganizer, eventController.deleteEvent)

//ovo ce se zmajeniti prvim pa nece trebati
router.get('/filter', verifyUserToken, IsClient, eventController.filterEvents);//api/events/filter?name=Mila&startDate=2020-10-10&endDate=2020-10-10
//filter event treba prepraviti tako da i organizator ima mogucnost filtriranja svojih dogadjaja, a i klijent svih svih dogadjaja
router.get('/:id', verifyUserToken, IsClient, IsOrganizer, eventController.getEventById);
router.get('/location/:locationId', verifyUserToken, IsClient, eventController.getEventsByLocationId);
// getEventsByLocationId i ovo treba organizator moci
router.get('/eventType/:eventTypeId', verifyUserToken, IsClient, eventController.getEventsByEventTypeId)
// getEventsByLocationId i ovo treba organizator moci

module.exports = router;

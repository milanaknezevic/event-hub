const eventController = require('../controllers/event-controller');
const router = require('express').Router();

router.get('/', eventController.getAllEvents);
//router.get('/:id/guests', eventController.getAllEventGuests);
router.get('/filter', eventController.filterEvents);//http://localhost:3001/api/events/filter?name=Mila&startDate=2020-10-10&endDate=2020-10-10
router.get('/:id', eventController.getEventById);
router.get('/location/:locationId', eventController.getEventsByLocationId);
router.get('/eventType/:eventTypeId',eventController.getEventsByEventTypeId)
router.post('/', eventController.addEvent);
router.patch('/:id',eventController.updateEvent)
router.delete('/:id', eventController.deleteEvent)

module.exports = router;
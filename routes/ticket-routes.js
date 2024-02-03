const ticketController = require('../controllers/ticket-controller');
const router = require('express').Router();

router.get('/', ticketController.getAllTickets);
router.post('/', ticketController.createTicket)
router.get('/:id', ticketController.getTicketsByAdminId);//api/tickets/id admina?replied=false
router.get('user/:id', ticketController.getTicketsByUserId);//api/tickets/user/id usera?replied=false
router.put('/support/:supportId/:ticketId', ticketController.assignToTicket)
router.put('/reply/:supportId/:ticketId', ticketController.replyToTicket)

module.exports = router;

const ticketController = require('../controllers/ticket-controller');
const {verifyUserToken, IsSupport, IsClient, IsOrganizer} = require("../middleware/auth");
const router = require('express').Router();

//tiketi koje je admin assign na sebe
router.get('/:id', verifyUserToken, IsSupport, ticketController.getTicketsByAdminId);//api/tickets/id admina?replied=false
router.post('/', verifyUserToken, IsClient, IsOrganizer, ticketController.createTicket)
router.get('user/:id', verifyUserToken, IsClient, ticketController.getTicketsByUserId);//api/tickets/user/id usera?replied=0
// admin vidi sve otvorene tikete
router.get('/', verifyUserToken, IsSupport, ticketController.getAllTickets);
router.put('/support/:supportId/:ticketId', verifyUserToken, IsSupport, ticketController.assignToTicket)
router.put('/reply/:supportId/:ticketId', verifyUserToken, IsSupport, ticketController.replyToTicket)


module.exports = router;

const ticketController = require('../controllers/ticket-controller');
const {verifyUserToken, IsSupport, IsClient, IsOrganizer, IsOrganizerOrClient} = require("../middleware/auth");
const userController = require("../controllers/user-controller");
const router = require('express').Router();

//tiketi koje je admin assign na sebe
// router.get('/:id', verifyUserToken, IsSupport, ticketController.getTicketsByAdminId);//api/tickets/id admina?replied=false
router.get('/:id', verifyUserToken, IsSupport, ticketController.getTicketById)
router.post('/', verifyUserToken, IsOrganizerOrClient, ticketController.createTicket)
router.get('user/:id', verifyUserToken, IsClient, ticketController.getTicketsByUserId);//api/tickets/user/id usera?replied=0
// admin vidi sve otvorene tikete
router.get('/', verifyUserToken, IsSupport, ticketController.getAllTickets);
router.put('/support/:ticketId', verifyUserToken, IsSupport, ticketController.assignToTicket)
router.put('/reply/:ticketId', verifyUserToken, IsSupport, ticketController.replyToTicket)

router.get('/ticket/status', verifyUserToken, IsSupport, ticketController.getTicketStatus)
router.get('/ticket/priority', verifyUserToken, IsSupport, ticketController.getTicketPriority)

module.exports = router;

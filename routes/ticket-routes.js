const ticketController = require('../controllers/ticket-controller');
const {verifyUserToken, IsSupport, IsClient, IsOrganizer, IsOrganizerOrClient} = require("../middleware/auth");
const router = require('express').Router();
const validation = require('../middleware/validationMiddleware')
const validationSchema = require('../validation/validation')


//tiketi koje je admin assign na sebe
// router.get('/:id', verifyUserToken, IsSupport, ticketController.getTicketsByAdminId);//api/tickets/id admina?replied=false
router.get('/:id', verifyUserToken, IsSupport, ticketController.getTicketById)
router.post('/',validation(validationSchema.createTicketSchema), verifyUserToken, IsOrganizerOrClient, ticketController.createTicket)
router.get('/my/tickets', verifyUserToken, IsOrganizerOrClient, ticketController.getTicketsByUserId);//api/tickets/user/id usera?replied=0
// admin vidi sve otvorene tikete
router.get('/', verifyUserToken, IsSupport, ticketController.getAllTickets);
router.put('/support/:ticketId', verifyUserToken, IsSupport, ticketController.assignToTicket)
router.put('/reply/:ticketId',validation(validationSchema.replyToTicketSchema), verifyUserToken, IsSupport, ticketController.replyToTicket)

router.get('/ticket/status', verifyUserToken, ticketController.getTicketStatus)
router.get('/ticket/priority', verifyUserToken, ticketController.getTicketPriority)

router.get('/support/notifications', verifyUserToken,IsSupport, ticketController.getTicketsNotification)
router.get('/organizer/notifications', verifyUserToken,IsOrganizerOrClient, ticketController.getOrganizerTicketsNotification)
router.put('/update/notifications/:id', verifyUserToken,IsOrganizerOrClient, ticketController.updateClosedTicketNotification)

module.exports = router;

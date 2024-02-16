const invitationController = require('../controllers/invitation-controller')
const {verifyUserToken, IsClient, IsOrganizer, IsOrganizerOrClient} = require("../middleware/auth");
const router = require('express').Router()

router.post('/:eventId', verifyUserToken, IsOrganizerOrClient, invitationController.createInvitation) //pozivam korisnika a i korisnik se prijavljuje
router.get('/event/:eventId', verifyUserToken, IsOrganizer, invitationController.getInvitationsByEventId)//prikazuje yahtjeve ya prisustvo
router.put('/guest/:eventId',verifyUserToken,IsClient, invitationController.acceptInvitationGuest)
router.put('/creator/:eventId',verifyUserToken,IsOrganizer, invitationController.acceptInvitationCreator)
router.get('/:userId/:eventId',verifyUserToken,IsOrganizerOrClient, invitationController.getInvitationById)
//organizator treba da vidi sve pozive koje je primio za neki dogadjaj, klijent treba da vidi sve pozivnice koje je primio i poslao.


//nepotrebna ruta
router.get('/', invitationController.getAllInvitation)

module.exports = router
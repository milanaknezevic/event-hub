const invitationController = require('../controllers/invitation-controller')
const {verifyUserToken, IsClient, IsOrganizer, IsOrganizerOrClient} = require("../middleware/auth");
const router = require('express').Router()

router.post('/:eventId/:userId', verifyUserToken, IsOrganizerOrClient, invitationController.createInvitation) //pozivam korisnika a i korisnik se prijavljuje
router.get('/event/:eventId', verifyUserToken, IsOrganizer, invitationController.getInvitationsByEventId)//prikazuje yahtjeve ya prisustvo




router.put('/guest/:eventId',verifyUserToken,IsClient, invitationController.acceptInvitationGuest)//korisnik moze prihvatiti i odbiti pozivnicu
router.delete('/:eventId', verifyUserToken, IsClient, invitationController.clientUnsendInvitation)




router.put('/creator/accept/:eventId/:userId',verifyUserToken,IsOrganizer, invitationController.acceptInvitationCreator)//organizator moze prihvatiti i odbiti pozivnicu
router.get('/:userId/:eventId',verifyUserToken,IsOrganizerOrClient, invitationController.getInvitationById)
//organizator treba da vidi sve pozive koje je primio za neki dogadjaj, klijent treba da vidi sve pozivnice koje je primio i poslao.
router.get('/unaccepeted',verifyUserToken,IsOrganizer, invitationController.getAllUnacceptedInvitationsForOrganizer)
router.delete('/:eventId/:userId', verifyUserToken, IsOrganizer, invitationController.organizerUnsendInvitation)


router.get('/',verifyUserToken,IsClient, invitationController.getAllUnacceptedInvitationsForClient)

router.get('/organizer/active/:eventId',verifyUserToken,IsOrganizer, invitationController.getAllUnacceptedInvitations)

router.get('/client/invitations/notifications', verifyUserToken,IsClient, invitationController.getClientNotifications)

// //nepotrebna ruta
// router.get('/', invitationController.getAllInvitation)

module.exports = router
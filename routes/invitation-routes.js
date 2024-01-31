const invitationController = require('../controllers/invitation-controller')
const router = require('express').Router()

router.get('/', invitationController.getAllInvitation)
router.get('/event/:eventId', invitationController.getInvitationByEventId)//prikazuje yahtjeve ya prisustvo
router.post('/', invitationController.createInvitation) //pozivam korisnika a i korisnik se prijavljuje
router.put('/guest/:userId/:eventId', invitationController.acceptInvitationGuest)
router.put('/creator/:userId/:eventId', invitationController.acceptInvitationCreator)
router.get('/:userId/:eventId', invitationController.getInvitationById)

module.exports = router
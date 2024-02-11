const userController = require('../controllers/user-controller')
const {verifyUserToken, IsSupport, IsOrganizer,} = require("../middleware/auth");
const router = require('express').Router()


router.post('/', userController.registerUser)
router.post('/login', userController.login);

//ADMIN
router.get('/', verifyUserToken, IsSupport, userController.getAllUsers) //admin(support) moze pregledati sve korisnike
router.delete('/:id', verifyUserToken, IsSupport, userController.deleteUser)


router.get('/guests/:eventId', verifyUserToken, IsOrganizer, userController.getAllEventGuests);//api/users/guests/6?status=false
router.get('/:creatorId/events', verifyUserToken, IsOrganizer, userController.getAllOrganizerEvents)//api/users/2/events?status=1
router.patch('/:id', verifyUserToken, userController.updateUser)
router.get('/:id', verifyUserToken, userController.getUserById)


//nepotrebna metoda
router.get('/events/:creatorId', userController.getAllEventsByCreatorId)
router.put('/:id', userController.updateAllPropertiesUser)


module.exports = router
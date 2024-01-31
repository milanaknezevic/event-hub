const userController = require('../controllers/user-controller')
const router = require('express').Router()

router.get('/', userController.getAllUsers)
router.get('/guests/:eventId', userController.getAllEventGuests);//api/users/guests/6?status=false
router.get('/:creatorId/finishedEvents', userController.getAllFinishedEvents)//http://localhost:3001/api/users/2/finishedEvents?status=1
router.get('/events/:creatorId', userController.getAllEventsByCreatorId)
router.post('/', userController.addUser)
router.put('/:id', userController.updateAllPropertiesUser)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)
router.get('/:id', userController.getUserById)

module.exports = router
const userController = require('../controllers/user-controller')
const router = require('express').Router()

router.get('/', userController.getAllUsers)
router.get('/:creatorId/finishedEvents', userController.getAllFinishedEvents)
router.get('/events/:creatorId', userController.getAllEventsByCreatorId)
router.post('/', userController.addUser)
router.put('/:id', userController.updateAllPropertiesUser)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)
router.get('/:id', userController.getUserById)

module.exports = router
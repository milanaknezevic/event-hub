const userController = require('../controllers/user-controller')

const router = require('express').Router()

router.get('/', userController.getAllUsers)
router.post('/', userController.addUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)
router.get('/:id', userController.getOneUser)

module.exports = router
const userController = require('../controllers/user-controller')
const {verifyUserToken, IsSupport, IsOrganizer, IsOrganizerOrClient,} = require("../middleware/auth");
const router = require('express').Router()
const validation = require('../middleware/validationMiddleware')
const userSchema = require('../validation/userValidation')
const multer = require('multer');
const ticketController = require("../controllers/ticket-controller");
const upload = multer();

router.post('/', validation(userSchema.registrationSchema), userController.registerUser);
router.post('/add_user', verifyUserToken,IsSupport, validation(userSchema.registrationSchema), userController.addUser);
router.post('/login',validation(userSchema.loginSchema), userController.login);
router.post('/upload_avatar',upload.single('file'), userController.uploadAvatar);
router.get('/', verifyUserToken, IsSupport, userController.getAllUsers) //admin(support) moze pregledati sve korisnike
router.patch('/delete/:id', verifyUserToken, IsSupport, userController.deleteUser)
router.get('/user/roles', userController.getUserRoles)
router.get('/adminRoles',verifyUserToken,IsSupport, userController.getUserRolesForAdmin)
router.get('/userStatus',verifyUserToken,IsSupport, userController.getUserStatus)
router.get('/guests/:eventId', verifyUserToken, IsOrganizer, userController.getAllEventGuests);//api/users/guests/6?status=false
router.get('/organizer_events', verifyUserToken, IsOrganizer, userController.getAllOrganizerEvents)//api/users/2/events?status=1
router.patch('/:id',validation(userSchema.editUserSchema), verifyUserToken,IsSupport, userController.updateUser)
router.patch('/update/profile', validation(userSchema.updateUserSchema), verifyUserToken,IsOrganizerOrClient, userController.updateMyProfile)
router.get('/:id', verifyUserToken, userController.getUserById)
router.get('/user/logged',verifyUserToken, userController.getLoggedUser)

router.get('/organizer/clients', verifyUserToken, IsOrganizer, userController.getAllClients)//organizer vidi clients

router.get('/organizer/not_invited/:id',verifyUserToken, IsOrganizer, userController.notInvitedUsers)


router.put('/change_password',validation(userSchema.changePasswordSchema), verifyUserToken, userController.changePassword)


module.exports = router
const commentController = require('../controllers/comment-controller');
const {verifyUserToken, IsOrganizerOrClient, IsOrganizer} = require("../middleware/auth");
const router = require('express').Router();
const validation = require('../middleware/validationMiddleware')
const validationSchema = require('../validation/validation')


router.post('/',validation(validationSchema.leaveCommentSchema), verifyUserToken, IsOrganizerOrClient, commentController.addComment);
router.patch('/reply/:id',validation(validationSchema.commentSchema), verifyUserToken, IsOrganizer, commentController.replyComment);

//nepotreban endpoint
router.get('/', commentController.getAllComments);

module.exports = router;

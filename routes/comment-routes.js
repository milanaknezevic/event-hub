const commentController = require('../controllers/comment-controller');
const {verifyUserToken, IsOrganizerOrClient, IsOrganizer} = require("../middleware/auth");
const router = require('express').Router();

router.post('/', verifyUserToken, IsOrganizerOrClient, commentController.addComment);
router.patch('/reply/:id', verifyUserToken, IsOrganizer, commentController.replyComment);

//nepotreban endpoint
router.get('/', commentController.getAllComments);

module.exports = router;

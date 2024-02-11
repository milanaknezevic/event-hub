const commentController = require('../controllers/comment-controller');
const {verifyUserToken, IsClient, IsOrganizer} = require("../middleware/auth");
const router = require('express').Router();

router.post('/',verifyUserToken,IsClient,IsOrganizer, commentController.addComment);

//nepotreban endpoint
router.get('/', commentController.getAllComments);

module.exports = router;

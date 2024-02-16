const commentController = require('../controllers/comment-controller');
const {verifyUserToken, IsClient, IsOrganizer, IsOrganizerOrClient} = require("../middleware/auth");
const router = require('express').Router();

router.post('/',verifyUserToken,IsOrganizerOrClient, commentController.addComment);

//nepotreban endpoint
router.get('/', commentController.getAllComments);

module.exports = router;

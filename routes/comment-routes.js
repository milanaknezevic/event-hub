const commentController = require('../controllers/comment-controller');
const router = require('express').Router();

router.post('/', commentController.addComment);
router.get('/', commentController.getAllComments);

module.exports = router;

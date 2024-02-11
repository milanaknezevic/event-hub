const eventImageController = require('../controllers/eventImage-controller');
const {verifyUserToken, IsOrganizer} = require("../middleware/auth");
const router = require('express').Router();

router.post('/',verifyUserToken,IsOrganizer, eventImageController.addEventImage);
//nepotreban endpoint
router.get('/', eventImageController.getAllEventImages);
module.exports = router;

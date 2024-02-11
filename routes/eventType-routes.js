const eventTypeController = require('../controllers/eventType-controller');
const {verifyUserToken, IsSupport} = require("../middleware/auth");
const router = require('express').Router();

router.get('/',verifyUserToken, eventTypeController.getAllEventTypes);
//
router.post('/',verifyUserToken,IsSupport, eventTypeController.addEventType);

module.exports = router;

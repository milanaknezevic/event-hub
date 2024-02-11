const locationController = require('../controllers/location-controller');
const {verifyUserToken, IsSupport} = require("../middleware/auth");
const router = require('express').Router();

router.get('/',verifyUserToken, locationController.getAllLocations);
router.post('/',verifyUserToken,IsSupport, locationController.addLocation);

module.exports = router;

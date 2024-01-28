const locationController = require('../controllers/location-controller');
const router = require('express').Router();

router.get('/', locationController.getAllLocations);
router.post('/', locationController.addLocation);

module.exports = router;

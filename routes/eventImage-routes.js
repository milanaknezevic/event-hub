const eventImageController = require('../controllers/eventImage-controller');
const {verifyUserToken, IsOrganizer} = require("../middleware/auth");
const router = require('express').Router();
const multer = require('multer');
const upload = multer();


router.post('/upload_images', upload.array('images'), eventImageController.uploadImages);



router.post('/',verifyUserToken,IsOrganizer, eventImageController.addEventImage);


//nepotreban endpoint
router.get('/', eventImageController.getAllEventImages);
module.exports = router;

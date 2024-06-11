// routes/trackingRoutes.js
const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const multer = require('multer');

const upload = multer({ dest: 'public/' });



router.get('/users/:userId/measurements/last', trackingController.getLastMeasurement);
router.get('/users/:userId/steps/last', trackingController.getLastStepTracking);
router.post('/tracking', upload.array('photos', 4), trackingController.addMeasurement);

module.exports = router;

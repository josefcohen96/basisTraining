const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const multer = require('multer');

const upload = multer({ dest: 'public/' });

router.get('/users/:userId/measurements/last', trackingController.getLastMeasurement);
router.get('/users/:userId/steps/last', trackingController.getLastStepTracking);
router.post('/tracking', upload.array('photos', 4), trackingController.addMeasurement);

router.put('/steps/:taskId', trackingController.updateSteps);
router.get('/steps/:taskId', trackingController.getStepData);

router.get('/tasks/:userId', trackingController.getTasksForUser);
router.put('/tasks/:taskId', trackingController.updateTaskStatus);
router.get('/tracking/:userId', trackingController.getTrackingMetricsForUser);
router.get('/latest-measurement/:userId', trackingController.getLatestMeasurement);
router.post('/food-entry', trackingController.addFoodEntry);

module.exports = router;

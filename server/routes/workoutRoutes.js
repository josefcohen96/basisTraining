const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

router.get('/workouts/:userId', workoutController.getWorkouts);

module.exports = router;

const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

router.post('/users/:userId/workouts', workoutController.createWorkout);
router.get('/workouts/:userId', workoutController.getWorkouts);

module.exports = router;

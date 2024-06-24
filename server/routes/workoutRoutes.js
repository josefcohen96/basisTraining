const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

router.post('/workouts/save', workoutController.saveWorkoutData);
router.get('/workouts/:workoutId/exercises', workoutController.getWorkoutExercises);
router.get('/exercises/:exerciseId', workoutController.getExerciseById);
router.get('/workouts/:userId', workoutController.getAllWorkoutsForUser);  // Updated route
router.get('/exercises', workoutController.getAllExercises);  // Add this line

module.exports = router;

const express = require('express');
const adminController = require('../controllers/adminController'); // You need to create this
const checkAdmin = require('../middlewares/checkAdmin'); // You need to create this middleware
const router = express.Router();

router.get('/users', checkAdmin, adminController.getUsers);
router.get('/users/:userId/workouts', checkAdmin, adminController.getUserWorkouts);
router.get('/workouts/:workoutId/training', checkAdmin, adminController.getWorkoutTraining);
router.post('/users/:userId/workouts', checkAdmin, adminController.createWorkout);
router.delete('/training/:trainingId', checkAdmin, adminController.deleteTraining);
router.put('/training/:trainingId', checkAdmin, adminController.updateTraining);
router.post('/approved_emails', checkAdmin, adminController.addApprovedEmail);
router.post('/exercises', checkAdmin, adminController.addExercise);
router.post('/users/:userId/nutrition', checkAdmin, adminController.addNutritionPlan);
router.post('/users/:userId/tasks', checkAdmin, adminController.addTask);

module.exports = router;

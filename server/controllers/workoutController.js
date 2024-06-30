const { Workout, Task, Training, Exercise } = require('../models');

exports.saveWorkoutData = async (req, res) => {
  const { workoutId, exercises } = req.body;
  console.log('Saving Training data for Training');
  try {
    for (const exercise of exercises) {
      await Training.update({
        sets_done: exercise.sets_done || 0,
        reps_done: exercise.reps_done || 0,
        last_set_weight: exercise.last_set_weight || 0
      }, {
        where: { training_id: exercise.training_id }
      });
    }
    console.log('Training data saved successfully for workout ID:', workoutId);
    await Workout.update({ status: 'completed' }, { where: { workout_id: workoutId } });
    console.log('save task', req.body.task_id);
    if (req.body.task_id) {
      await Task.update({ task_status: 'Finish' }, { where: { task_id: req.body.task_id } });
    }

    console.log('Workout data saved successfully for workout ID:', workoutId);
    res.status(200).json({ message: 'Workout data saved successfully' });
  } catch (error) {
    console.error('Error saving workout data for workout ID:', workoutId, error.message);
    res.status(500).json({ error: 'Failed to save workout data' });
  }
};

exports.getWorkoutExercises = async (req, res) => {
  const { workoutId } = req.params;
  try {
    const exercises = await Training.findAll({
      where: { workout_id: workoutId },
      include: [{
        model: Exercise,
        attributes: ['exercise_name'], // Include only the exercise name from the Exercise table
      }],
    });
    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises for workout ID:', workoutId, error.message);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
};

exports.getExerciseById = async (req, res) => {
  const { exerciseId } = req.params;

  try {
    const exercise = await Exercise.findOne({ where: { exercise_id: exerciseId } });
    res.json(exercise);
  } catch (error) {
    console.error('Error fetching exercise for ID:', exerciseId, error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllWorkoutsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const workouts = await Workout.findAll({ where: { user_id: userId } });
    if (workouts.length > 0) {
      res.json(workouts);
    } else {
      res.status(404).json({ message: 'No workouts found for this user' });
    }
  } catch (error) {
    console.error('Error fetching workouts for user ID:', userId, error.message);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
};

exports.getAllExercises = async (req, res) => {
  try {
    console.log('Fetching all exercises');
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error.message);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
};
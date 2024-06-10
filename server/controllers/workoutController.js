const { Workout } = require('../models');
const { Training } = require('../models');

exports.createWorkout = async (req, res) => {
  const { userId } = req.params;
  const { workout_name, workout_description, scheduled_date, status, training } = req.body;
  try {
    const workout = await Workout.create({ user_id: userId, workout_name, workout_description, status: 'pending' });
    const workoutId = workout.workout_id;

    for (const entry of training) {
      const { exercise_id,trainer_exp, sets_to_do, reps_to_do, goal_weight, manipulation } = entry;
      console.log(`Creating training entry for workout ${workoutId} with exercise ${exercise_id}`);
      console.log(`trainer_exp: ${trainer_exp}, sets_to_do: ${sets_to_do}, reps_to_do: ${reps_to_do}, goal_weight: ${goal_weight}, manipulation: ${manipulation}`);
      await Training.create({
        workout_id: workoutId,
        exercise_id,
        trainer_exp,
        sets_to_do,
        reps_to_do,
        goal_weight,
        manipulation,
      });
    }

    await Task.create({
      user_id: userId,
      task_name: workout_name,
      task_description: workout_description,
      task_status: 'Pending',
      task_type: 'workout',
      related_id: workoutId,
    });

    res.status(201).json({ workout_id: workoutId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkouts = async (req, res) => {
  const { userId } = req.params;
  try {
    const workouts = await Workout.findAll({
      where: { user_id: userId },
      attributes: ['workout_name', 'workout_description', 'workout_id'], // Specify the attributes to retrieve
    });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

const { User, Workout, Training, Task, Exercise, NutritionPlan, ApprovedEmail } = require('../models');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ where: { role: 'user' } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserWorkouts = async (req, res) => {
  const { userId } = req.params;
  try {
    const workouts = await Workout.findAll({ where: { user_id: userId } });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkoutTraining = async (req, res) => {
  const { workoutId } = req.params;
  try {
    const training = await Training.findAll({
      where: { workout_id: workoutId },
      include: [{ model: Exercise, attributes: ['exercise_name'] }],
    });
    res.json(training);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createWorkout = async (req, res) => {
  const { userId } = req.params;
  const { workout_name, workout_description, scheduled_date, status, training } = req.body;
  try {
    const workout = await Workout.create({ user_id: userId, workout_name, workout_description, status: 'pending' });
    const workoutId = workout.workout_id;

    for (const entry of training) {
      const { exercise_id, sets_to_do, reps_to_do, goal_weight, manipulation } = entry;
      await Training.create({
        workout_id: workoutId,
        exercise_id,
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

exports.deleteTraining = async (req, res) => {
  const { trainingId } = req.params;
  try {
    await Training.destroy({ where: { training_id: trainingId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTraining = async (req, res) => {
  const { trainingId } = req.params;
  const { exercise_id, sets_to_do, reps_to_do, goal_weight, manipulation } = req.body;
  try {
    const [updated] = await Training.update(
      { exercise_id, sets_to_do, reps_to_do, goal_weight, manipulation },
      { where: { training_id: trainingId } }
    );
    if (updated) {
      const updatedTraining = await Training.findByPk(trainingId);
      res.json(updatedTraining);
    } else {
      res.status(404).json({ error: 'Training not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addApprovedEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const newEmail = await ApprovedEmail.create({ email });
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addExercise = async (req, res) => {
  const { exercise_name, exercise_area, exercise_description } = req.body;
  const exercise_video = req.file ? req.file.path : null;
  try {
    const exercise = await Exercise.create({
      exercise_name,
      area: exercise_area,
      exercise_description,
      video_url: exercise_video,
    });
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addNutritionPlan = async (req, res) => {
  const { userId } = req.params;
  const { plan_name, plan_description } = req.body;
  const file = req.file ? req.file.path : null;
  try {
    const plan = await NutritionPlan.create({
      user_id: userId,
      plan_name,
      plan_description,
      file,
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

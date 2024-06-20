const { Workout } = require('../models');



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

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const logger = require('./logger'); // Importing the logger configuration
require('dotenv').config();
const path = require('path');

const app = express();
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Create a connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

app.post('/api/tracking', upload.array('photos', 4), async (req, res) => {
  const { user_id, date, weight, body_fat_percentage, chest, waist, thighr, thighl, armr, arml } = req.body;
  const photos = req.files;

  try {
    logger.debug('Connected to the database for tracking insertion.');

    const query = `INSERT INTO measurements (user_id, date, weight, body_fat_percentage, chest, waist, thighr, thighl, armr, arml, photo1, photo2, photo3, photo4)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
    const values = [
      user_id,
      date,
      weight,
      body_fat_percentage,
      chest,
      waist,
      thighr,
      thighl,
      armr,
      arml,
      photos[0]?.buffer,
      photos[1]?.buffer,
      photos[2]?.buffer,
      photos[3]?.buffer,
    ];

    const result = await pool.query(query, values);
    logger.info('New measurement added successfully');

    // Update the task status to 'Finish'
    if (req.body.task_id) {
      logger.debug('Updating task status to Finish', req.body.task_id);
      await pool.query(`UPDATE tasks SET task_status = 'Finish' WHERE task_id = $1`, [req.body.task_id]);
    }

    res.status(200).json({ message: 'New measurement added successfully', id: result.rows[0].id });
  } catch (error) {
    logger.error('Error inserting new measurement:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  logger.debug('Register route');
  const {
    name, email, password, phone, age, height, weight, trainingYears, trainingFrequency, preferredTrainingLocation,
    homeEquipment, desiredEquipment, strengthTrainingDescription, preferredFocusAreas, favoriteCardio,
    currentCardioRoutine, injuries, highestWeight, favoriteFoods, dislikedFoods, foodTrackingMethod, pastDiets,
    dailyNutrition, weekendNutrition, favoriteRecipes, alcoholConsumption, medications, sleepHours, currentJob,
    activityLevel, sportsParticipation, mirrorReflection, longTermGoals, motivationLevel, commitmentDeclaration,
    additionalNotes, medicalStatement, signature, termsAccepted, mailingAccepted
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    logger.debug('Password hashed successfully.');

    try {
      const userQuery = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, 'user')
        RETURNING user_id, name, email, role;
      `;
      const userValues = [name, email, hashedPassword];
      const userResult = await pool.query(userQuery, userValues);
      const userId = userResult.rows[0].user_id;
      logger.info('User inserted successfully with ID:', userId);
      const detailsQuery = `
        INSERT INTO user_details (user_id, phone, age, height, weight, training_years, training_frequency, preferred_training_location,
          home_equipment, desired_equipment, strength_training_description, preferred_focus_areas, favorite_cardio, current_cardio_routine,
          injuries, highest_weight, favorite_foods, disliked_foods, food_tracking_method, past_diets, daily_nutrition, weekend_nutrition,
          favorite_recipes, alcohol_consumption, medications, sleep_hours, current_job, activity_level, sports_participation,
          mirror_reflection, long_term_goals, motivation_level, commitment_declaration, additional_notes, medical_statement, signature, terms_accepted, mailing_accepted)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38);
      `;
      const detailsValues = [
        userId, phone, age, height, weight, trainingYears, trainingFrequency, preferredTrainingLocation, homeEquipment, desiredEquipment,
        strengthTrainingDescription, preferredFocusAreas, favoriteCardio, currentCardioRoutine, injuries, highestWeight, favoriteFoods, dislikedFoods, foodTrackingMethod,
        pastDiets, dailyNutrition, weekendNutrition, favoriteRecipes, alcoholConsumption, medications, sleepHours, currentJob, activityLevel, sportsParticipation,
        mirrorReflection, longTermGoals, motivationLevel, commitmentDeclaration, additionalNotes, JSON.stringify(medicalStatement), signature, termsAccepted, mailingAccepted
      ];

      await pool.query(detailsQuery, detailsValues);
      console.log('User details inserted');

      // Define the tasks
      const tasks = [
        {
          task_name: 'יומן תזונה יום ראשון',
          task_description: 'This is your first welcome task. Get familiar with our platform.',
          task_status: 'Pending',
          task_type: 'food',
          due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
        },
        {
          task_name: 'יומן תזונה יום שני',
          task_description: 'This is your second welcome task. Complete your profile.',
          task_status: 'Pending',
          task_type: 'food',
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        },
        {
          task_name: 'יומן תזונה יום שלישי',
          task_description: 'This is your third welcome task. Set your fitness goals.',
          task_status: 'Pending',
          task_type: 'food',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        },
        {
          task_name: 'מדידת היקפים',
          task_description: 'This is your fourth welcome task. Start tracking your progress.',
          task_status: 'Pending',
          task_type: 'measure',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 weeks from now
        }
      ];

      // Insert the tasks
      const taskQuery = `
        INSERT INTO tasks (user_id, task_name, task_description, task_status, due_date, task_type)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;

      for (const task of tasks) {
        await pool.query(taskQuery, [userId, task.task_name, task.task_description, task.task_status, task.due_date, task.task_type]);
      }

      logger.info('Tasks inserted successfully for user ID:', userId);
      res.status(201).json(userResult.rows[0]);
    } catch (error) {
      logger.error('Database operation failed during user registration:', error);
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    logger.error('Error during user registration:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  logger.debug('Login route');
  const { email, password } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      logger.info('User authenticated successfully:', user.user_id);
      res.json({ id: user.user_id, name: user.name, email: user.email, role: user.role });
    } else {
      logger.warn('Invalid credentials provided for email:', email);
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    logger.error('Error during login:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks/:userId', async (req, res) => {
  logger.debug('Get tasks for user');
  const { userId } = req.params;
  try {
    const query = 'SELECT * FROM tasks WHERE user_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    logger.info('Fetched tasks for user ID:', userId);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching tasks for user ID:', userId, error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:taskId', async (req, res) => {
  logger.debug('Update task status', req.body, req.params);
  const { task_status } = req.body;
  const { taskId } = req.params;
  try {
    const query = 'UPDATE tasks SET task_status = $1 WHERE task_id = $2 RETURNING *';
    const values = [task_status, taskId];
    const result = await pool.query(query, values);
    logger.info('Task status updated successfully for task ID:', taskId);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating task status for task ID:', taskId, error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tracking/:userId', async (req, res) => {
  logger.debug('Get tracking metrics for user ID:', req.params.userId);
  const { userId } = req.params;
  try {
    const query = 'SELECT * FROM measurements WHERE user_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    logger.info('Fetched tracking metrics for user ID:', userId);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching tracking metrics for user ID:', userId, error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/latest-measurement/:userId', async (req, res) => {
  logger.debug('Get latest measurement for user ID:', req.params.userId);
  const { userId } = req.params;
  try {
    const query = 'SELECT * FROM measurements WHERE user_id = $1 ORDER BY date DESC LIMIT 1';
    const values = [userId];
    const result = await pool.query(query, values);
    logger.info('Fetched latest measurement for user ID:', userId);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching latest measurement for user ID:', userId, error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/workouts/:userId', async (req, res) => {
  logger.debug('Fetching workouts for user ID:', req.params.userId);
  const { userId } = req.params;
  try {
    const query = `
      SELECT w.workout_id, w.workout_name, w.workout_description, w.scheduled_date,
             e.exercise_name, e.exercise_description, t.trainer_exp, t.sets_to_do, t.reps_to_do, t.goal_weight,
             t.manipulation, t.sets_done, t.reps_done, t.last_set_weight
      FROM workouts w
      LEFT JOIN training t ON w.workout_id = t.workout_id
      LEFT JOIN exercises e ON t.exercise_id = e.exercise_id
      WHERE w.user_id = $1
      ORDER BY w.scheduled_date;
    `;
    const values = [userId];
    const result = await pool.query(query, values);
    logger.info('Workouts fetched for user ID:', userId);

    const workouts = result.rows.reduce((acc, row) => {
      const workout = acc.find(w => w.workout_id === row.workout_id);
      const exercise = {
        exercise_name: row.exercise_name,
        exercise_description: row.exercise_description,
        trainer_exp: row.trainer_exp,
        sets_to_do: row.sets_to_do,
        reps_to_do: row.reps_to_do,
        goal_weight: row.goal_weight,
        manipulation: row.manipulation,
        sets_done: row.sets_done,
        reps_done: row.reps_done,
        last_set_weight: row.last_set_weight,
      };
      if (workout) {
        workout.exercises.push(exercise);
      } else {
        acc.push({
          workout_id: row.workout_id,
          workout_name: row.workout_name,
          workout_description: row.workout_description,
          scheduled_date: row.scheduled_date,
          exercises: [exercise],
        });
      }
      return acc;
    }, []);

    res.json(workouts);
  } catch (error) {
    logger.error('Error fetching workouts for user ID:', userId, error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/workouts/:workoutId/exercises', async (req, res) => {
  logger.debug('Get exercises for workout ID:', req.params.workoutId);
  const { workoutId } = req.params;

  try {
    const query = `
      SELECT e.exercise_name, e.exercise_description, e.video_url, t.sets_to_do, t.reps_to_do, t.goal_weight, t.manipulation, t.training_id
      FROM training t
      JOIN exercises e ON t.exercise_id = e.exercise_id
      WHERE t.workout_id = $1
    `;
    const values = [workoutId];
    const result = await pool.query(query, values);
    logger.info('Fetched exercises for workout ID:', workoutId);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching exercises for workout ID:', workoutId, error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/food-entry', async (req, res) => {
  logger.debug('Add new food entry');
  const { user_id, description, task_id } = req.body;

  try {
    logger.debug('Connected to the database for food entry insertion.');

    const query = `INSERT INTO result_tracking (task_id, eating_day_free_txt)
                   VALUES ($1, $2) RETURNING *`;
    const values = [task_id, description];
    const result = await pool.query(query, values);

    // Update the task status to 'Finish'
    if (task_id) {
      await pool.query(`UPDATE tasks SET task_status = 'Finish' WHERE task_id = $1`, [task_id]);
    }

    logger.info('New food entry added successfully');
    res.status(200).json({ message: 'New food entry added successfully', id: result.rows[0].id });
  } catch (error) {
    logger.error('Error inserting new food entry:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/exercises/:exerciseId', async (req, res) => {
  logger.debug('Get exercise by ID:', req.params.exerciseId);
  const { exerciseId } = req.params;
  try {
    const query = 'SELECT * FROM exercises WHERE exercise_id = $1';
    const values = [exerciseId];
    const result = await pool.query(query, values);
    logger.info('Fetched exercise for ID:', exerciseId);
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching exercise for ID:', exerciseId, error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/workouts/save', async (req, res) => {
  logger.debug('Save workout data');
  const { workoutId, exercises } = req.body;

  try {
    for (const exercise of exercises) {
      const values = [
        exercise.sets_done || 0,
        exercise.reps_done || 0,
        exercise.last_set_weight || 0,
        exercise.training_id,
      ];
      await pool.query('UPDATE training SET sets_done = $1, reps_done = $2, last_set_weight = $3 WHERE training_id = $4', values);
    }

    const statusUpdateValues = ['completed', workoutId];
    await pool.query('UPDATE workouts SET status = $1 WHERE workout_id = $2', statusUpdateValues);

    logger.info('Workout data saved successfully for workout ID:', workoutId);
    const { taskId } = req.body;
    console.log('task_id:', taskId)

    if (taskId) {
      console.log('Updating task status to Finish', taskId);
      await pool.query(`UPDATE tasks SET task_status = 'Finish' WHERE task_id = $1`, [taskId]);
    }
    res.status(200).json({ message: 'Workout data saved successfully' });
  } catch (error) {
    logger.error('Error saving workout data for workout ID:', workoutId, error.message);
    res.status(500).json({ error: 'Failed to save workout data' });
  }
});

app.get('/api/admin/exercises', async (req, res) => {
  logger.debug('Get all exercises for admin');
  try {
    const query = 'SELECT exercise_id, exercise_name FROM exercises';
    const result = await pool.query(query);
    logger.info('Fetched all exercises for admin.');
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching exercises for admin:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ########################### ADMIN ROUTES ############################

const checkAdmin = async (req, res, next) => {
  logger.debug('Check if user is an admin');
  const adminUserId = req.headers['admin-user-id'];
  // console.log(!adminUserId, !(await isAdmin(adminUserId)))
  if (!adminUserId || !(await isAdmin(adminUserId))) {
    console.log('Unauthorized from checkAdmin');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Helper function to check if a user is an admin
const isAdmin = async (userId) => {
  try {
    const res = await pool.query('SELECT role FROM users WHERE user_id = $1', [userId]);
    if (res.rows.length > 0) {
      return res.rows[0].role === 'admin';
    }
    return false;
  } catch (err) {
    console.error('Database query error', err);
    return false;
  }
};


app.get('/api/admin/users', async (req, res) => {
  logger.debug('Get all users for admin');
  try {
    const query = 'SELECT * FROM users WHERE role = $1';
    const values = ['user'];
    const result = await pool.query(query, values);
    logger.info('Fetched all users for admin.');
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching users for admin:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/users/:userId/workouts', checkAdmin, async (req, res) => {
  logger.debug('Get workouts for user ID:', req.params.userId);
  const { userId } = req.params;
  try {
    const query = 'SELECT * FROM workouts WHERE user_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    logger.info('Fetched workouts for user ID:', userId);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching workouts for user ID:', userId, error.message);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

app.get('/api/admin/workouts/:workoutId/training', checkAdmin, async (req, res) => {
  logger.debug('Get training details for workout ID:', req.params.workoutId);
  const { workoutId } = req.params;
  try {
    const query = `
      SELECT 
        t.training_id,
        t.sets_to_do,
        t.reps_to_do,
        t.goal_weight,
        t.manipulation,
        t.sets_done,
        t.reps_done,
        t.last_set_weight,
        e.exercise_name,
        e.exercise_id
      FROM 
        training t
      JOIN 
        exercises e
      ON 
        t.exercise_id = e.exercise_id
      WHERE 
        t.workout_id = $1
    `;
    const values = [workoutId];
    const result = await pool.query(query, values);
    logger.info('Fetched training details for workout ID:', workoutId);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching training details for workout ID:', workoutId, error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/training/:trainingId', checkAdmin, async (req, res) => {
  logger.debug('Delete training by ID:', req.params.trainingId);
  const { trainingId } = req.params;
  try {
    const query = 'DELETE FROM training WHERE training_id = $1';
    const values = [trainingId];
    await pool.query(query, values);
    logger.info('Deleted training with ID:', trainingId);
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting training with ID:', trainingId, error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/training/:trainingId', checkAdmin, async (req, res) => {
  logger.debug('Update training by ID:', req.params.trainingId);
  const { trainingId } = req.params;
  const { exercise_id, sets_to_do, reps_to_do, goal_weight, manipulation } = req.body;

  try {
    const query = `
      UPDATE training 
      SET exercise_id = $1, sets_to_do = $2, reps_to_do = $3, goal_weight = $4, manipulation = $5 
      WHERE training_id = $6
    `;
    const values = [exercise_id, sets_to_do, reps_to_do, goal_weight, manipulation, trainingId];
    await pool.query(query, values);
    logger.info('Updated training with ID:', trainingId);
    res.json({ message: 'Training updated successfully' });
  } catch (error) {
    logger.error('Error updating training with ID:', trainingId, error.message);
    res.status(500).json({ error: 'Server error' });
  }
});



app.post('/api/admin/users/:userId/workouts', checkAdmin, async (req, res) => {
  const { userId } = req.params;
  console.log('userId:', userId)
  // logger.debug('Create new workout for user ID:', userId);
  const { workout_name, workout_description, scheduled_date, status, training } = req.body;
  try {
    const workoutQuery = `
      INSERT INTO workouts (user_id, workout_name, workout_description, status) VALUES ($1, $2, $3, 'pending') RETURNING workout_id;
    `;
    const workoutValues = [userId, workout_name, workout_description,];
    const workoutResult = await pool.query(workoutQuery, workoutValues);
    const newWorkoutId = workoutResult.rows[0].workout_id;
    console.log('newWorkoutId:', newWorkoutId)
    const trainingQuery = `
      INSERT INTO training (workout_id, exercise_id, trainer_exp, sets_to_do, reps_to_do, goal_weight, manipulation, sets_done, reps_done, last_set_weight)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 0 ,0 ,0 );
    `;
    for (const entry of training) {
      const { exercise_id, sets_to_do, trainer_exp, reps_to_do, goal_weight, manipulation } = entry;
      await pool.query(trainingQuery, [newWorkoutId, exercise_id, trainer_exp, sets_to_do, reps_to_do, goal_weight, manipulation]);
    }
    logger.info('New workout created successfully for user ID:', userId);
    const taskInsertQuery = `
          INSERT INTO tasks (user_id, task_name, task_status ,task_type, task_description, related_id)
          VALUES ($1, $2, 'Pending', 'workout', $3, $4);
      `;

    values = [userId, workout_name, workout_description, newWorkoutId];
    await pool.query(taskInsertQuery, values);
    logger.info('New workout created successfully for user ID:', userId);
    res.status(201).json({ workout_id: newWorkoutId });
  } catch (error) {
    logger.error('Error creating new workout for user ID:', userId, error.message);
    res.status(500).json({ error: 'Failed to create new workout' });
  }
});


app.post('/api/admin/approved_emails', checkAdmin, async (req, res) => {
  logger.debug('Add new approved email');
  const { email } = req.body;
  try {
    const query = 'INSERT INTO approved_emails (email) VALUES ($1)';
    const values = [email];
    await pool.query(query, values);
    logger.info('New approved email added successfully');
    res.status(201).json({ message: 'New approved email added successfully' });
  } catch (error) {
    logger.error('Error adding new approved email:', error.message);
    res.status(500).json({ error: 'Failed to add new approved email' });
  }
});

app.post('/api/admin/exercises', upload.single('exercise_video'), async (req, res) => {
  try {
    const { exercise_name, exercise_area, exercise_description } = req.body;
    const exercise_video = req.file ? req.file.path : null;

    const query = `
      INSERT INTO exercises (exercise_name, area, exercise_description, video_url)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [exercise_name, exercise_area, exercise_description, exercise_video];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding exercise:', err);
    res.status(500).json({ error: 'Failed to add exercise' });
  }
});

// generate function to handle       await axios.post(`http://localhost:5000/api/users/${userId}/nutrition`, formData,
app.post('/api/users/:userId/nutrition', upload.single('file'), async (req, res) => {
  const { userId } = req.params;
  const { plan_name, plan_description } = req.body;
  const file = req.file;

  try {
    const query = `
      INSERT INTO nutrition_plans (user_id, plan_name, plan_description, file)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [userId, plan_name, plan_description, file?.path];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding nutrition plan:', err);
    res.status(500).json({ error: 'Failed to add nutrition plan' });
  }
});

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});



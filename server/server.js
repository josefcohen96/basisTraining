const express = require('express');
const cors = require('cors');
const multer = require('multer');
const logger = require('./logger');
const path = require('path');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

require('dotenv').config();

const app = express();
const port = 5000;

// Multer storage configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));


// Import Sequelize config and models
const db = require('./models');

const resetDatabase = async () => {
  try {
    await db.sequelize.drop();
    console.log('Database dropped');
    await syncDatabase();
    console.log('Database reset and synced');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
};


// resetDatabase();

const syncDatabase = async () => {
  try {
    await db.User.sync();
    await db.UserDetail.sync();
    await db.Measurement.sync();
    await db.Task.sync();
    await db.Workout.sync();
    await db.NutritionPlan.sync();
    await db.ResultTracking.sync();
    await db.Exercise.sync();
    await db.Training.sync();
    console.log('Database synced');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncDatabase();


// Sync models to ensure database is up-to-date
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
});
// General logging middleware to log all requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Import routes
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/auth', authRoutes);

// Define the tracking route
app.post('/api/tracking', upload.array('photos', 4), async (req, res) => {
  const { user_id, date, weight, body_fat_percentage, chest, waist, thighr, thighl, armr, arml } = req.body;
  const photos = req.files;

  try {
    // Replace direct SQL query with Sequelize create method
    const newMeasurement = await db.Measurement.create({
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
      photo1: photos[0]?.buffer,
      photo2: photos[1]?.buffer,
      photo3: photos[2]?.buffer,
      photo4: photos[3]?.buffer,
    });

    logger.info('New measurement added successfully');

    // Update task status if task_id is provided
    if (req.body.task_id) {
      logger.debug('Updating task status to Finish', req.body.task_id);
      await db.Task.update({ task_status: 'Finish' }, { where: { task_id: req.body.task_id } });
    }

    res.status(200).json({ message: 'New measurement added successfully', id: newMeasurement.id });
  } catch (error) {
    logger.error('Error inserting new measurement:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Define the user registration route
const validateRegistrationData = (data) => {
  // Validate required fields and data types
  const requiredFields = ['name', 'email', 'password', 'phone', 'age', 'height', 'weight', 'trainingYears', 'trainingFrequency'];
  for (const field of requiredFields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }
  // Additional validation logic can be added here
  return null;
};

app.post('/api/auth/register', async (req, res) => {
  console.log("Register route");
  logger.debug('Register route');

  const {
    name, email, password, phone, age, height, weight, trainingYears, trainingFrequency, preferredTrainingLocation,
    homeEquipment, desiredEquipment, strengthTrainingDescription, preferredFocusAreas, favoriteCardio,
    currentCardioRoutine, injuries, highestWeight, favoriteFoods, dislikedFoods, foodTrackingMethod, pastDiets,
    dailyNutrition, weekendNutrition, favoriteRecipes, alcoholConsumption, medications, sleepHours, currentJob,
    activityLevel, sportsParticipation, mirrorReflection, longTermGoals, motivationLevel, commitmentDeclaration,
    additionalNotes, medicalStatement, signature, termsAccepted, mailingAccepted, status
  } = req.body;

  // Log the entire request body for debugging
  console.log('Request body:', req.body);

  // Validate the registration data
  const validationError = validateRegistrationData(req.body);
  if (validationError) {
    logger.error('Validation error:', validationError);
    return res.status(400).json({ error: validationError });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    logger.debug('Password hashed successfully.');

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      status: status || null,
      due_date: due_date || null,
    });

    const userId = newUser.user_id;
    logger.info('User inserted successfully with ID:', userId);

    await db.UserDetail.create({
      user_id: userId,
      phone,
      age,
      height,
      weight,
      training_years: trainingYears,
      training_frequency: trainingFrequency,
      preferred_training_location: preferredTrainingLocation,
      home_equipment: homeEquipment,
      desired_equipment: desiredEquipment,
      strength_training_description: strengthTrainingDescription,
      preferred_focus_areas: preferredFocusAreas,
      favorite_cardio: favoriteCardio,
      current_cardio_routine: currentCardioRoutine,
      injuries,
      highest_weight: highestWeight,
      favorite_foods: favoriteFoods,
      disliked_foods: dislikedFoods,
      food_tracking_method: foodTrackingMethod,
      past_diets: pastDiets,
      daily_nutrition: dailyNutrition,
      weekend_nutrition: weekendNutrition,
      favorite_recipes: favoriteRecipes,
      alcohol_consumption: alcoholConsumption,
      medications,
      sleep_hours: sleepHours,
      current_job: currentJob,
      activity_level: activityLevel,
      sports_participation: sportsParticipation,
      mirror_reflection: mirrorReflection,
      long_term_goals: longTermGoals,
      motivation_level: motivationLevel,
      commitment_declaration: commitmentDeclaration,
      additional_notes: additionalNotes,
      medical_statement: JSON.stringify(medicalStatement),
      signature,
      terms_accepted: termsAccepted,
      mailing_accepted: mailingAccepted
    });

    logger.info('User details inserted successfully');

    const tasks = [
      {
        user_id: userId,
        task_name: 'יומן תזונה יום ראשון',
        task_description: 'This is your first welcome task. Get familiar with our platform.',
        task_status: 'Pending',
        task_type: 'food',
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: userId,
        task_name: 'יומן תזונה יום שני',
        task_description: 'This is your second welcome task. Complete your profile.',
        task_status: 'Pending',
        task_type: 'food',
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: userId,
        task_name: 'יומן תזונה יום שלישי',
        task_description: 'This is your third welcome task. Set your fitness goals.',
        task_status: 'Pending',
        task_type: 'food',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: userId,
        task_name: 'מדידת היקפים',
        task_description: 'This is your fourth welcome task. Start tracking your progress.',
        task_status: 'Pending',
        task_type: 'measure',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const task of tasks) {
      await Task.create(task);
    }

    logger.info('Tasks inserted successfully for user ID:', userId);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error('Error during user registration:', error.message);
    console.log(error); // Log the error to the console for debugging
    res.status(400).json({ error: error.message });
  }
});

// Define the user login route
app.post('/api/auth/login', async (req, res) => { // ################## FOUND ##################
  logger.debug('Login route');
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });
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

// Define the get tasks for a user route
app.get('/api/tasks/:userId', async (req, res) => {
  logger.debug('Get tasks for user');
  const { userId } = req.params;

  try {
    const tasks = await db.Task.findAll({ where: { user_id: userId } });
    logger.info('Fetched tasks for user ID:', userId);
    res.json(tasks);
  } catch (error) {
    logger.error('Error fetching tasks for user ID:', userId, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Define the update task status route
app.put('/api/tasks/:taskId', async (req, res) => {
  logger.debug('Update task status', req.body, req.params);
  const { task_status } = req.body;
  const { taskId } = req.params;

  try {
    const [updated] = await db.Task.update({ task_status }, { where: { task_id: taskId } });
    if (updated) {
      const updatedTask = await db.Task.findOne({ where: { task_id: taskId } });
      logger.info('Task status updated successfully for task ID:', taskId);
      res.json(updatedTask);
    } else {
      throw new Error('Task not found');
    }
  } catch (error) {
    logger.error('Error updating task status for task ID:', taskId, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Define the get tracking metrics for a user route
app.get('/api/tracking/:userId', async (req, res) => {
  logger.debug('Get tracking metrics for user ID:', req.params.userId);
  const { userId } = req.params;

  try {
    const measurements = await db.Measurement.findAll({ where: { user_id: userId } });
    logger.info('Fetched tracking metrics for user ID:', userId);
    res.json(measurements);
  } catch (error) {
    logger.error('Error fetching tracking metrics for user ID:', userId, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Define the get latest measurement for a user route
app.get('/api/latest-measurement/:userId', async (req, res) => {
  logger.debug('Get latest measurement for user ID:', req.params.userId);
  const { userId } = req.params;

  try {
    const latestMeasurement = await db.Measurement.findOne({
      where: { user_id: userId },
      order: [['date', 'DESC']]
    });
    logger.info('Fetched latest measurement for user ID:', userId);
    res.json(latestMeasurement);
  } catch (error) {
    logger.error('Error fetching latest measurement for user ID:', userId, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Define the get workouts for a user route
app.get('/api/workouts/:userId', async (req, res) => {
  logger.debug('Fetching workouts for user ID:', req.params.userId);
  const { userId } = req.params;

  try {
    const workouts = await db.Workout.findAll({
      where: { user_id: userId },
      include: [{
        model: db.Exercise,
        through: {
          attributes: ['trainer_exp', 'sets_to_do', 'reps_to_do', 'goal_weight', 'manipulation', 'sets_done', 'reps_done', 'last_set_weight']
        }
      }]
    });
    logger.info('Workouts fetched for user ID:', userId);
    res.json(workouts);
  } catch (error) {
    logger.error('Error fetching workouts for user ID:', userId, error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Define the add new food entry route
app.post('/api/food-entry', async (req, res) => {
  logger.debug('Add new food entry');
  const { user_id, description, task_id } = req.body;

  try {
    const newEntry = await db.ResultTracking.create({
      task_id,
      eating_day_free_txt: description
    });

    // Update the task status to 'Finish'
    if (task_id) {
      await db.Task.update({ task_status: 'Finish' }, { where: { task_id } });
    }

    logger.info('New food entry added successfully');
    res.status(200).json({ message: 'New food entry added successfully', id: newEntry.id });
  } catch (error) {
    logger.error('Error inserting new food entry:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Define the get exercise by ID route
app.get('/api/exercises/:exerciseId', async (req, res) => {
  logger.debug('Get exercise by ID:', req.params.exerciseId);
  const { exerciseId } = req.params;

  try {
    const exercise = await db.Exercise.findOne({ where: { exercise_id: exerciseId } });
    logger.info('Fetched exercise for ID:', exerciseId);
    res.json(exercise);
  } catch (error) {
    logger.error('Error fetching exercise for ID:', exerciseId, error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the save workout data route
app.post('/api/workouts/save', async (req, res) => {
  logger.debug('Save workout data');
  const { workoutId, exercises } = req.body;

  try {
    for (const exercise of exercises) {
      await db.Training.update({
        sets_done: exercise.sets_done || 0,
        reps_done: exercise.reps_done || 0,
        last_set_weight: exercise.last_set_weight || 0
      }, {
        where: { training_id: exercise.training_id }
      });
    }

    await db.Workout.update({ status: 'completed' }, { where: { workout_id: workoutId } });

    if (req.body.task_id) {
      await db.Task.update({ task_status: 'Finish' }, { where: { task_id: req.body.task_id } });
    }

    logger.info('Workout data saved successfully for workout ID:', workoutId);
    res.status(200).json({ message: 'Workout data saved successfully' });
  } catch (error) {
    logger.error('Error saving workout data for workout ID:', workoutId, error.message);
    res.status(500).json({ error: 'Failed to save workout data' });
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


app.get('/api/admin/users', async (req, res) => {  //  need to check if there is already function for it
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

// TBD
app.post('/api/admin/users/:userId/nutrition', upload.single('file'), async (req, res) => {
  TBD

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

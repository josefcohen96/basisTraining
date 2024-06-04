const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const multer = require('multer')

require('dotenv').config();

const app = express();
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const client = await pool.connect();

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

    const result = await client.query(query, values);

    // Update the task status to 'Finish'
    if (req.body.task_id) {
      console.log(req.body);
      console.log('Updating task status to Finish', req.body.task_id);
      await client.query(`UPDATE tasks SET task_status = 'Finish' WHERE task_id = $1`, [req.body.task_id]);
    }

    client.release();
    res.status(200).json({ message: 'New measurement added successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error inserting new measurement:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  console.log('Register route');
  const {
    name, email, password, phone, age, height, weight, trainingYears, trainingFrequency, preferredTrainingLocation,
    homeEquipment, desiredEquipment, strengthTrainingDescription, preferredFocusAreas, favoriteCardio,
    currentCardioRoutine, injuries, highestWeight, favoriteFoods, dislikedFoods, foodTrackingMethod, pastDiets,
    dailyNutrition, weekendNutrition, favoriteRecipes, alcoholConsumption, medications, sleepHours, currentJob,
    activityLevel, sportsParticipation, mirrorReflection, longTermGoals, motivationLevel, commitmentDeclaration, additionalNotes
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Connected to database');
    try {
      const userQuery = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, 'user')
        RETURNING user_id, name, email, role;
      `;
      console.log('Inserting user');
      const userValues = [name, email, hashedPassword];
      const userResult = await pool.query(userQuery, userValues);
      const userId = userResult.rows[0].user_id;
      console.log('User inserted', userId);

      // const detailsQuery = `
      //   INSERT INTO user_details (user_id, phone, age, height, weight, training_years, training_frequency, preferred_training_location,
      //     home_equipment, desired_equipment, strength_training_description, preferred_focus_areas, favorite_cardio, current_cardio_routine,
      //     injuries, highest_weight, favorite_foods, disliked_foods, food_tracking_method, past_diets, daily_nutrition, weekend_nutrition,
      //     favorite_recipes, alcohol_consumption, medications, sleep_hours, current_job, activity_level, sports_participation,
      //     mirror_reflection, long_term_goals, motivation_level, commitment_declaration, additional_notes)
      //   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34);
      // `;
      // const detailsValues = [
      //   userId, phone, age, height, weight, trainingYears, trainingFrequency, preferredTrainingLocation, homeEquipment, desiredEquipment,
      //   strengthTrainingDescription, preferredFocusAreas, favoriteCardio, currentCardioRoutine, injuries, highestWeight, favoriteFoods, dislikedFoods, foodTrackingMethod,
      //   pastDiets, dailyNutrition, weekendNutrition, favoriteRecipes, alcoholConsumption, medications, sleepHours, currentJob, activityLevel, sportsParticipation,
      //   mirrorReflection, longTermGoals, motivationLevel, commitmentDeclaration, additionalNotes
      // ];

      // await pool.query(detailsQuery, detailsValues);
      // console.log('User details inserted');

      // Define the tasks
      const tasks = [
        {
          task_name: 'יומן תזונה יום ראשון',
          task_description: 'This is your first welcome task. Get familiar with our platform.',
          task_status: 'Pending',
          task_type: 'food',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
        },
        {
          task_name: 'יומן תזונה יום שני',
          task_description: 'This is your second welcome task. Complete your profile.',
          task_status: 'Pending',
          task_type: 'food',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
        },
        {
          task_name: 'יומן תזונה יום שלישי',
          task_description: 'This is your third welcome task. Set your fitness goals.',
          task_status: 'Pending',
          task_type: 'food',
          due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 3 weeks from now
        },
        {
          task_name: 'מדידת היקפים',
          task_description: 'This is your fourth welcome task. Start tracking your progress.',
          task_status: 'Pending',
          task_type: 'measure',
          due_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) // 4 weeks from now
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

      console.log('Tasks inserted');
      res.status(201).json(userResult.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});



// Login Route
app.post('/api/auth/login', async (req, res) => {
  console.log('Login route');
  const { email, password } = req.body;
  try {
    const query = 'SELECT * FROM Users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      console.log('User authenticated');
      res.json({ id: user.user_id, name: user.name, email: user.email, role: user.role });
    } else {
      console.log('Invalid credentials');
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get('/api/tasks/:userId', async (req, res) => {
  console.log('Get tasks for user');
  const { userId } = req.params;
  try {
    const query = 'SELECT * FROM tasks WHERE user_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:taskId', async (req, res) => {
  console.log('Update task status', req.body, req.params);
  const { task_status } = req.body;
  const { taskId } = req.params;
  try {
    const query = 'UPDATE tasks SET task_status = $1 WHERE task_id = $2 RETURNING *';
    const values = [task_status, taskId];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
    console.log(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tracking/:userId', async (req, res) => {
  console.log('Get tracking metrics');

  const { userId } = req.params;
  console.log(userId);
  try {
    const query = 'SELECT * FROM "measurements" WHERE user_id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    console.log("result tracking/userID" + result);
    res.json(result.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/latest-measurement/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const query = 'SELECT * FROM measurements WHERE user_id = $1 ORDER BY date DESC LIMIT 1';
    const values = [userId];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/workouts/:userId', async (req, res) => {
  console.log('Fetching workouts for user');
  const { userId } = req.params;
  try {
    console.log('Fetching workouts for user', userId);
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
    console.log('Workouts fetched:', result.rows);
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
      console.log('Workout:', workout);
      console.log('Exercise:', exercise);
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
      console.log('Acc:', acc);
      return acc;
    }, []);

    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Database error' });
  }
});


app.get('/api/workouts/:workoutId/exercises', async (req, res) => {
  const workoutId = req.params.workoutId;

  try {
    const result = await pool.query(`
      SELECT e.exercise_name, e.exercise_description, t.sets_to_do, t.reps_to_do, t.goal_weight, t.manipulation, training_id
      FROM training t
      JOIN exercises e ON t.exercise_id = e.exercise_id
      WHERE t.workout_id = $1
    `, [workoutId]);
    console.log('Exercises1111111111111:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).send('Server error');
  }
});


app.post('/api/food-entry', async (req, res) => {
  console.log('Add new food entry')
  const { user_id, description, task_id } = req.body;

  try {
    const client = await pool.connect();

    const query = `INSERT INTO result_tracking (task_id, eating_day_free_txt)
                   VALUES ($1, $2) RETURNING *`;

    const values = [task_id, description];

    const result = await client.query(query, values);

    // Update the task status to 'Finish'
    if (task_id) {
      await client.query(`UPDATE tasks SET task_status = 'Finish' WHERE task_id = $1`, [task_id]);
    }

    client.release();
    res.status(200).json({ message: 'New food entry added successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error inserting new food entry:', error);
    res.status(500).json({ error: 'Database error' });
  }
});



app.get('/api/exercises/:exerciseId', async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const exercise = await pool.query('SELECT * FROM EXERCISES WHERE exercise_id = $1', [exerciseId]);
    res.json(exercise.rows[0]);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/workouts/save', async (req, res) => {
  try {
    const { workoutId, exercises } = req.body;
    console.log('Workout ID:', workoutId);

    // Update or insert exercises for the workout in the database
    for (const exercise of exercises) {
      console.log('Exercise:', exercise)
      // Perform your database operation here
      values = [
        exercise.sets_done || 0,
        exercise.reps_done || 0,
        exercise.last_set_weight || 0,
        exercise.training_id,
        "comleted"
      ]
      await pool.query('UPDATE training SET sets_done = $1, reps_done = $2, last_set_weight = $3 WHERE exercise_id = $4', values);
    }
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    console.log(values);
    console.log('Workout data saved successfully');
    res.status(200).json({ message: 'Workout data saved successfully' });
  } catch (error) {
    console.error('Error saving workout data:', error);
    res.status(500).json({ error: 'Failed to save workout data' });
  }
});




const checkAdmin = (req, res, next) => {
  const adminUserId = req.headers['admin-user-id'];
  // Verify the admin user (add your logic here)
  next();
};


// ########################### ADMIN ROUTES ############################
app.get('/api/admin/users', checkAdmin, async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users where role = $1', ['user']);
    res.json(users.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/users/:userId/workouts', checkAdmin, async (req, res) => {
  const userId = req.params.userId;
  console.log('Fetching workouts for user:', userId);
  const workouts = await pool.query('SELECT * FROM workouts WHERE user_id = $1', [userId]);
  res.json(workouts.rows);
});



app.get('/api/admin/workouts/:workoutId/training', checkAdmin, async (req, res) => {
  try {
    const workoutId = req.params.workoutId;

    // Get training details with exercise name
    const trainingDetails = await pool.query(`
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
    `, [workoutId]);

    res.json(trainingDetails.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
app.delete('/api/admin/training/:trainingId', checkAdmin, async (req, res) => {
  try {
    const { trainingId } = req.params;
    console.log('Deleting training:', trainingId);
    await pool.query('DELETE FROM training WHERE training_id = $1', [trainingId]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting training:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/training/:trainingId', checkAdmin, async (req, res) => {
  const { trainingId } = req.params;
  const { exercise_id, sets_to_do, reps_to_do, goal_weight, manipulation } = req.body;

  try {
    await pool.query(
      'UPDATE training SET exercise_id = $1, sets_to_do = $2, reps_to_do = $3, goal_weight = $4, manipulation = $5 WHERE training_id = $6',
      [exercise_id, sets_to_do, reps_to_do, goal_weight, manipulation, trainingId]
    );
    res.json({ message: 'Training updated successfully' });
  } catch (err) {
    console.error('Error updating training:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



app.get('/api/admin/exercises', checkAdmin, async (req, res) => {
  try {
    const exercises = await pool.query('SELECT exercise_id, exercise_name FROM exercises');
    res.json(exercises.rows);
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

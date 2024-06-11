const express = require('express');
const cors = require('cors');
const multer = require('multer');
const logger = require('./logger');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const storage = multer.memoryStorage();
const port = 5000;
const app = express();
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const nutritionPlanRoutes = require('./routes/nutritionPlanRoutes');
const trackingRoutes = require('./routes/trackingRoutes'); // Add this line

const Joi = require('joi');

require('dotenv').config();


// Multer storage configuration for file uploads


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));


// Import Sequelize config and models
const db = require('./models');

app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', workoutRoutes);
app.use('/api',nutritionPlanRoutes);
// const { Sequelize } = require('sequelize');
app.use('/api', trackingRoutes); // Add this line


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
// const checkTableExists = async (tableName) => {
//   try {
//     const result = await db.sequelize.query(
//       `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = :tableName`,
//       {
//         replacements: { tableName },
//         type: Sequelize.QueryTypes.SELECT,
//       }
//     );

//     if (result.length > 0) {
//       console.log(`Table "${tableName}" exists.`);
//     } else {
//       console.log(`Table "${tableName}" does not exist.`);
//     }
    
//   } catch (error) {
//     console.error('Error checking table existence:', error);
//   } finally {
//     await db.sequelize.close();
//   }
// };

// const getTableColumns = async (tableName) => {
//   try {
//     const result = await db.sequelize.query(
//       `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = :tableName`,
//       {
//         replacements: { tableName },
//         type: Sequelize.QueryTypes.SELECT,
//       }
//     );

//     console.log(`Columns in table "${tableName}":`);
//     result.forEach((column) => {
//       console.log(`- ${column.column_name} (${column.data_type})`);
//     });
//   } catch (error) {
//     console.error('Error fetching table columns:', error);
//   } finally {
//     await db.sequelize.close();
//   }
// };
// getTableColumns('courses');
// // checkTableExists('courses');

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
  // insertPdfToNutritionPlan('nutrition-plans/3.pdf').then(() => {
  //   db.sequelize.close();
  // });
  console.log('Database synced');
});
// General logging middleware to log all requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// generate a function to insert pdf to nutrition table in database
const insertPdfToNutritionPlan = async (pdf) => {
  console.log('Insert PDF to nutrition plan:', pdf)
  try {
    const newPlan = await db.NutritionPlan.create({
      plan_name: 'dinner plan',
      plan_description: 'A plan for dinner meals',
      pdf_link: pdf,
    });

    return newPlan;
  } catch (error) {
    console.error('Error inserting new nutrition plan:', error.message);
    return null;
  }
}


app.get('/api/pdf', (req, res) => {
  console.log('Get PDF file')
  const filePath = path.join(__dirname, 'public/data1.pdf');
  res.sendFile(filePath);
});

const userIdSchema = Joi.object({
  userId: Joi.number().integer().positive().required()
});


// Define the get tasks for a user route
app.get('/api/tasks/:userId', async (req, res) => {
  logger.debug('Get tasks for user');
  const { userId } = req.params;

  const { error } = userIdSchema.validate({ userId });
  if (error) {
    logger.warn('Invalid user ID', req.params);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const tasks = await db.Task.findAll({ where: { user_id: userId } });
    logger.info('Fetched tasks for user ID:', userId);
    res.json(tasks);
  } catch (error) {
    logger.error('Error fetching tasks for user ID:', userId, error.message);
    res.status(500).json({ error: error.message });
  }
});
// const taskSchema = Joi.object({
//   task_status: Joi.string().valid('pending', 'completed', 'failed').required(),
//   task_type: Joi.string().valid('measure', 'food', 'train').required()
// });

// Define the update task status route
app.put('/api/tasks/:taskId', async (req, res) => {
  logger.debug('Update task status', req.body, req.params);
  const { task_status } = req.body;
  const { taskId } = req.params;
  // print the types of taskId and task_status
  console.log('taskId:', typeof taskId, 'task_status:', typeof task_status);
  // const { error } = taskSchema.validate({ task_status, task_type });
  // if (error) {
  //   logger.warn('Invalid input for updating task', req.body, req.params);
  //   return res.status(400).json({ error: error.details[0].message });
  // }

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
  console.log('Get tracking metrics for user ID:', req.params.userId)
  logger.debug('Get tracking metrics for user ID:', req.params.userId);
  const { userId } = req.params;


  const { error } = userIdSchema.validate({ userId });
  if (error) {
    logger.warn('Invalid user ID', req.params);
    return res.status(400).json({ error: error.details[0].message });
  }

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

  const { error } = userIdSchema.validate({ userId });
  if (error) {
    logger.warn('Invalid user ID', req.params);
    return res.status(400).json({ error: error.details[0].message });
  }

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

// Define the add new food entry route
app.post('/api/food-entry', async (req, res) => {
  logger.debug('Add new food entry');
  const { user_id, description, task_id } = req.body;

  try {
    const newEntry = await db.ResultTracking.create({
      task_id,
      eating_day_free_txt: description,
      result_dt: new Date(), // Assuming result_dt is required and you want to set it to the current date
    });
    console.log(newEntry);
    // Update the task status to 'Finish'
    if (task_id) {
      await db.Task.update({ task_status: 'Finish' }, { where: { task_id } });
    }

    logger.info('New food entry added successfully');
    res.status(200).json({ message: 'New food entry added successfully', id: newEntry.result_id });
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
const exerciseSchema = Joi.object({
  training_id: Joi.number().integer().positive().required(),
  sets_done: Joi.number().integer().min(0).optional(),
  reps_done: Joi.number().integer().min(0).optional(),
  last_set_weight: Joi.number().min(0).optional()
});

const workoutSchema = Joi.object({
  workoutId: Joi.number().integer().positive().required(),
  exercises: Joi.array().items(exerciseSchema).required(),
});

// Define the save workout data route
app.post('/api/workouts/save', async (req, res) => {
  logger.debug('Save workout data');
  const { workoutId, exercises } = req.body;

  const { error } = workoutSchema.validate({ workoutId, exercises, task_id });
  if (error) {
    logger.warn('Invalid input for saving workout data', req.body);
    return res.status(400).json({ error: error.details[0].message });
  }

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

app.get('/api/exercises', async (req, res) => {
  logger.debug('Get all exercises');
  try {
    const exercises = await db.Exercise.findAll();
    logger.info('Fetched all exercises');
    res.json(exercises);
  } catch (error) {
    logger.error('Error fetching exercises:', error.message);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

app.get('/api/workouts/:workoutId/exercises', async (req, res) => {
  console.log('Get exercises for workout ID:', req.params.workoutId)
  logger.debug('Get exercises for workout ID:', req.params.workoutId);
  const { workoutId } = req.params;
  try {
    const exercises = await db.Training.findAll({
      where: { workout_id: workoutId },
      include: [{
        model: db.Exercise,
        attributes: ['exercise_name'], // Include only the exercise name from the Exercise table
      }],
    });
    console.log(exercises);
    logger.info('Fetched exercises for workout ID:', workoutId);
    res.json(exercises);
  } catch (error) {
    logger.error('Error fetching exercises for workout ID:', workoutId, error.message);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

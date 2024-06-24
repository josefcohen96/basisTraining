const db = require('../models');
const { Task, Measurement, ResultTracking } = db;
const Joi = require('joi');
const fs = require('fs');
const path = require('path');

const userIdSchema = Joi.object({
  userId: Joi.number().integer().positive().required()
});

exports.getTasksForUser = async (req, res) => {
  console.log('getTasksForUser');
  const { userId } = req.params;
  console.log('userIdTASKSS', userId);
  const { error } = userIdSchema.validate({ userId });

  if (error) {
    console.log('error', error);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const tasks = await Task.findAll({ where: { user_id: userId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { task_status } = req.body;

  try {
    const [updated] = await Task.update({ task_status }, { where: { task_id: taskId } });
    if (updated) {
      const updatedTask = await Task.findOne({ where: { task_id: taskId } });
      res.json(updatedTask);
    } else {
      throw new Error('Task not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrackingMetricsForUser = async (req, res) => {
  const { userId } = req.params;

  const { error } = userIdSchema.validate({ userId });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const measurements = await Measurement.findAll({ where: { user_id: userId } });
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLatestMeasurement = async (req, res) => {
  const { userId } = req.params;

  const { error } = userIdSchema.validate({ userId });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const latestMeasurement = await Measurement.findOne({
      where: { user_id: userId },
      order: [['date', 'DESC']]
    });
    res.json(latestMeasurement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFoodEntry = async (req, res) => {
  const { description, task_id } = req.body;

  try {
    const newEntry = await ResultTracking.create({
      task_id,
      eating_day_free_txt: description,
      result_dt: new Date(), // Assuming result_dt is required and you want to set it to the current date
    });

    // Update the task status to 'Finish'
    if (task_id) {
      await Task.update({ task_status: 'Finish' }, { where: { task_id } });
    }

    res.status(200).json({ message: 'New food entry added successfully', id: newEntry.result_id });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getLastMeasurement = async (req, res) => {
  const { userId } = req.params;
  try {
    const lastMeasurement = await Measurement.findOne({
      where: { user_id: userId },
      order: [['date', 'DESC']],
    });
    if (lastMeasurement) {
      res.json(lastMeasurement);
    } else {
      res.status(404).json({ message: 'No measurements found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLastStepTracking = async (req, res) => {
  const { userId } = req.params;
  try {
    const lastStepTracking = await ResultTracking.findOne({
      where: { user_id: userId },
    });
    if (lastStepTracking) {
      res.json(lastStepTracking);
    } else {
      res.status(404).json({ message: 'No step tracking found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMeasurement = async (req, res) => {
  const { user_id, task_id, ...measurements } = req.body;

  try {
    const measurement = await Measurement.create({
      user_id,
      ...measurements
    });

    if (req.files) {
      req.files.forEach(async (file, index) => {
        const newFileName = `photo${index + 1}`;
        fs.renameSync(file.path, path.join('uploads', file.filename));
        measurement[newFileName] = file.filename;
      });

      await measurement.save();
    }
    // Update the task status int tasks table on the db to 'Finish'
    await Task.update({ task_status: 'Finish' }, { where: { task_id: task_id } });

    res.status(201).json(measurement);
  } catch (error) {
    console.error('Error adding measurement:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateSteps = async (req, res) => {
  const { taskId } = req.params;
  const { steps_to_do, avg_steps, eating_day_free_txt } = req.body;

  try {
    // Update the steps in ResultTracking
    const [updated] = await ResultTracking.update(
      { steps_to_do, avg_steps, eating_day_free_txt },
      { where: { task_id: taskId } }
    );

    if (updated) {
      // Find the updated steps entry
      const updatedSteps = await ResultTracking.findOne({ where: { task_id: taskId } });

      // Update the task status to 'Complete'
      await Task.update({ task_status: 'Finish' }, { where: { task_id: taskId } });

      res.json(updatedSteps);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStepData = async (req, res) => {
  const { taskId } = req.params;

  try {
    const stepData = await ResultTracking.findOne({ where: { task_id: taskId } });
    res.json(stepData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

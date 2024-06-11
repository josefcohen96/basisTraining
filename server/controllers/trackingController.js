// controllers/trackingController.js
const db = require('../models');

// Fetch the last measurement for a specific user
exports.getLastMeasurement = async (req, res) => {
  const { userId } = req.params;
  try {
    const lastMeasurement = await db.Measurement.findOne({
      where: { user_id: userId },
      order: [['date', 'DESC']],
    });
    if (lastMeasurement) {
      console.log("lastMeasurement", lastMeasurement);
      res.json(lastMeasurement);
    } else {
      res.status(404).json({ message: 'No measurements found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch the last step tracking for a specific user
exports.getLastStepTracking = async (req, res) => {
  const { userId } = req.params;
  try {
    const lastStepTracking = await db.ResultTracking.findOne({
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
    const measurement = await db.Measurement.create({
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
    const [updated] = await db.ResultTracking.update(
      { steps_to_do, avg_steps, eating_day_free_txt },
      { where: { task_id: taskId } }
    );

    if (updated) {
      // Find the updated steps entry
      const updatedSteps = await db.ResultTracking.findOne({ where: { task_id: taskId } });

      // Update the task status to 'Complete'
      await db.Task.update({ task_status: 'Finish' }, { where: { task_id: taskId } });

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
    const stepData = await db.ResultTracking.findOne({ where: { task_id: taskId } });
    res.json(stepData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
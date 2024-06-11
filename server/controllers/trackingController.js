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
      console.log("lastMeasurement",lastMeasurement);
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
  console.log("22222222222222",userId)
  try {
    const lastStepTracking = await db.ResultTracking.findOne({
      where: { user_id: userId },
    });
    console.log("11111111",lastStepTracking)
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
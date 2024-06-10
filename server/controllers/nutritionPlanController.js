const db = require('../models');
const path = require('path');

// Create a new nutrition plan
exports.createNutritionPlan = async (req, res) => {
  const { userId } = req.params;
  const { plan_name, plan_description } = req.body;
  const file = req.file; // This is the uploaded file

  try {
    const filePath = file ? path.join('public', file.filename) : null;
    const newPlan = await db.NutritionPlan.create({
      user_id: userId,
      plan_name,
      plan_description,
      pdf_link: filePath,
    });
    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating nutrition plan:', error.message);
    res.status(500).json({ error: 'Failed to create nutrition plan' });
  }
};

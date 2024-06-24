const db = require('../models');
const path = require('path');

// Create a new nutrition plan
exports.createNutritionPlan = async (req, res) => {
  console.log('Creating nutrition plan');
  const { userId } = req.params;
  const { plan_name, plan_description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const pdf_link = file.path;
    const newPlan = await db.NutritionPlan.create({
      user_id: userId,
      plan_name,
      plan_description,
      pdf_link,
    });
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Fetch all nutrition plans
exports.getAllNutritionPlans = async (req, res) => {
  try {
    const plans = await db.NutritionPlan.findAll();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Fetch a single nutrition plan by ID
exports.getNutritionPlanById = async (req, res) => {
  const { planId } = req.params;
  try {
    const plan = await db.NutritionPlan.findOne({ where: { plan_id: planId } });
    console.log("plannnnnnnnn", plan);
    if (plan) {
      res.status(200).json(plan);
    } else {
      res.status(404).json({ error: 'Nutrition plan not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Fetch the PDF file for a nutrition plan by ID
exports.getNutritionPlanPdf = async (req, res) => {
  const { planId } = req.params;
  try {
    const nutritionPlan = await db.NutritionPlan.findByPk(planId);
    if (!nutritionPlan || !nutritionPlan.pdf_link) {
      return res.status(404).json({ error: 'Nutrition plan not found or PDF link missing' });
    }
    const pdfPath = path.join(__dirname, '..', nutritionPlan.pdf_link);
    res.sendFile(pdfPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNutritionPlansByUserId = async (req, res) => {
  const { userId } = req.params;
  console.log("userId", userId)
  try {
    const plans = await db.NutritionPlan.findAll({ where: { user_id: userId } });
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};
const db = require('../models');
const path = require('path');
const fs = require('fs');

// Create a new nutrition plan
exports.createNutritionPlan = async (req, res) => {
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
    const plan = await db.NutritionPlan.findByPk(planId);
    if (plan) {
      res.status(200).json(plan);
    } else {
      res.status(404).json({ error: 'Nutrition plan not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

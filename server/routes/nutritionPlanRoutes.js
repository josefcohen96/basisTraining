const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const nutritionPlanController = require('../controllers/nutritionPlanController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to create a new nutrition plan
router.post('/users/:userId/nutrition', upload.single('file'), nutritionPlanController.createNutritionPlan);

module.exports = router;

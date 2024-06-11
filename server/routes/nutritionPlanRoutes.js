const express = require('express');
const router = express.Router();
const multer = require('multer');
const nutritionPlanController = require('../controllers/nutritionPlanController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/users/:userId/nutrition', upload.single('file'), nutritionPlanController.createNutritionPlan);
router.get('/nutrition-plans', nutritionPlanController.getAllNutritionPlans);
router.get('/nutrition-plans/:planId', nutritionPlanController.getNutritionPlanById);

module.exports = router;

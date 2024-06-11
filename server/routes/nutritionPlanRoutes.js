const express = require('express');
const router = express.Router();
const nutritionPlanController = require('../controllers/nutritionPlanController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/nutrition-plans/:userId', upload.single('file'), nutritionPlanController.createNutritionPlan);
router.get('/nutrition-plans', nutritionPlanController.getAllNutritionPlans);
router.get('/nutrition-plans/:planId', nutritionPlanController.getNutritionPlanById);
router.get('/nutrition-plans/:planId/pdf', nutritionPlanController.getNutritionPlanPdf);

module.exports = router;

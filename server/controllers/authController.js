const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const UserDetail = db.UserDetail;
const Task = db.Task;
// const logger = require('../logger');

const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';

exports.register = async (req, res) => {
  const {
    name, email, password, phone, age, height, weight, trainingYears, trainingFrequency, preferredTrainingLocation,
    homeEquipment, desiredEquipment, strengthTrainingDescription, preferredFocusAreas, favoriteCardio,
    currentCardioRoutine, injuries, highestWeight, favoriteFoods, dislikedFoods, foodTrackingMethod, pastDiets,
    dailyNutrition, weekendNutrition, favoriteRecipes, alcoholConsumption, medications, sleepHours, currentJob,
    activityLevel, sportsParticipation, mirrorReflection, longTermGoals, motivationLevel, commitmentDeclaration,
    additionalNotes, medicalStatement, signature, termsAccepted, mailingAccepted
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const userId = newUser.user_id;
    const token = jwt.sign({ id: userId, email: newUser.email }, secretKey, { expiresIn: '1h' });

    await UserDetail.create({
      user_id: userId,
      phone,
      age,
      height,
      weight,
      training_years: trainingYears,
      training_frequency: trainingFrequency,
      preferred_training_location: preferredTrainingLocation,
      home_equipment: homeEquipment,
      desired_equipment: desiredEquipment,
      strength_training_description: strengthTrainingDescription,
      preferred_focus_areas: preferredFocusAreas,
      favorite_cardio: favoriteCardio,
      current_cardio_routine: currentCardioRoutine,
      injuries,
      highest_weight: highestWeight,
      favorite_foods: favoriteFoods,
      disliked_foods: dislikedFoods,
      food_tracking_method: foodTrackingMethod,
      past_diets: pastDiets,
      daily_nutrition: dailyNutrition,
      weekend_nutrition: weekendNutrition,
      favorite_recipes: favoriteRecipes,
      alcohol_consumption: alcoholConsumption,
      medications,
      sleep_hours: sleepHours,
      current_job: currentJob,
      activity_level: activityLevel,
      sports_participation: sportsParticipation,
      mirror_reflection: mirrorReflection,
      long_term_goals: longTermGoals,
      motivation_level: motivationLevel,
      commitment_declaration: commitmentDeclaration,
      additional_notes: additionalNotes,
      medical_statement: JSON.stringify(medicalStatement),
      signature,
      terms_accepted: termsAccepted,
      mailing_accepted: mailingAccepted
    });

    const tasks = [
      {
        user_id: userId,
        task_name: 'יומן תזונה יום ראשון',
        task_description: 'This is your first welcome task. Get familiar with our platform.',
        task_status: 'Pending',
        task_type: 'food',
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: userId,
        task_name: 'יומן תזונה יום שני',
        task_description: 'This is your second welcome task. Complete your profile.',
        task_status: 'Pending',
        task_type: 'food',
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: userId,
        task_name: 'יומן תזונה יום שלישי',
        task_description: 'This is your third welcome task. Set your fitness goals.',
        task_status: 'Pending',
        task_type: 'food',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        user_id: userId,
        task_name: 'מדידת היקפים',
        task_description: 'This is your fourth welcome task. Start tracking your progress.',
        task_status: 'Pending',
        task_type: 'measure',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const task of tasks) {
      await Task.create(task);
    }

    res.status(201).json({ newUser, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { email } });
//     if (user && await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign({ id: user.user_id, email: user.email }, secretKey, { expiresIn: '1h' });
//       res.json({ id: user.user_id, name: user.name, email: user.email, role: user.role, token });
//     } else {
//       res.status(400).json({ error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ id: user.user_id, name: user.name, email: user.email, role: user.role, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
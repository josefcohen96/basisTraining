import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const Register = () => {
  const [step, setStep] = useState(1);  // Track current step
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    height: '',
    weight: '',
    trainingYears: '',
    trainingFrequency: '',
    preferredTrainingLocation: '',
    homeEquipment: '',
    desiredEquipment: '',
    strengthTrainingDescription: '',
    preferredFocusAreas: '',
    favoriteCardio: '',
    currentCardioRoutine: '',
    injuries: '',
    highestWeight: '',
    favoriteFoods: '',
    dislikedFoods: '',
    foodTrackingMethod: '',
    pastDiets: '',
    dailyNutrition: '',
    weekendNutrition: '',
    favoriteRecipes: '',
    alcoholConsumption: '',
    medications: '',
    sleepHours: '',
    currentJob: '',
    activityLevel: '',
    sportsParticipation: '',
    mirrorReflection: '',
    longTermGoals: '',
    motivationLevel: '',
    commitmentDeclaration: '',
    additionalNotes: ''
  });

  useEffect(() => {
    // Clear session storage when the component mounts
    sessionStorage.clear();
  }, []);

  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log(response.data);
      navigate('/login'); // Redirect to login after successful registration
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-8">
        <div className="form-container">
          <h2 className="text-center">הרשמה</h2>
          {/* {step === 1 && ( */}
            <form onSubmit={handleNext}>
              <div className="form-group">
                <label htmlFor="name">שם</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">כתובת אימייל</label>
                <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">סיסמה</label>
                <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">מספר טלפון</label>
                <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="age">גיל</label>
                <input type="number" className="form-control" id="age" name="age" value={formData.age} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">הבא</button>
              <div className="text-center mt-3">
                כבר נרשמת ? <Link to="/login">התחבר</Link>
              </div>
            </form>
          {/* )} */}
          {/* {step === 2 && (
            <form onSubmit={handleNext}>
              <div className="form-group">
                <label htmlFor="height">גובה</label>
                <input type="number" className="form-control" id="height" name="height" value={formData.height} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="weight">משקל נוכחי</label>
                <input type="number" className="form-control" id="weight" name="weight" value={formData.weight} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="trainingYears">כמה שנים אתה מתאמן?</label>
                <input type="number" className="form-control" id="trainingYears" name="trainingYears" value={formData.trainingYears} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="trainingFrequency">כמה פעמים אתה מתאמן בשבוע?</label>
                <input type="number" className="form-control" id="trainingFrequency" name="trainingFrequency" value={formData.trainingFrequency} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="preferredTrainingLocation">איפה אתה מעדיף להתאמן? (בבית או בחדכ כושר)</label>
                <input type="text" className="form-control" id="preferredTrainingLocation" name="preferredTrainingLocation" value={formData.preferredTrainingLocation} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">הבא</button>
              <button type="button" className="btn btn-secondary btn-block" onClick={handleBack}>חזור</button>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleNext}>
              <div className="form-group">
                <label htmlFor="homeEquipment">אם בחרת בבית - איזה אביזרים יש ברשותך?</label>
                <textarea className="form-control" id="homeEquipment" name="homeEquipment" value={formData.homeEquipment} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="desiredEquipment">אם בחרת בבית - איזה אביזרים תרצה לרכוש מהרשימה שלא ברשותך כרגע (מומלץ TRX או סט משקולות קטן)</label>
                <textarea className="form-control" id="desiredEquipment" name="desiredEquipment" value={formData.desiredEquipment} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="strengthTrainingDescription">תאר את אימוני הכח שלך כרגע (איזה תרגילים עושה,טווחי חזרות,תדירות וכו…): אם לא עושה לרשום ׳לא עושה׳</label>
                <textarea className="form-control" id="strengthTrainingDescription" name="strengthTrainingDescription" value={formData.strengthTrainingDescription} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="preferredFocusAreas">איזה אזורים אתה מעדיף שיקבלו יותר דגש בתכנית האימונים האישית שלך?</label>
                <textarea className="form-control" id="preferredFocusAreas" name="preferredFocusAreas" value={formData.preferredFocusAreas} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="favoriteCardio">מה האימון אירובי האהוב עליך?(אם יש)</label>
                <input type="text" className="form-control" id="favoriteCardio" name="favoriteCardio" value={formData.favoriteCardio} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">הבא</button>
              <button type="button" className="btn btn-secondary btn-block" onClick={handleBack}>חזור</button>
            </form>
          )}
          {step === 4 && (
            <form onSubmit={handleNext}>
              <div className="form-group">
                <label htmlFor="currentCardioRoutine">תאר את אימוני האירובי שלך כרגע(כמה זמן כל אימון וכמה פעמים בשבוע)</label>
                <textarea className="form-control" id="currentCardioRoutine" name="currentCardioRoutine" value={formData.currentCardioRoutine} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="injuries">האם יש לך פציעות או מגבלות פיזיות?</label>
                <textarea className="form-control" id="injuries" name="injuries" value={formData.injuries} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="highestWeight">המשקל הכי גבוה שהיית בו במהלך חייך</label>
                <input type="text" className="form-control" id="highestWeight" name="highestWeight" value={formData.highestWeight} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="favoriteFoods">מהם המאכלים האהובים עליך?</label>
                <textarea className="form-control" id="favoriteFoods" name="favoriteFoods" value={formData.favoriteFoods} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="dislikedFoods">מהם המאכלים שלא תיגע בהם?</label>
                <textarea className="form-control" id="dislikedFoods" name="dislikedFoods" value={formData.dislikedFoods} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">הבא</button>
              <button type="button" className="btn btn-secondary btn-block" onClick={handleBack}>חזור</button>
            </form>
          )}
          {step === 5 && (
            <form onSubmit={handleNext}>
              <div className="form-group">
                <label htmlFor="foodTrackingMethod">האם אתה סופר את המזון שלך? במידה וכן, האם באפליקציה או כתפריט?</label>
                <textarea className="form-control" id="foodTrackingMethod" name="foodTrackingMethod" value={formData.foodTrackingMethod} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="pastDiets">האם עשית דיאטות בעבר? האם הן היו מוצלחות?</label>
                <textarea className="form-control" id="pastDiets" name="pastDiets" value={formData.pastDiets} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="dailyNutrition">תאר סדר יום מלא של התזונה שלך כרגע, איך נראה יום רגיל</label>
                <textarea className="form-control" id="dailyNutrition" name="dailyNutrition" value={formData.dailyNutrition} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="weekendNutrition">ועכשיו איך נראה סופש אם יש ארוחה מיוחדת בשישי ושבת ומה הן מכילות לרוב</label>
                <textarea className="form-control" id="weekendNutrition" name="weekendNutrition" value={formData.weekendNutrition} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="favoriteRecipes">יש לך מתכונים שאתה אוהב להכין באופן תדיר נגיד אחת לשבוע? אם כן תרשום את כל המצרכים שלהם כמויות וכמה יחידות יוצא למשל מתכון לממולאים וכמה יחידות יוצא מתוך כל התכולה (אפשר לרשום כמה מתכונים)</label>
                <textarea className="form-control" id="favoriteRecipes" name="favoriteRecipes" value={formData.favoriteRecipes} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">הבא</button>
              <button type="button" className="btn btn-secondary btn-block" onClick={handleBack}>חזור</button>
            </form>
          )}
          {step === 6 && (
            <form onSubmit={handleNext}>
              <div className="form-group">
                <label htmlFor="alcoholConsumption">האם אתה שותה אלכוהול? אם כן, באיזה כמויות ותדירות?</label>
                <textarea className="form-control" id="alcoholConsumption" name="alcoholConsumption" value={formData.alcoholConsumption} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="medications">תרופות ומרשמים שאתה משתמש כרגע ובעבר?</label>
                <textarea className="form-control" id="medications" name="medications" value={formData.medications} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="sleepHours">כמה שעות אתה ישן ביום?</label>
                <input type="text" className="form-control" id="sleepHours" name="sleepHours" value={formData.sleepHours} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="currentJob">במה אתה עובד כרגע ומה השעות עבודה שלך?(האם עבודה יושבנית?)</label>
                <textarea className="form-control" id="currentJob" name="currentJob" value={formData.currentJob} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="activityLevel">כמה פעיל אתה בכל יום בממוצע? (תזוזתי?)</label>
                <textarea className="form-control" id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">הבא</button>
              <button type="button" className="btn btn-secondary btn-block" onClick={handleBack}>חזור</button>
            </form>
          )}
          {step === 7 && (
            <form onSubmit={handleNext}>
              <div className="form-group">
                <label htmlFor="sportsParticipation">האם אתה משתתף באיזשהו ספורט כרגע?</label>
                <textarea className="form-control" id="sportsParticipation" name="sportsParticipation" value={formData.sportsParticipation} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="mirrorReflection">כאשר אתה מסתכל במראה מה אתה מרגיש?</label>
                <textarea className="form-control" id="mirrorReflection" name="mirrorReflection" value={formData.mirrorReflection} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="longTermGoals">מהן המטרות שלך לטווח הארוך ולמה?</label>
                <textarea className="form-control" id="longTermGoals" name="longTermGoals" value={formData.longTermGoals} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="motivationLevel">מהי רמת המוטיבציה שלך להגיע למטרה?</label>
                <textarea className="form-control" id="motivationLevel" name="motivationLevel" value={formData.motivationLevel} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="commitmentDeclaration">האם הנך מתחייב על הצהרה ושקיפות של כל שימוש בחומרים אסורים לפני תחילת העבודה המשותפת ובמהלכה? הכוונה לחומרים כמו סטרואידים אנבולים וכדומה</label>
                <textarea className="form-control" id="commitmentDeclaration" name="commitmentDeclaration" value={formData.commitmentDeclaration} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">הבא</button>
              <button type="button" className="btn btn-secondary btn-block" onClick={handleBack}>חזור</button>
            </form>
          )} */}
          {/* {step === 8 && ( */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="additionalNotes">דברים שתרצה להוסיף?</label>
                <textarea className="form-control" id="additionalNotes" name="additionalNotes" value={formData.additionalNotes} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">הרשמה</button>
              <button type="button" className="btn btn-secondary btn-block" onClick={handleBack}>חזור</button>
            </form>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default Register;

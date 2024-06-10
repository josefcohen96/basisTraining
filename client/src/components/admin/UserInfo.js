import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserInfo.css';
import { Link } from 'react-router-dom';


const UserInfo = () => {
  const { userId } = useParams();
  console.log(userId)
  const [documents, setDocuments] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showNutritionForm, setShowNutritionForm] = useState(false);

  const [task, setTask] = useState({
    task_name: '',
    due_date: '',
    task_type: '',
    task_description: '',
  });

  const [plan, setPlan] = useState({
    plan_name: '',
    plan_description: '',
    file: null,
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}/nispahim`);
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, [userId]);

  const handleTaskInputChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/admin/users/${userId}/tasks`, task);
      alert('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handlePlanInputChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPlan({ ...plan, file: e.target.files[0] });
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('plan_name', plan.plan_name);
    formData.append('plan_description', plan.plan_description);
    formData.append('file', plan.file);
  
    try {
      await axios.post(`http://localhost:5000/api/admin/users/${userId}/nutrition`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Nutrition plan added successfully');
    } catch (error) {
      console.error('Error adding nutrition plan:', error);
    }
  };

  return (
    <div className="container">
      <h1>מסך משתמש</h1>
      <div className="row">
        <div className="card">
          <h2>מעקב מאמן</h2>
          <Link to={`/trainersMange?userId=${userId}`}>ניהול אימון</Link>
        </div>
        <div className="card">
          <h2>הוספת משימות</h2>
          <button onClick={() => setShowTaskForm(!showTaskForm)}>
            {showTaskForm ? 'סגור' : 'פתח טופס'}
          </button>
          {showTaskForm && (
            <form onSubmit={handleTaskSubmit}>
              <label>שם המשימה:</label>
              <input type="text" name="task_name" value={task.task_name} onChange={handleTaskInputChange} required />
              <label>תאריך לביצוע:</label>
              <input type="date" name="due_date" value={task.due_date} onChange={handleTaskInputChange} required />
              <label>סוג משימה:</label>
              <select name="task_type" value={task.task_type} onChange={handleTaskInputChange} required>
                <option value="" disabled>בחר סוג משימה</option>
                <option value="food">Food</option>
                <option value="measure">Measure</option>
              </select>
              <label>תיאור משימה:</label>
              <textarea name="task_description" value={task.task_description} onChange={handleTaskInputChange} required />
              <button type="submit">הוסף משימה</button>
            </form>
          )}
        </div>
        <div className="card">
          <h2>מסמכים</h2>
          {documents.map(doc => (
            <p key={doc.id}>{doc.name}</p>
          ))}
        </div>
      </div>
      <div className="row">
        <div className="card">
          <h2>הוספת תוכנית תזונה</h2>
          <button onClick={() => setShowNutritionForm(!showNutritionForm)}>
            {showNutritionForm ? 'סגור' : 'פתח טופס'}
          </button>
          {showNutritionForm && (
            <form onSubmit={handlePlanSubmit}>
              <label>Plan Name:</label>
              <input type="text" name="plan_name" value={plan.plan_name} onChange={handlePlanInputChange} required />
              <label>Plan Description:</label>
              <textarea name="plan_description" value={plan.plan_description} onChange={handlePlanInputChange} required />
              <label>Upload PDF:</label>
              <input type="file" name="file" accept="application/pdf" onChange={handleFileChange} required />
              <button type="submit">Add Plan</button>
            </form>
          )}
        </div>
        <div className="card">
          <h2>להציג היסטוריית אימונים ומדדים</h2>
          {/* Leave this empty for now */}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

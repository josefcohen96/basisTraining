// AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserList, setShowUserList] = useState(false);

  const [newExercise, setNewExercise] = useState({
    exercise_name: '',
    exercise_area: '',
    exercise_description: '',
    exercise_video: null
  });
  const [newEmail, setNewEmail] = useState('');

  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (user) => {
    navigate(`/user/${user.user_id}`);
  };

  const handleExerciseChange = (e) => {
    setNewExercise({ ...newExercise, [e.target.name]: e.target.value });
  };

  const handleExerciseFileChange = (e) => {
    setNewExercise({ ...newExercise, exercise_video: e.target.files[0] });
  };

  const handleExerciseSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('exercise_name', newExercise.exercise_name);
    formData.append('exercise_area', newExercise.exercise_area);
    formData.append('exercise_description', newExercise.exercise_description);
    formData.append('exercise_video', newExercise.exercise_video);

    try {
      await axios.post('http://localhost:5000/api/admin/exercises', formData);
      setNewExercise({ exercise_name: '', exercise_area: '', exercise_description: '', exercise_video: null });
      setShowExerciseForm(false); // Hide form after submission
    } catch (err) {
      console.error('Error adding exercise:', err);
    }
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/approved_emails', { email: newEmail });
      setNewEmail('');
      setShowEmailForm(false); // Hide form after submission
    } catch (err) {
      console.error('Error adding email:', err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="mt-4 text-center">מסך ניהול אדמין</h1>
      <div className="form-group text-center">
        <label htmlFor="userSearch">חפש משתמש:</label>
        <input
          type="text"
          className="form-control"
          id="userSearch"
          placeholder="הקלד שם משתמש"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowUserList(true);
          }}
          onClick={() => setShowUserList(true)}
          onBlur={() => setTimeout(() => setShowUserList(false), 200)}
        />
        {showUserList && (
          <ul className="user-list">
            {filteredUsers.map(user => (
              <li key={user.user_id} onClick={() => handleUserSelect(user)}>
                {user.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section">
        <button className="btn btn-primary" onClick={() => setShowExerciseForm(!showExerciseForm)}>
          {showExerciseForm ? 'Hide Add Exercise Form' : 'Show Add Exercise Form'}
        </button>
        {showExerciseForm && (
          <div className="card mt-3">
            <div className="card-body">
              <h4>הוסף תרגיל חדש</h4>
              <form onSubmit={handleExerciseSubmit}>
                <div className="form-group">
                  <label htmlFor="exercise_name">Exercise Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exercise_name"
                    name="exercise_name"
                    value={newExercise.exercise_name}
                    onChange={handleExerciseChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exercise_area">Area</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exercise_area"
                    name="exercise_area"
                    value={newExercise.exercise_area}
                    onChange={handleExerciseChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exercise_description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exercise_description"
                    name="exercise_description"
                    value={newExercise.exercise_description}
                    onChange={handleExerciseChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exercise_video">Video</label>
                  <input
                    type="file"
                    className="form-control"
                    id="exercise_video"
                    name="exercise_video"
                    onChange={handleExerciseFileChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success">Add Exercise</button>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="section">
        <button className="btn btn-primary" onClick={() => setShowEmailForm(!showEmailForm)}>
          {showEmailForm ? 'Hide Add Email Form' : 'Show Add Email Form'}
        </button>
        {showEmailForm && (
          <div className="card mt-3">
            <div className="card-body">
              <h4>הוסף כתובת אימייל מאושרת</h4>
              <form onSubmit={handleEmailSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={newEmail}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success">Add Email</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

// src/components/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]); // State for expanded rows
  const [trainingDetails, setTrainingDetails] = useState({}); // State for training details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTrainingId, setEditingTrainingId] = useState(null);
  const [editingTrainingData, setEditingTrainingData] = useState({});
  const [exercises, setExercises] = useState([]); // State for exercises

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users'); // Adjust the endpoint as needed
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/exercises'); // Adjust the endpoint as needed
        setExercises(response.data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchWorkouts = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/admin/users/${selectedUser}/workouts`); // Adjust the endpoint as needed
          setWorkouts(response.data);
        } catch (err) {
          setError(err);
        }
      };

      fetchWorkouts();
    }
  }, [selectedUser]);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setWorkouts([]); // Clear previous workouts when a new user is selected
    setExpandedRows([]); // Clear expanded rows state when a new user is selected
    setTrainingDetails({}); // Clear training details state when a new user is selected
  };

  const toggleRowExpansion = async (workoutId) => {
    const currentIndex = expandedRows.indexOf(workoutId);
    const newExpandedRows = [...expandedRows];

    if (currentIndex === -1) {
      newExpandedRows.push(workoutId);
      // Fetch training details for this workout
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/workouts/${workoutId}/training`);
        setTrainingDetails(prevDetails => ({ ...prevDetails, [workoutId]: response.data }));
      } catch (err) {
        console.error('Error fetching training details:', err);
      }
    } else {
      newExpandedRows.splice(currentIndex, 1);
    }

    setExpandedRows(newExpandedRows);
  };

  const handleEdit = (training) => {
    setEditingTrainingId(training.training_id);
    setEditingTrainingData({ ...training });
  };

  const handleInputChange = (e, field) => {
    setEditingTrainingData({ ...editingTrainingData, [field]: e.target.value });
  };

  const handleSave = async (trainingId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/training/${trainingId}`, editingTrainingData);
      setTrainingDetails(prevDetails => {
        const newDetails = { ...prevDetails };
        Object.keys(newDetails).forEach(key => {
          newDetails[key] = newDetails[key].map(training =>
            training.training_id === trainingId ? { ...editingTrainingData } : training
          );
        });
        return newDetails;
      });
      setEditingTrainingId(null);
    } catch (err) {
      console.error('Error saving training details:', err);
    }
  };

  const handleDelete = async (trainingId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this exercise?');
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/training/${trainingId}`);
        setTrainingDetails(prevDetails => {
          const newDetails = { ...prevDetails };
          Object.keys(newDetails).forEach(key => {
            newDetails[key] = newDetails[key].filter(training => training.training_id !== trainingId);
          });
          return newDetails;
        });
      } catch (err) {
        console.error('Error deleting training:', err);
      }
    }
  };
  const handleAddWorkout = async () => {
    try {
      await axios.post(`http://localhost:5000/api/admin/addWorkout`);
    } catch (err) {
      console.error('Error adding workout:', err);
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container">
      <h1 className="mt-4">מסך בקרה אדמין</h1>
      <div className="form-group">
        <label htmlFor="userSelect">בחר משתמש:</label>
        <select className="form-control" id="userSelect" onChange={handleUserChange} value={selectedUser || ''}>
          <option value="" disabled>בחר משתמש</option>
          {users.map(user => (
            <option key={user.id} value={user.user_id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      {selectedUser && (
        <div>
          <h2>פרטי משתמש</h2>

          <h3>אימונים קיימים</h3>
          {workouts.map(workout => (
            <div className="card mb-4" key={workout.workout_id}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">{workout.workout_name}</h4>
                <button className="btn btn-link" onClick={() => toggleRowExpansion(workout.workout_id)}>
                  {expandedRows.includes(workout.workout_id) ? '▼' : '▶'}
                </button>



              </div>
              <div className="card-body">
                <p>{workout.workout_description}</p>
                <p>תאריך: {workout.scheduled_date || 'N/A'}</p>
                <p>מצב: {workout.status || 'N/A'}</p>
                {expandedRows.includes(workout.workout_id) && (
                  <div className="expanded-content">
                    <h4>פרטים נוספים</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Exercise Name</th>
                          <th>Sets to Do</th>
                          <th>Reps to Do</th>
                          <th>Goal Weight</th>
                          <th>Manipulation</th>
                          <th>Sets Done</th>
                          <th>Reps Done</th>
                          <th>Last Set Weight</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainingDetails[workout.workout_id] && trainingDetails[workout.workout_id].map(training => (
                          <tr key={training.training_id}>
                            {editingTrainingId === training.training_id ? (
                              <>
                                <td>
                                  <select className="form-control" value={editingTrainingData.exercise_id} onChange={(e) => handleInputChange(e, 'exercise_id')}>
                                    {exercises.map(exercise => (
                                      <option key={exercise.exercise_id} value={exercise.exercise_id}>
                                        {exercise.exercise_name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td><input className="form-control" type="number" value={editingTrainingData.sets_to_do} onChange={(e) => handleInputChange(e, 'sets_to_do')} /></td>
                                <td><input className="form-control" type="number" value={editingTrainingData.reps_to_do} onChange={(e) => handleInputChange(e, 'reps_to_do')} /></td>
                                <td><input className="form-control" type="number" value={editingTrainingData.goal_weight} onChange={(e) => handleInputChange(e, 'goal_weight')} /></td>
                                <td>
                                  <select className="form-control" value={editingTrainingData.manipulation} onChange={(e) => handleInputChange(e, 'manipulation')}>
                                    <option value="super set">Super Set</option>
                                    <option value="regular">Regular</option>
                                  </select>
                                </td>
                                <td>{training.sets_done}</td>
                                <td>{training.reps_done}</td>
                                <td>{training.last_set_weight}</td>
                                <td>
                                  <FontAwesomeIcon icon={faSave} onClick={() => handleSave(training.training_id)} />
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{training.exercise_name}</td>
                                <td>{training.sets_to_do}</td>
                                <td>{training.reps_to_do}</td>
                                <td>{training.goal_weight}</td>
                                <td>{training.manipulation}</td>
                                <td>{training.sets_done}</td>
                                <td>{training.reps_done}</td>
                                <td>{training.last_set_weight}</td>
                                <td>
                                  <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(training)} />
                                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(training.training_id)} />
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                  </div>
                )}

              </div>

            </div>

          ))}
          <button className="btn btn-link" onClick={() => handleAddWorkout()}>הוסף אימון</button>

        </div>

      )}
    </div>
  );
};

export default AdminDashboard;

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

  const [newWorkout, setNewWorkout] = useState({
    workout_name: '',
    workout_description: '',
    scheduled_date: '',
    status: 'pending'
  });
  const [newTraining, setNewTraining] = useState([]); // State for new training entries
  const [showNewWorkoutForm, setShowNewWorkoutForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [showUserList, setShowUserList] = useState(false); // State for showing the user list

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

  const handleUserChange = (user) => {
    setSelectedUser(user.user_id);
    setSearchQuery(user.name);
    setShowUserList(false); // Hide the user list after selection
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

  const handleNewWorkoutChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const handleNewTrainingChange = (index, e) => {
    const updatedTraining = [...newTraining];
    updatedTraining[index] = { ...updatedTraining[index], [e.target.name]: e.target.value };
    setNewTraining(updatedTraining);
  };

  const handleAddTraining = () => {
    setNewTraining([...newTraining, { exercise_id: '', sets_to_do: '', reps_to_do: '', goal_weight: '', manipulation: '' }]);
  };

  const handleRemoveTraining = (index) => {
    const updatedTraining = newTraining.filter((_, i) => i !== index);
    setNewTraining(updatedTraining);
  };

  const handleNewWorkoutSubmit = async (e) => {
    e.preventDefault();
    // Validation for Super Set
    for (let i = 0; i < newTraining.length; i++) {
      if (newTraining[i].manipulation === 'super set' && (i === newTraining.length - 1 || newTraining[i + 1].manipulation === 'super set')) {
        alert('Each Super Set exercise must be followed by another exercise.');
        return;
      }
    }

    try {
      const requestBody = {
        workout_name: newWorkout.workout_name,
        workout_description: newWorkout.workout_description,
        scheduled_date: newWorkout.scheduled_date,
        status: newWorkout.status,
        training: newTraining // Ensure this is correctly formatted
      };

      const response = await axios.post(`http://localhost:5000/api/admin/users/${selectedUser}/workouts`, requestBody);
      const newWorkoutId = response.data.workout_id;

      await Promise.all(newTraining.map(training =>
        axios.post(`http://localhost:5000/api/admin/workouts/${newWorkoutId}/training`, {
          ...training,
          workout_id: newWorkoutId
        })
      ));

      // Add the new workout to the user's tasks table
      await axios.post(`http://localhost:5000/api/admin/users/${selectedUser}/tasks`, {
        task_type: 'workout',
        task_description: `Workout: ${newWorkout.workout_name}`,
        related_id: newWorkoutId
      });

      setWorkouts([...workouts, { ...requestBody, workout_id: newWorkoutId }]); // Add the new workout to the state
      setNewWorkout({ workout_name: '', workout_description: '', scheduled_date: '', status: 'pending' });
      setNewTraining([]); // Clear new training entries
      setShowNewWorkoutForm(false);
    } catch (err) {
      console.error('Error creating new workout:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container">
      <div className="header-section">
        <h1 className="mt-4 text-center">מסך ניהול אימונים</h1>
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
              setShowUserList(true); // Show the user list when typing
            }}
            onClick={() => setShowUserList(true)} // Show the list when the input is clicked
            onBlur={() => setTimeout(() => setShowUserList(false), 200)} // Hide the list on blur with a slight delay
          />
          {showUserList && (
            <ul className="user-list">
              {filteredUsers.map(user => (
                <li key={user.id} onClick={() => handleUserChange(user)}>
                  {user.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {selectedUser && (
        <div className="workouts-section">
          <h2>פרטי משתמש</h2>
          <h3>אימונים קיימים</h3>
          <button className="btn btn-primary mb-3" onClick={() => setShowNewWorkoutForm(!showNewWorkoutForm)}>
            {showNewWorkoutForm ? 'בטל' : 'הוסף אימון חדש'}
          </button>
          {showNewWorkoutForm && (
            <form onSubmit={handleNewWorkoutSubmit}>
              <div className="form-group">
                <label htmlFor="workoutName">שם האימון:</label>
                <input
                  type="text"
                  className="form-control"
                  id="workoutName"
                  name="workout_name"
                  value={newWorkout.workout_name}
                  onChange={handleNewWorkoutChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="workoutDescription">תיאור האימון:</label>
                <input
                  type="text"
                  className="form-control"
                  id="workoutDescription"
                  name="workout_description"
                  value={newWorkout.workout_description}
                  onChange={handleNewWorkoutChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="scheduledDate">תאריך מתוכנן:</label>
                <input
                  type="date"
                  className="form-control"
                  id="scheduledDate"
                  name="scheduled_date"
                  value={newWorkout.scheduled_date}
                  onChange={handleNewWorkoutChange}
                  required
                />
              </div>

              <div className="add-exercise-section">
                <h4>הוסף תרגילים</h4>
                {newTraining.map((training, index) => (
                  <div key={index} className="form-group">
                    <label htmlFor={`exercise_${index}`}>תרגיל:</label>
                    <select
                      className="form-control"
                      id={`exercise_${index}`}
                      name="exercise_id"
                      value={training.exercise_id}
                      onChange={(e) => handleNewTrainingChange(index, e)}
                      required
                    >
                      <option value="" disabled>בחר תרגיל</option>
                      {exercises.map(exercise => (
                        <option key={exercise.exercise_id} value={exercise.exercise_id}>
                          {exercise.exercise_name}
                        </option>
                      ))}
                    </select>
                    <label htmlFor={`sets_to_do_${index}`}>סטים לביצוע:</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`sets_to_do_${index}`}
                      name="sets_to_do"
                      value={training.sets_to_do}
                      onChange={(e) => handleNewTrainingChange(index, e)}
                      required
                    />
                    <label htmlFor={`reps_to_do_${index}`}>חזרות לביצוע:</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`reps_to_do_${index}`}
                      name="reps_to_do"
                      value={training.reps_to_do}
                      onChange={(e) => handleNewTrainingChange(index, e)}
                      required
                    />
                    <label htmlFor={`goal_weight_${index}`}>משקל יעד:</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`goal_weight_${index}`}
                      name="goal_weight"
                      value={training.goal_weight}
                      onChange={(e) => handleNewTrainingChange(index, e)}
                      required
                    />
                    <label htmlFor={`trainer_exp${index}`}>תיאור תרגיל</label>
                    <input
                      type="text"
                      className="form-control"
                      id={`trainer_exp${index}`}
                      name="trainer_exp"
                      value={training.trainer_exp}
                      onChange={(e) => handleNewTrainingChange(index, e)}
                      required
                    />
                    <label htmlFor={`manipulation_${index}`}>מניפולציה:</label>
                    <select
                      className="form-control"
                      id={`manipulation_${index}`}
                      name="manipulation"
                      value={training.manipulation}
                      onChange={(e) => handleNewTrainingChange(index, e)}
                      required
                    >
                      <option value="" disabled>בחר מניפולציה</option>
                      <option value="super set">סופר סט</option>
                      <option value="regular">רגיל</option>
                    </select>
                    {training.manipulation === 'super set' && (
                      <div className="alert alert-warning" role="alert">חייב להוסיף תרגיל נוסף אחרי סופר סט.</div>
                    )}
                    <button type="button" className="btn btn-danger mt-2" onClick={() => handleRemoveTraining(index)}>הסר תרגיל</button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={handleAddTraining}>הוסף תרגיל</button>
              </div>

              <button type="submit" className="btn btn-success mt-3">שמור אימון חדש</button>
            </form>
          )}

          <div className="card-stack">
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
                  <p>תאריך: {workout.scheduled_date ? workout.scheduled_date.toString() : 'N/A'}</p>
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
          </div>
        </div>
      )
      }
    </div >
  );
}

export default AdminDashboard;

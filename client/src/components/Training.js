// src/components/Training.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrainingList from './TrainingList';
import './Training.css';

const Training = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userId = JSON.parse(sessionStorage.getItem('user'))?.id;
  console.log("Training", userId);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        console.log("hererhereh", userId);
        const response = await axios.get(`http://localhost:5000/api/workouts/${userId}`);
        console.log('Workouts:', response.data);
        setWorkouts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchWorkouts();
    }
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="training-container">
      <h1>Training Sessions</h1>
      {workouts.map(workout => (
        <TrainingList key={workout.workout_id} workout={workout} />
      ))}
    </div>
  );
};

export default Training;

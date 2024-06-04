// src/components/WorkoutList.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './WorkoutList.css';

const WorkoutList = ({ workouts }) => {
  const navigate = useNavigate();

  const handleStartWorkout = (workoutId) => {
    navigate(`/workout/${workoutId}`);
  };

  return (
    <div className="workout-list-container">
      {workouts.map((workout) => (
        <Card key={workout.workout_id} className="workout-card">
          <Card.Body>
            <Card.Title>{workout.workout_name}</Card.Title>
            <Button variant="primary" onClick={() => handleStartWorkout(workout.workout_id)}>Start</Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutList;

// src/components/TrainingList.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import './TrainingList.css';



const TrainingList = ({ workout }) => {
  const location = useLocation();
  const taskId = location.state?.taskId;
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    navigate(`/start-workout/${workout.workout_id}`, {
      state: { task_id: taskId },
    });
  };

  const handleWatchWorkout = () => {
    navigate(`/watch-workout/${workout.workout_id}`);
  };

  return (
    <Card className="training-card">
      <Card.Body>
        <Card.Title>{workout.workout_name}</Card.Title>
        <Card.Text>{workout.workout_description}</Card.Text>
        <div className="button-group">
          <Button variant="primary" className="small-button" onClick={handleStartWorkout}>Start</Button>
          <Button variant="secondary" className="small-button" onClick={handleWatchWorkout}>Watch</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TrainingList;

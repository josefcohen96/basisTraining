import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './ExercisesList.css';

const ExercisesList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/exercises');
        setExercises(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching exercises');
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="exercises-container">
      <Card className="custom-card">
        <Card.Header className="card-header">Exercises List</Card.Header>
        <ListGroup variant="flush">
          {exercises.map(exercise => (
            <ListGroup.Item key={exercise.exercise_id}>
              {exercise.exercise_name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default ExercisesList;

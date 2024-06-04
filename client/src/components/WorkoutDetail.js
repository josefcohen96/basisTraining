import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import './WorkoutDetail.css';

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [actualData, setActualData] = useState([]);
  const [totalExercises, setTotalExercises] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/workouts/${workoutId}/exercises`);
        const fetchedExercises = response.data;
        setExercises(fetchedExercises);
        setActualData(fetchedExercises.map((exercise) => ({
          ...exercise,
          sets_done: '',
          reps_done: '',
          last_set_weight: '',
          training_id: exercise.training_id
        }))); // Initialize actualData for each exercise
        setTotalExercises(calculateTotalExercises(fetchedExercises));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, [workoutId]);

  const calculateTotalExercises = (exercises) => {
    let count = exercises.length;
    for (let i = 0; i < exercises.length; i++) {
      if (exercises[i].manipulation === 'super set') {
        count -= 1;
      }
    }
    console.log("count")
    return count;
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setActualData((prevData) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], [name]: value };
      return newData;
    });
  };

  const handleNextExercise = () => {
    setCurrentExerciseIndex((prevIndex) => prevIndex + (exercises[prevIndex].manipulation === 'super set' ? 2 : 1));
    console.log("current", currentExerciseIndex)
  };

  const handlePreviousExercise = () => {
    setCurrentExerciseIndex((prevIndex) => prevIndex - (exercises[prevIndex - 1]?.manipulation === 'super set' ? 2 : 1));
    console.log("current", currentExerciseIndex)
  };

  const handleFinishWorkout = async () => {
    try {
      console.log(exercises);
      await axios.post('http://localhost:5000/api/workouts/save', {
        workoutId,
        exercises: actualData,
        
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error finishing workout:', error);
    }
  };

  const currentExercise = exercises[currentExerciseIndex];
  const nextExercise = exercises[currentExerciseIndex + 1];

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!currentExercise) {
    return <p>No exercises found for this workout.</p>;
  }

  return (
    <div className="workout-detail-container">
      <Card className="exercise-card">
        <Card.Body>
          <Card.Title>
            <Link to={`/exercise-video/${currentExercise.exercise_id}`} className="card-title-link">
              {currentExercise.exercise_name}
            </Link>
          </Card.Title>
          <div className="exercise-info">
            <div className="left-column">
              <Card.Text>{currentExercise.exercise_description}</Card.Text>
            </div>
            <div className="right-column">
              <p><strong>מניפולציה:</strong> {currentExercise.manipulation}</p>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-left">
              <p><strong>מספר סטים:</strong> {currentExercise.sets_to_do}</p>
              <Form.Group className="form-group">
                <Form.Label>סטים</Form.Label>
                <Form.Control
                  type="number"
                  name="sets_done"
                  value={actualData[currentExerciseIndex]?.sets_done || ''}
                  onChange={(e) => handleChange(e, currentExerciseIndex)}
                />
              </Form.Group>
            </div>
            <div className="form-group-right">
              <p><strong>מספר חזרות:</strong> {currentExercise.reps_to_do}</p>
              <Form.Group className="form-group">
                <Form.Label>חזרות</Form.Label>
                <Form.Control
                  type="number"
                  name="reps_done"
                  value={actualData[currentExerciseIndex]?.reps_done || ''}
                  onChange={(e) => handleChange(e, currentExerciseIndex)}
                />
              </Form.Group>
            </div>
          </div>
          <Form.Group className="form-group">
            <Form.Label>משקל של סט אחרון</Form.Label>
            <Form.Control
              type="number"
              name="last_set_weight"
              value={actualData[currentExerciseIndex]?.last_set_weight || ''}
              onChange={(e) => handleChange(e, currentExerciseIndex)}
            />
          </Form.Group>
          {currentExercise.manipulation === 'super set' && nextExercise && (
            <Card.Body>
              <Card.Title>
                <Link to={`/exercise-video/${nextExercise.exercise_id}`} className="card-title-link">
                  {nextExercise.exercise_name}
                </Link>
              </Card.Title>
              <div className="exercise-info">
                <div className="left-column">
                  <Card.Text>{nextExercise.exercise_description}</Card.Text>
                </div>
                <div className="right-column">
                  {/* <p><strong>מניפולציה:</strong> {nextExercise.manipulation}</p> */}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group-left">
                  <p><strong>מספר סטים:</strong> {nextExercise.sets_to_do}</p>
                  <Form.Group className="form-group">
                    <Form.Label>סטים</Form.Label>
                    <Form.Control
                      type="number"
                      name="sets_done"
                      value={actualData[currentExerciseIndex + 1]?.sets_done || ''}
                      onChange={(e) => handleChange(e, currentExerciseIndex + 1)}
                    />
                  </Form.Group>
                </div>
                <div className="form-group-right">
                  <p><strong>מספר חזרות:</strong> {nextExercise.reps_to_do}</p>
                  <Form.Group className="form-group">
                    <Form.Label>חזרות</Form.Label>
                    <Form.Control
                      type="number"
                      name="reps_done"
                      value={actualData[currentExerciseIndex + 1]?.reps_done || ''}
                      onChange={(e) => handleChange(e, currentExerciseIndex + 1)}
                    />
                  </Form.Group>
                </div>
              </div>
              <Form.Group className="form-group">
                <Form.Label>משקל</Form.Label>
                <Form.Control
                  type="number"
                  name="last_set_weight"
                  value={actualData[currentExerciseIndex + 1]?.last_set_weight || ''}
                  onChange={(e) => handleChange(e, currentExerciseIndex + 1)}
                />
              </Form.Group>
            </Card.Body>
          )}
          <div className="navigation-buttons">
            <Button
              variant="secondary"
              onClick={handlePreviousExercise}
              disabled={currentExerciseIndex === 0}
              className="me-2"
            >
              Previous
            </Button>
            <Button
              variant="primary"
              onClick={handleNextExercise}
              disabled={currentExerciseIndex + 1 >= totalExercises}
            >
              Next
            </Button>
            <Button
              variant="danger"
              onClick={handleFinishWorkout}
              className="ms-2"
            >
              Finish Workout
            </Button>
          </div>
        </Card.Body>
      </Card>
      <p>
        Exercise {currentExerciseIndex + 1} of {totalExercises}
      </p>
    </div>
  );
};

export default WorkoutDetail;

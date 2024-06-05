import React, { useEffect, useState } from 'react';
import { useParams, useLocation , useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import VideoModal from './VideoModal';
import './WorkoutDetail.css';

const WorkoutDetail = () => {
  const { workoutId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [actualData, setActualData] = useState([]);
  const [totalExercises, setTotalExercises] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  const taskId = state?.task_id; // Extract task_id from state

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
    const nextIndex = currentExerciseIndex + (exercises[currentExerciseIndex]?.manipulation === 'super set' ? 2 : 1);
    setCurrentExerciseIndex(nextIndex);
  };

  const handlePreviousExercise = () => {
    const prevIndex = currentExerciseIndex - (exercises[currentExerciseIndex - 1]?.manipulation === 'super set' ? 2 : 1);
    setCurrentExerciseIndex(prevIndex);
  };

  const handleFinishWorkout = async () => {
    try {
      await axios.post('http://localhost:5000/api/workouts/save', {
        workoutId,
        taskId, // Include task_id here
        exercises: actualData,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error finishing workout:', error);
    }
  };

  const handleShowModal = (exercise) => {
    console.log('Exercise:', exercise);
    setSelectedExercise(exercise);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExercise(null);
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
            <span
              className="card-title-link"
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => handleShowModal(currentExercise)}
            >
              {currentExercise.exercise_name}
            </span>
          </Card.Title>
          <div className="exercise-info">
            <div className="left-column">
              <Card.Text>{currentExercise.exercise_description}</Card.Text>
            </div>
            <div className="right-column">
              <p><strong>Manipulation:</strong> {currentExercise.manipulation}</p>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-left">
              <p><strong>Sets to do:</strong> {currentExercise.sets_to_do}</p>
              <Form.Group className="form-group">
                <Form.Label>Sets done</Form.Label>
                <Form.Control
                  type="number"
                  name="sets_done"
                  value={actualData[currentExerciseIndex]?.sets_done || ''}
                  onChange={(e) => handleChange(e, currentExerciseIndex)}
                />
              </Form.Group>
            </div>
            <div className="form-group-right">
              <p><strong>Reps to do:</strong> {currentExercise.reps_to_do}</p>
              <Form.Group className="form-group">
                <Form.Label>Reps done</Form.Label>
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
            <Form.Label>Last set weight</Form.Label>
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
                <span
                  className="card-title-link"
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => handleShowModal(nextExercise)}
                >
                  {nextExercise.exercise_name}
                </span>
              </Card.Title>
              <div className="exercise-info">
                <div className="left-column">
                  <Card.Text>{nextExercise.exercise_description}</Card.Text>
                </div>
                <div className="right-column">
                  {/* <p><strong>Manipulation:</strong> {nextExercise.manipulation}</p> */}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group-left">
                  <p><strong>Sets to do:</strong> {nextExercise.sets_to_do}</p>
                  <Form.Group className="form-group">
                    <Form.Label>Sets done</Form.Label>
                    <Form.Control
                      type="number"
                      name="sets_done"
                      value={actualData[currentExerciseIndex + 1]?.sets_done || ''}
                      onChange={(e) => handleChange(e, currentExerciseIndex + 1)}
                    />
                  </Form.Group>
                </div>
                <div className="form-group-right">
                  <p><strong>Reps to do:</strong> {nextExercise.reps_to_do}</p>
                  <Form.Group className="form-group">
                    <Form.Label>Reps done</Form.Label>
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
                <Form.Label>Last set weight</Form.Label>
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
      {selectedExercise && (
        <VideoModal
          show={showModal}
          onHide={handleCloseModal}
          exercise={selectedExercise}
        />
      )}
    </div>
  );
};

export default WorkoutDetail;

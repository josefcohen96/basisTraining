// src/components/ExerciseDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ExerciseDetail.css';

const ExerciseDetail = () => {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/exercises/${exerciseId}`);
        setExercise(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercise:', error);
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!exercise) {
    return <p>No exercise found</p>;
  }

  return (
    <div className="exercise-detail">
      <h1>{exercise.exercise_name}</h1>
      <p>{exercise.exercise_description}</p>
      <div className="video-container">
        <video width="100%" controls>
          <source src={exercise.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default ExerciseDetail;

// src/components/UpdateSteps.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import './UpdateSteps.css';

const UpdateSteps = () => {
  const { taskId } = useParams();
  const [stepsToDo, setStepsToDo] = useState('');
  const [avgSteps, setAvgSteps] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStepData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/steps/${taskId}`);
        if (response.data) {
          setStepsToDo(response.data.steps_to_do);
          setAvgSteps(response.data.avg_steps);
          setDescription(response.data.eating_day_free_txt);
        }
      } catch (error) {
        console.error('Error fetching step data:', error);
      }
    };

    fetchStepData();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedSteps = {
        avg_steps: avgSteps,
        eating_day_free_txt: description,
      };
      await axios.put(`http://localhost:5000/api/steps/${taskId}`, updatedSteps);
      alert('Steps updated successfully');
      navigate('/tasks');
    } catch (error) {
      console.error('Error updating steps:', error);
      alert('Failed to update steps');
    }
  };

  return (
    <div className="update-steps-container">
      <h2>Update Steps</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="stepsToDo">Steps to Do</label>
          <input
            type="number"
            id="stepsToDo"
            value={stepsToDo}
            onChange={(e) => setStepsToDo(e.target.value)}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="avgSteps">Average Steps</label>
          <input
            type="number"
            id="avgSteps"
            value={avgSteps}
            onChange={(e) => setAvgSteps(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Update Steps</button>
      </form>
    </div>
  );
};

export default UpdateSteps;

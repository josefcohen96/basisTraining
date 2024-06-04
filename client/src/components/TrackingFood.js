// src/components/TrackingFood.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import './TrackingFood.css';

const TrackingFood = () => {
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const taskId = location.state?.taskId;
  
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userId = user?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/food-entry', {
        user_id: userId,
        description,
        task_id: taskId,
      });
      console.log('Food entry added:', response.data);
      navigate('/tasks'); // Redirect to tasks page after submission
    } catch (error) {
      console.error('Error adding food entry:', error);
    }
  };

  return (
    <div className="tracking-food-container">
      <Card className="tracking-food-card">
        <Card.Body>
          <Card.Title className="text-center">הוסף תיאור תזונה</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="description">
              <Form.Label>תיאור</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">שלח</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TrackingFood;

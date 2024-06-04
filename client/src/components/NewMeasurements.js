import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';
import './NewMeasurements.css';

const NewMeasurements = ({ userId, taskId, onNewMeasurement }) => {
  const [measurements, setMeasurements] = useState({
    date: '',
    weight: '',
    body_fat_percentage: '',
    chest: '',
    waist: '',
    thighr: '',
    thighl: '',
    armr: '',
    arml: '',
  });
  const [photos, setPhotos] = useState([]);
  console.log('User ID:', userId);
  console.log('Task ID:', taskId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prevMeasurements) => ({
      ...prevMeasurements,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add the new measurement
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('task_id', taskId);
      Object.keys(measurements).forEach(key => {
        formData.append(key, measurements[key]);
      });
      photos.forEach((photo, index) => {
        formData.append('photos', photo);
      });

      const response = await axios.post(`http://localhost:5000/api/tracking`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('New measurement added:', response.data);

      onNewMeasurement();
      window.location.reload(); // Refresh the page to see updated notifications
    } catch (error) {
      console.error('Error adding new measurement:', error);
    }
  };

  return (
    <Card className="new-measurements-card">
      <Card.Body>
        <Card.Title className="text-center">הוספת מדדים</Card.Title>
        <Form onSubmit={handleSubmit} className="new-measurements-form">
          <Form.Group>
            <Form.Label>תאריך</Form.Label>
            <Form.Control type="date" name="date" value={measurements.date} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>משקל</Form.Label>
            <Form.Control type="number" name="weight" value={measurements.weight} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>אחוז שומן</Form.Label>
            <Form.Control type="number" name="body_fat_percentage" value={measurements.body_fat_percentage} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>היקף חזה</Form.Label>
            <Form.Control type="number" name="chest" value={measurements.chest} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>היקף מותניים</Form.Label>
            <Form.Control type="number" name="waist" value={measurements.waist} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>היקף ירך ימין</Form.Label>
            <Form.Control type="number" name="thighr" value={measurements.thighr} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>היקף ירך שמאל</Form.Label>
            <Form.Control type="number" name="thighl" value={measurements.thighl} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>היקף יד ימין</Form.Label>
            <Form.Control type="number" name="armr" value={measurements.armr} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>היקף יד שמאל</Form.Label>
            <Form.Control type="number" name="arml" value={measurements.arml} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>הוסף תמונות (עד 4)</Form.Label>
            <Form.Control type="file" multiple accept="image/*" onChange={handlePhotoChange} />
          </Form.Group>
          <Button variant="primary" type="submit" className="btn">
            הוסף מדדים
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default NewMeasurements;

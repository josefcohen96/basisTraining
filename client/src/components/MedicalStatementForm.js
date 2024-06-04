import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './MedicalStatementForm.css';

const MedicalStatementForm = () => {
  const [medicalData, setMedicalData] = useState({
    name: '',
    age: '',
    medicalConditions: '',
    medications: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicalData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const doc = new jsPDF();
    doc.text(`Name: ${medicalData.name}`, 10, 10);
    doc.text(`Age: ${medicalData.age}`, 10, 20);
    doc.text(`Medical Conditions: ${medicalData.medicalConditions}`, 10, 30);
    doc.text(`Medications: ${medicalData.medications}`, 10, 40);
    doc.save('MedicalStatement.pdf');

    // Mark registration as complete (this could be a state update or API call)
    navigate('/dashboard');
  };

  return (
    <div className="medical-statement-form">
      <h2>Medical Statement</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={medicalData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input type="number" id="age" name="age" value={medicalData.age} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="medicalConditions">Medical Conditions</label>
          <textarea id="medicalConditions" name="medicalConditions" value={medicalData.medicalConditions} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="medications">Medications</label>
          <textarea id="medications" name="medications" value={medicalData.medications} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
};

export default MedicalStatementForm;

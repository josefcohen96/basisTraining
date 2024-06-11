// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form, Alert, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './TaskList.css';

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [stepTracking, setStepTracking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
        setTasks(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMeasurements = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}/measurements/last`);
        setMeasurements(response.data);
      } catch (err) {
        console.error('Error fetching measurements:', err);
      }
    };

    const fetchStepTracking = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}/steps/last`);
        setStepTracking(response.data);
      } catch (err) {
        console.error('Error fetching step tracking:', err);
      }
    };

    if (userId) {
      fetchTasks();
      fetchMeasurements();
      fetchStepTracking();
    }
  }, [userId]);

  const handleCheckboxChange = async (taskId, status) => {
    const newStatus = status === 'Pending' ? 'Finish' : 'Pending';
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { task_status: newStatus });
      setTasks(tasks.map(task => task.task_id === taskId ? { ...task, task_status: newStatus } : task));
    } catch (error) {
      setError('Error updating task status');
    }
  };

  const handleTaskClick = (taskType, taskId) => {
    if (taskType === 'measure') {
      navigate('/tracking-history', { state: { taskId } });
    } else if (taskType === 'food') {
      navigate('/tracking-food', { state: { taskId } });
    } else if (taskType === 'workout') {
      navigate('/training', { state: { taskId } });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const pendingTasks = tasks.filter(task => task.task_status === 'Pending');
  const finishedTasks = tasks.filter(task => task.task_status === 'Finish');

  return (
    <div className="task-list">
      <h3>משימות ממתינות</h3>
      <div className="cards-container">
        <Col>
          <Card className="custom-card">
            <Card.Header className="card-header">
              היקפים אחרונים
            </Card.Header>
            <Card.Body>
              {measurements ? (
                <div>
                  <p>מותניים: {measurements.waist} ס"מ</p>
                  <p>אחוז שומן: {measurements.body_fat_percentage} ס"מ</p>
                  <p>יד שמאל: {measurements.arml} ס"מ</p>
                  <p>יד ימין: {measurements.armr} ס"מ</p>
                  <p>ירך שמאל: {measurements.thighl} ס"מ</p>
                  <p>ירך ימין: {measurements.thighr} ס"מ</p>
                </div>
              ) : (
                <p>אין נתוני היקפים זמינים</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="custom-card">
            <Card.Header className="card-header">
              מעקב צעדים
            </Card.Header>
            <Card.Body>
              {stepTracking ? (
                <div>
                  <p>צעדים ממוצעים: {stepTracking.avg_steps}</p>
                  <p>צעדים נדרשים: {stepTracking.steps_to_do}</p>
                </div>
              ) : (
                <p>אין נתוני צעדים זמינים</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>משימה</th>
            <th>תיאור</th>
            <th>תאריך התחלה</th>
            <th>מצב</th>
          </tr>
        </thead>
        <tbody>
          {pendingTasks.map((task) => (
            <tr key={task.task_id}>
              <td>
                <span
                  className="task-name"
                  onClick={() => handleTaskClick(task.task_type, task.task_id)}
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                  {task.task_name}
                </span>
              </td>
              <td>{task.task_description}</td>
              <td>{new Date(task.due_date).toLocaleDateString()}</td>
              <td>
                <Form.Check
                  type="checkbox"
                  label="ממתין"
                  checked={task.task_status === 'Finish'}
                  onChange={() => handleCheckboxChange(task.task_id, task.task_status)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>משימות שהסתיימו</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>משימה</th>
            <th>תיאור</th>
            <th>תאריך התחלה</th>
            <th>מצב</th>
          </tr>
        </thead>
        <tbody>
          {finishedTasks.map((task) => (
            <tr key={task.task_id}>
              <td>{task.task_name}</td>
              <td>{task.task_description}</td>
              <td>{new Date(task.due_date).toLocaleDateString()}</td>
              <td>
                <Form.Check
                  type="checkbox"
                  label="הסתיים"
                  checked={task.task_status === 'Finish'}
                  onChange={() => handleCheckboxChange(task.task_id, task.task_status)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TaskList;

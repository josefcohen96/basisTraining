// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './TaskList.css';

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchTasks();
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
    console.log('Task type:', taskType);
    console.log('Task ID:', taskId);
    if (taskType === 'measure') {
      navigate('/tracking-history', { state: { taskId } });
    } else if (taskType === 'food') {
      console.log('Navigate to tracking-food');
      navigate('/tracking-food', { state: { taskId } });
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tasks = ({ userId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
        setTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [userId]);

  const updateTaskStatus = async (taskId, status) => {
    try {
      console.task('Update task status' + taskId, status);
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { task_status: status });
      setTasks(tasks.map(task => (task.task_id === taskId ? { ...task, task_status: status } : task)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Your Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.task_id}>
            <h3>{task.task_name}</h3>
            <p>{task.task_description}</p>
            <p>Status: {task.task_status}</p>
            {task.task_status === 'pending' && (
              <button onClick={() => updateTaskStatus(task.task_id, 'completed')}>Mark as Completed</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;

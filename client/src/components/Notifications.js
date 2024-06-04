import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = ({ userId }) => {
  const [remainingTasks, setRemainingTasks] = useState(0);

  useEffect(() => {
    const fetchRemainingTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/remaining/${userId}`);
        setRemainingTasks(response.data.remaining);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRemainingTasks();
  }, [userId]);

  return (
    <div>
      <p>You have {remainingTasks} remaining tasks.</p>
      <a href={`/tasks/${userId}`}>View Tasks</a>
    </div>
  );
};

export default Notifications;

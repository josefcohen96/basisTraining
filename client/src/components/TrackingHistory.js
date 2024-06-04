import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './TrackingHistory.css';
import NewMeasurements from './NewMeasurements'; // Import the new component
import { useLocation } from 'react-router-dom';

const TrackingHistory = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const taskId = location.state?.taskId;

  // Fetch userId from session storage
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userId = user?.id;

  console.log('User ID:', userId); // Add console log to check user ID

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tracking/${userId}`); // Add user ID to the URL
      console.log('Fetched metrics:', response.data);
      setMetrics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tracking metrics:', error);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchMetrics();
    } else {
      console.error('User ID is not available');
      setLoading(false);
    }
  }, [userId, fetchMetrics]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const createDataSets = () => {
    const metricList = [
      { key: 'weight', label: 'משקל' },
      { key: 'body_fat_percentage', label: 'אחוז שומן בגוף' },
      { key: 'chest', label: 'חזה' },
      { key: 'waist', label: 'מותניים' },
      { key: 'thighr', label: 'ירך ימין' },
      { key: 'thighl', label: 'ירך שמאל' },
      { key: 'armr', label: 'יד ימין' },
      { key: 'arml', label: 'יד שמאל' },
    ];

    return metricList.map(metric => ({
      label: metric.label,
      data: metrics.map(metricData => metricData[metric.key]),
      fill: false,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }));
  };

  const data = {
    labels: metrics.map(metric => formatDate(metric.date)),
    datasets: createDataSets(),
  };

  const options = {
    scales: {
      x: {
        ticks: {
          font: {
            size: 10, // Increase the font size for the x-axis labels
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="tracking-container">
      <Card className="tracking-card graph-card">
        <Card.Body>
          <Card.Title className="text-center">היסטוריית מדדים</Card.Title>
          <div className="chart-container">
            <Line data={data} options={options} />
          </div>
        </Card.Body>
      </Card>
      <NewMeasurements userId={userId} taskId={taskId} onNewMeasurement={fetchMetrics} /> {/* Include the new component */}
    </div>
  );
};

export default TrackingHistory;

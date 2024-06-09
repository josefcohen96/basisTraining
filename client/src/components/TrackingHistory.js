import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import 'chart.js/auto';
import './TrackingHistory.css';
import NewMeasurements from './NewMeasurements'; // Import the new component
import { useLocation } from 'react-router-dom';

const TrackingHistory = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const taskId = location.state?.taskId;


  const userId = JSON.parse(sessionStorage.getItem('user'))?.id;
  const [latestMeasurement, setLatestMeasurement] = useState(null);

  useEffect(() => {
    const fetchLatestMeasurement = async () => {
      try {
        // const response = await axios.get(`/api/latest-measurement/${userId}`);
        const response = await axios.get(`http://localhost:5000/api/latest-measurement/${userId}`);
        setLatestMeasurement(response.data);
      } catch (error) {
        console.error('Error fetching latest measurement:', error);
      }
    };

    if (userId) {
      fetchLatestMeasurement();
    }
  }, [userId]);



  console.log('User ID:', userId); // Add console log to check user ID

  const fetchMetrics = useCallback(async () => {
    try {
      console.log('User ID:', userId); // Add console log to check user ID
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

  return (
    <div className="tracking-container">
      <Card className="custom-card">
        <Card.Header className="card-header">
          מעקב היקפים
        </Card.Header>
        <Card.Body>
          <Card.Text>
            {latestMeasurement ? (
              <div>
                <div><strong>תאריך:</strong> {new Date(latestMeasurement.date).toLocaleDateString()}</div>
                <div><strong>אחוז שומן בגוף:</strong> {latestMeasurement.body_fat_percentage} %</div>
                <div><strong>חזה:</strong> {latestMeasurement.chest} ס"מ</div>
                <div><strong>מותניים:</strong> {latestMeasurement.waist} ס"מ</div>
                <div><strong>ירך ימין:</strong> {latestMeasurement.thighr} ס"מ</div>
              </div>
            ) : (
              <div>אין נתונים להצגה</div>
            )}
          </Card.Text>
        </Card.Body>
        {/* <Card.Footer>
                            <Button variant="link" className="card-footer-item" onClick={handleWatchHistoryClick}>צפה בהיסטוריית היקפים</Button>
                        </Card.Footer> */}
      </Card>
      <NewMeasurements userId={userId} taskId={taskId} onNewMeasurement={fetchMetrics} /> {/* Include the new component */}
    </div>
  );
};

export default TrackingHistory;

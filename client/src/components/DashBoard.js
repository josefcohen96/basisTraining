import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
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

    const handleWatchHistoryClick = () => {
        navigate('/tracking-history');
    };

    return (
        <div className="dashboard-container">
            <h1 className="text-center">לוח בקרה</h1>
            <div className="cards-container">

                <Col>
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
                        <Card.Footer>
                            <Button variant="link" className="card-footer-item" onClick={handleWatchHistoryClick}>צפה בהיסטוריית היקפים</Button>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col>
                    <Card className="custom-card">
                        <Card.Header className="card-header">
                        מעקב אימונים
                          
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                אין נתונים להצגה
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="link" className="card-footer-item" onClick={handleWatchHistoryClick}>צפה בהיסטורייה אימונים</Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </div>
        </div>
    );
}

export default Dashboard;
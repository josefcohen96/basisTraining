import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    

    return (
        <div className="dashboard-container">
            <h1 className="text-center">לוח בקרה</h1>
            <div className="cards-container">

                <Col>
                  
                </Col>
                <Col>
                    <Card className="custom-card">
                        <Card.Header className="card-header">
                        מעקב צעדים
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                כמות צעדיים נדרשת\ ממוצע צעדים שבועי
                            </Card.Text>
                        </Card.Body>

                    </Card>
                </Col>
            </div>
        </div>
    );
}

export default Dashboard;
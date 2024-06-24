import React from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import './Dashboard.css';

function Dashboard() {

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
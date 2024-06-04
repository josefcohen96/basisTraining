// src/components/Navbar.js
import React, { useContext, useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../Navbar.css';

const AdminSidebar = ({ userId }) => {
    const [incompleteTasks, setIncompleteTasks] = useState(0);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchIncompleteTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
                const incomplete = response.data.filter(task => task.task_status === 'Pending').length;
                setIncompleteTasks(incomplete);
            } catch (error) {
                console.error('Error fetching incomplete tasks:', error);
            }
        };

        if (userId) {
            fetchIncompleteTasks();
        }
    }, [userId]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div>
            <div className={`overlay ${isSidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>
            <div className="navbar-container">
                <div className="navbar-header">
                    <h3>FITAL</h3>
                    <button className="toggle-button" onClick={toggleSidebar}>
                        <i className="bi bi-list"></i>
                    </button>
                </div>
                <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <Nav defaultActiveKey="/admin" className="flex-column" onClick={closeSidebar}>
                        <Nav.Link href="/admin" className="nav-item">
                            <i className="bi bi-speedometer2"></i> מסך בקרה
                        </Nav.Link>

                    </Nav>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;

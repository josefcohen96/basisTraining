// src/components/Navbar.js
import React, { useContext, useEffect, useState } from 'react';
import { Nav, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Navbar.css';

const Sidebar = ({ userId }) => {
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
          <Nav defaultActiveKey="/dashboard" className="flex-column" onClick={closeSidebar}>
            <Nav.Link href="/dashboard" className="nav-item">
              <i className="bi bi-speedometer2"></i> מסך בקרה
            </Nav.Link>
            <Nav.Link href="/tasks" className="nav-item">
              <i class="bi bi-alarm"></i> משימות {incompleteTasks > 0 && <Badge bg="danger">{incompleteTasks}</Badge>}
            </Nav.Link>
            <Nav.Link href="/training" className="nav-item">
              <i className="bi bi-bar-chart"></i> אימונים
            </Nav.Link>
            <Nav.Link href="/exericses" className="nav-item">
              <i class="bi bi-card-list"></i> מאגר תרגילים
            </Nav.Link>
            <Nav.Link href="/naturation-menu" className="nav-item">
              <i className="bi bi-book"></i> תפריט תזונה
            </Nav.Link>
            <Nav.Link href="/tracking-history" className="nav-item">
              <i className="bi bi-rulers"></i> היקפים
            </Nav.Link>
            <Nav.Link href="/recipes" className="nav-item">
              <i class="bi bi-cookie"></i> מתכונים
            </Nav.Link>
            <Nav.Link href="/naturation-guides" className="nav-item">
              <i class="bi bi-file-richtext"></i> מדריכי תזונה
            </Nav.Link>
            <Nav.Link href="/courses" className="nav-item">
              <i class="bi bi-collection-play"></i> קורסים
            </Nav.Link>

            <div className="spacer"></div>
            <Nav.Link as={Link} to="/login" onClick={handleLogout} className="nav-item logout">
              <i className="bi bi-box-arrow-right"></i> צא\י
            </Nav.Link>
          </Nav>
        </div>
      </div>
    </div >
  );
};

export default Sidebar;

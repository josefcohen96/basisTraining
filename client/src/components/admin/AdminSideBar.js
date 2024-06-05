// src/components/Navbar.js
import React, { useContext, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../Navbar.css';

const AdminSidebar = ({ userId }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                        <div className="spacer"></div>
                        <Nav.Link as={Link} to="/login" onClick={handleLogout} className="nav-item logout">
                            <i className="bi bi-box-arrow-right"></i> צא\י
                        </Nav.Link>
                    </Nav>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;

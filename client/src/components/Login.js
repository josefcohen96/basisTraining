import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file here
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    // Clear session storage when the component mounts
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Login Success:', response.data);

      login(response.data);
      console.log("navigate to dashboard");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>כניסה</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">אימייל</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">סיסמא</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group form-check d-flex justify-content-between align-items-center">
            <div>
              <input type="checkbox" id="rememberMe" className="form-check-input" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <label className="form-check-label" htmlFor="rememberMe">זכור אותי</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">שכחת סיסמא?</Link>
          </div>
          <button type="submit" className="btn">התחבר</button>
        </form>
        <div className="text-center mt-3">
          עוד לא נרשמת ? <Link to="/register" className="link">הרשם</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

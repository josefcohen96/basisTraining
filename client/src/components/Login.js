import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file here
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    // Clear session storage when the component mounts
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      console.log('Login Success:', response.data);

      login(response.data, rememberMe); // Pass the rememberMe flag
      console.log("navigate to dashboard");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Login failed. Please check your email and password.');
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
          {error && <div className="alert alert-danger">{error}</div>}
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

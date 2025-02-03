import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { employerLoginContext } from '../../contexts/employerLoginContext';
import { freelancerLoginContext } from '../../contexts/freelancerLoginContext';
import { useEffect } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const { loginEmployee, EmployeeLoginStatus, err: employerErr } = useContext(employerLoginContext);
  const { loginFreelancer, FreelancerLoginStatus, err: freelancerErr } = useContext(freelancerLoginContext);

  useEffect(() => {
    if (EmployeeLoginStatus) {
      navigate('/employerdashboard');
    }
  }, [EmployeeLoginStatus, navigate]);
  
  useEffect(() => {
    if (FreelancerLoginStatus) {
      navigate('/freelancerdashboard');
    }
  }, [FreelancerLoginStatus, navigate]);
  

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!username.trim()) {
      errors.username = 'Username or Email is required';
      isValid = false;
    }

    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log('Login attempt with:', username, password);

        // Fetch employer list
        let empRes = await fetch("http://localhost:3000/employerList");
        let employers = await empRes.json();
        let isEmployer = employers.some(emp => emp.fullName === username);

        if (isEmployer) {
          console.log('User found in Employer list, attempting Employer login...');
          await loginEmployee({ username, password });

          // Wait for login status update
          if (EmployeeLoginStatus) {
            navigate('/employerdashboard');
            return;
          }
        }

        // Fetch freelancer list
        let freeRes = await fetch("http://localhost:3000/freelancerList");
        let freelancers = await freeRes.json();
        let isFreelancer = freelancers.some(free => free.fullName === username);

        if (isFreelancer) {
          console.log('User found in Freelancer list, attempting Freelancer login...');
          await loginFreelancer({ username, password });

          // Wait for login status update
          if (FreelancerLoginStatus) {
            navigate('/freelancerdashboard');
            return;
          }
        }

        console.log('User not found in any list or invalid credentials');
        setLoginError(true);
      } catch (error) {
        console.error('Error logging in:', error);
        setLoginError(true);
      }
    }
};

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or email"
            />
            {errors.username && <span className="error" style={{ color: 'red' }}>{errors.username}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            {errors.password && <span className="error" style={{ color: 'red' }}>{errors.password}</span>}
          </div>
          <button type="submit" className="login-button">Login</button>
          {loginError && <p className="error" style={{ color: 'red' }}>Invalid credentials! Please check your username/email or password.</p>}
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
      <div className="login-image">
        <img
          src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80"
          alt="Login Visual"
        />
      </div>
    </div>
  );
}

export default Login;
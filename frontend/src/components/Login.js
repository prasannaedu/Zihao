import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Base from './Base';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const response = await fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setIsAuthenticated(true); 
      alert('Login successful!');
      navigate('/recipes'); // Redirect to recipes page
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
        {/* <Base/> */}
    <div className="container mt-5">
      {/* Login form */}
      <form onSubmit={handleSubmit} className="col-6 mx-auto card p-3 shadow-lg" id="login-form">
        <h2>Login</h2>
        <hr />
        
        {/* Username input */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            aria-describedby="usernameHelp"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div id="usernameHelp" className="form-text">Your username for login.</div>
        </div>

        {/* Password input */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Register link */}
        <p>Don't have an account? <a href="/register/">Register</a></p>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default Login;

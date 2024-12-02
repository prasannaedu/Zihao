// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Login from './components/Login';
import Recipes from './components/Recipes';
import Base from './components/Base';
import Update from './components/Update';
import Register from './components/Register';

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if access token exists
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);
  return (
    <Router>
      <Base isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
          <Route path="/update/:id" element={<Update />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} /> */}
          {/* Add other routes as needed */}
        </Routes>
      </Base>

    </Router>
  );
}

export default App;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Base = ({ children, isAuthenticated,setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    alert('You have been logged out.');
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar bg-body-primary bg-primary">
        <div className="container-fluid">
          <div className='navbar-header' >

          <a className="navbar-brand" href='/'><strong className="text-lg" href="#" >DASHBOARD</strong></a> 
          </div>
          <div className="d-flex">
            {isAuthenticated ? (
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn btn-success">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </>
  );
};

export default Base;

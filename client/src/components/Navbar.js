import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📚 Library Manager
        </Link>

        {/* Mobile Menu Button */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon">{isMenuOpen ? '✕' : '☰'}</span>
        </button>

        {/* Nav Links */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Search Books
          </Link>

          {isAuthenticated && (
            <Link 
              to="/my-library" 
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              My Library
            </Link>
          )}

          {isAuthenticated ? (
            <div className="nav-user-section">
              <span className="nav-username">👤 {user?.username}</span>
              <button 
                onClick={handleLogout} 
                className="nav-button logout-btn"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link 
                to="/login" 
                className="nav-button login-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="nav-button register-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




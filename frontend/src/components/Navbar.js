import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {

  return (
    <nav className="navbar">
      <div className="auth-buttons">
        <Link to="/login">
          <button className="primary-button">🥃</button>
          <button className="primary-button">🏆</button>
          <button className="primary-button">❤️</button>
        </Link>
      </div>
      
      <Link to="/">
        <span className="navbar-text">AlkoHub</span>
      </Link>

      <Link to="/login">
        <button className="primary-button">👤</button>
      </Link>
    </nav>
  );
};

export default Navbar;

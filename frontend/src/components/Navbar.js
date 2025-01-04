import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {

  return (
    <nav className="navbar">
      <div className="auth-buttons">
        <Link to="/login">
          <button className="primary-button">Historia</button>
          <button className="primary-button">Osiągnięcia</button>
          <button className="primary-button">Polubione</button>
        </Link>
      </div>
      
      <Link to="/">
        <span className="navbar-text">AlkoHub</span>
      </Link>

      <Link to="/login">
        <button className="primary-button">Login</button>
      </Link>
    </nav>
  );
};

export default Navbar;

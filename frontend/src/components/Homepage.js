import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage-container">
      <h1>Witamy na AlkoHubie</h1>
      <div className="button-container">
        <Link to="/login">
          <button className="primary-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="primary-button">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;

import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../styles/Navbar.css';

const Navbar = () => {

  const logoutUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', { method: 'POST' });
      if (response.ok) {
        // Usuń ciasteczko user_id
        Cookies.remove('user_id');
        alert('Wylogowano pomyślnie!');
      } else {
        alert('Błąd wylogowania.');
      }
    } catch (error) {
      alert('Wystąpił błąd podczas wylogowania.');
    }
  };

  return (
    <nav className="navbar">
      

      <Link to="/">
        <span className="navbar-text">AlkoHub</span>
      </Link>

      <div className="auth-buttons">
        <button onClick={logoutUser}>Wyloguj się</button>
        <Link to="/login">
          <button className="primary-button">Login</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

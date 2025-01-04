import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../styles/Navbar.css';

const NavbarLogged = () => {

  // Przycisk z wylogowaniem
  const logoutUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', { method: 'POST' });
      if (response.ok) {
        // Usuń ciasteczko user_id
        Cookies.remove('user_id');
        alert('Wylogowano pomyślnie!');
        window.location.href = 'http://localhost:3000';
      } else {
        alert('Błąd wylogowania.');
      }
    } catch (error) {
      alert('Wystąpił błąd podczas wylogowania.');
    }
  };

  return (
    <nav className="navbar">
      <div className="auth-buttons">
        <Link to="/history">
          <button className="primary-button">Historia</button>
        </Link>
        <Link to="/achievements">
          <button className="primary-button">Osiągnięcia</button>
        </Link>
        <Link to="/liked">
          <button className="primary-button">Polubione</button>
        </Link>
      </div>
        <Link to="/">
            <span className="navbar-text">AlkoHub</span>
        </Link>
      <div className="auth-buttons">
        <button onClick={logoutUser}>Wyloguj się</button>
        <Link to="/profile">
          <button className="primary-button">Profil</button>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarLogged;

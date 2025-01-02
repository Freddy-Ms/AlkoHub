import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../styles/NavbarLogged.css';

const NavbarLogged = () => {

  // Przycisk z wylogowaniem
  const logoutUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', { method: 'POST' });
      if (response.ok) {
        // Usuń ciasteczko user_id
        Cookies.remove('user_id');
        alert('Wylogowano pomyślnie!');
        window.location.reload();
      } else {
        alert('Błąd wylogowania.');
      }
    } catch (error) {
      alert('Wystąpił błąd podczas wylogowania.');
    }
  };

  return (
    <nav className="navbar">
        <Link to="/history">
          <button className="primary-button">Historia</button>
        </Link>
        <Link to="/">
            <span className="navbar-text">AlkoHub</span>
        </Link>
        <button onClick={logoutUser}>Wyloguj się</button>
    </nav>
  );
};

export default NavbarLogged;

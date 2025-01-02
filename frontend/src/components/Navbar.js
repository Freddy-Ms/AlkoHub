import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

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
      <Link to="/">Strona główna</Link>
      {/* Dodaj przycisk wylogowania */}
      <button onClick={logoutUser}>Wyloguj się</button>
    </nav>
  );
};

export default Navbar;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nazwa: '',
    mail: '',
    haslo: '',
    waga: '',
    wiek: '',
    plec: '',
  });

  const handleRegisterChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Wystąpił błąd podczas rejestracji.');
    }
  };

  return (
    <div className="register-container">
      <h1>Rejestracja</h1>
      <form onSubmit={registerUser}>
        <input
          type="text"
          name="nazwa"
          placeholder="Nazwa użytkownika"
          value={formData.nazwa}
          onChange={handleRegisterChange}
          required
        />
        <input
          type="email"
          name="mail"
          placeholder="E-mail"
          value={formData.mail}
          onChange={handleRegisterChange}
          required
        />
        <input
          type="password"
          name="haslo"
          placeholder="Hasło"
          value={formData.haslo}
          onChange={handleRegisterChange}
          required
        />
        <input
          type="number"
          name="waga"
          placeholder="Waga"
          value={formData.waga}
          onChange={handleRegisterChange}
        />
        <input
          type="number"
          name="wiek"
          placeholder="Wiek"
          value={formData.wiek}
          onChange={handleRegisterChange}
        />
        <select name="plec" value={formData.plec} onChange={handleRegisterChange}>
          <option value="">Wybierz płeć</option>
          <option value="true">Mężczyzna</option>
          <option value="false">Kobieta</option>
        </select>
        <button type="submit" className="primary-button">Zarejestruj się</button>
      </form>
      <div className="navigation">
        <Link to="/">Powrót na stronę główną</Link>
      </div>
    </div>
  );
};

export default Register;
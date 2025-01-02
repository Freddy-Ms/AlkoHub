import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [formData, setFormData] = useState({
    nazwa: '',
    mail: '',
    haslo: '',
    waga: '',
    wiek: '',
    plec: 'true', // domyślnie ustawiamy 'true' (mężczyzna) dla przykładu
  });
  const [loginData, setLoginData] = useState({
    nazwa: '',
    haslo: '',
  });
  const [message, setMessage] = useState('');
  const [homepageMessage, setHomepageMessage] = useState('');

  const handleRegisterChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd rejestracji');
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', loginData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Błąd logowania');
    }
  };

  const logoutUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/logout');
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Błąd wylogowania');
    }
  };

  const fetchHomepage = async () => {
    try {
      const response = await axios.get('http://localhost:5000/');
      setHomepageMessage(response.data.message);
    } catch (error) {
      setHomepageMessage('Błąd wczytywania strony głównej');
    }
  };

  return (
    <div>
      <h1>Strona główna</h1>
      <button onClick={fetchHomepage}>Załaduj stronę główną</button>
      {homepageMessage && <p>{homepageMessage}</p>}

      <h1>Rejestracja</h1>
      <form onSubmit={registerUser}>
        <input
          type="text"
          name="nazwa"
          placeholder="Nazwa"
          value={formData.nazwa}
          onChange={handleRegisterChange}
          required
        />
        <input
          type="email"
          name="mail"
          placeholder="Email"
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
          required
        />
        <input
          type="number"
          name="wiek"
          placeholder="Wiek"
          value={formData.wiek}
          onChange={handleRegisterChange}
          required
        />
        <select
          name="plec"
          value={formData.plec}
          onChange={handleRegisterChange}
          required
        >
          <option value="0">Mężczyzna</option>
          <option value="1">Kobieta</option>
        </select>
        <button type="submit">Zarejestruj się</button>
      </form>

      <h1>Logowanie</h1>
      <form onSubmit={loginUser}>
        <input
          type="text"
          name="nazwa"
          placeholder="Nazwa lub Email"
          value={loginData.nazwa}
          onChange={handleLoginChange}
          required
        />
        <input
          type="password"
          name="haslo"
          placeholder="Hasło"
          value={loginData.haslo}
          onChange={handleLoginChange}
          required
        />
        <button type="submit">Zaloguj się</button>
      </form>

      <button onClick={logoutUser}>Wyloguj się</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import biblioteki do obsługi ciasteczek
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    nazwa: '',
    haslo: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // Zapisz user ID w ciasteczkach
        Cookies.set('user_id', data.user_id, { expires: 1 }); // Przechowuj ciasteczko przez 1 dzień
        alert('Zalogowano pomyślnie!');
        navigate('/'); // Przekierowanie na stronę główną
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('Wystąpił błąd podczas logowania.');
    }
  };

  return (
    <div className="login-container">
      <h1>Logowanie</h1>
      <form onSubmit={loginUser}>
        <input
          type="text"
          name="nazwa"
          placeholder="Nazwa użytkownika"
          value={formData.nazwa}
          onChange={handleLoginChange}
          required
        />
        <input
          type="password"
          name="haslo"
          placeholder="Hasło"
          value={formData.haslo}
          onChange={handleLoginChange}
          required
        />
        <button type="submit" className="primary-button">Zaloguj się</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="navigation">
        <Link to="/register">Nie masz konta? Zarejestruj się</Link>
        <br />
        <Link to="/">Powrót na stronę główną</Link>
      </div>
    </div>
  );
};

export default Login;

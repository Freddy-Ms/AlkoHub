import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [loginData, setLoginData] = useState({ nazwa: '', haslo: '' });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const loginUser = (e) => {
    e.preventDefault();
    // Tutaj dodasz funkcję do logowania użytkownika.
    console.log(loginData);
  };

  return (
    <div className="login-container">
      <h1>Logowanie</h1>
      <form onSubmit={loginUser}>
        <input
          type="text"
          name="nazwa"
          placeholder="Nazwa użytkownika lub e-mail"
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
        <button type="submit" className="primary-button">Zaloguj się</button>
      </form>
      <div className="navigation">
        <Link to="/register">Nie masz konta? Zarejestruj się</Link>
        <Link to="/">Powrót na stronę główną</Link>
      </div>
    </div>
  );
};

export default Login;

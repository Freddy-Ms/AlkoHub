import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import NavbarLogged from './components/NavbarLogged';
import './styles/App.css';
import Cookies from 'js-cookie';
import History from './components/History';

const App = () => {
  const isLoggedIn = Cookies.get('user_id'); // Sprawdza, czy są jakiekolwiek ciasteczka

  return (
    <Router>
      <div>
      {isLoggedIn ? <Navbar /> : <NavbarLogged />}
      </div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
};

export default App;

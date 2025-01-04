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
import Achievements from './components/Achievements';
import Profile from './components/Profile';
import Liked from './components/Liked';
import './styles/styles.css';
import AdminPage from './components/AdminPage';

const App = () => {
  const isLoggedIn = Cookies.get('user_id'); // Sprawdza, czy są jakiekolwiek ciasteczka

  return (
    <Router>
      <div>
      {isLoggedIn ? <NavbarLogged /> : <Navbar />}
      </div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/liked" element={<Liked />} />
        <Route path="/adminPage" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;

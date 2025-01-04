import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const AdminPage = () => {
  // Stan alkoholi
  const [alcohols, setAlcohols] = useState([]);
  const [newAlcohol, setNewAlcohol] = useState('');

  // Stan użytkowników
  const [users, setUsers] = useState([
    { id: 1, name: 'Jan Kowalski', role: 'User' },
    { id: 2, name: 'Anna Nowak', role: 'Admin' },
  ]);
  const [newRole, setNewRole] = useState('');

  // Stan komentarzy
  const [comments, setComments] = useState([
    { id: 1, text: 'Świetny alkohol!' },
    { id: 2, text: 'Nie polecam tego trunku.' },
  ]);

  // Funkcje do zarządzania alkoholami
  const addAlcohol = () => {
    setAlcohols([...alcohols, newAlcohol]);
    setNewAlcohol('');
  };

  const removeAlcohol = (index) => {
    setAlcohols(alcohols.filter((_, i) => i !== index));
  };

  const editAlcohol = (index) => {
    const newName = prompt('Nowa nazwa:', alcohols[index]);
    if (newName) {
      const updatedAlcohols = [...alcohols];
      updatedAlcohols[index] = newName;
      setAlcohols(updatedAlcohols);
    }
  };

  // Funkcje do zarządzania użytkownikami
  const changeUserRole = (id) => {
    setUsers(users.map((user) =>
      user.id === id ? { ...user, role: newRole } : user
    ));
    setNewRole('');
  };

  const removeUserRole = (id) => {
    setUsers(users.map((user) =>
      user.id === id ? { ...user, role: 'User' } : user
    ));
  };

  // Funkcje do zarządzania komentarzami
  const removeComment = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div className="admin-panel">
      <h1>Panel Administratora</h1>

      {/* Zarządzanie Alkoholami */}
      <div>
        <h2>Alkohole</h2>
        <input 
          type="text" 
          value={newAlcohol} 
          onChange={(e) => setNewAlcohol(e.target.value)} 
          placeholder="Nowy alkohol" 
        />
        <button onClick={addAlcohol}>Dodaj Alkohol</button>

        <ul>
          {alcohols.map((alcohol, index) => (
            <li key={index}>
              {alcohol} 
              <button onClick={() => editAlcohol(index)}>Edytuj</button>
              <button onClick={() => removeAlcohol(index)}>Usuń</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Zarządzanie Użytkownikami */}
      <div>
        <h2>Użytkownicy</h2>
        <input 
          type="text" 
          value={newRole} 
          onChange={(e) => setNewRole(e.target.value)} 
          placeholder="Nowa ranga" 
        />
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.role}
              <button onClick={() => changeUserRole(user.id)}>Zmień Rangę</button>
              <button onClick={() => removeUserRole(user.id)}>Usuń Rangę</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Zarządzanie Komentarzami */}
      <div>
        <h2>Komentarze</h2>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              {comment.text}
              <button onClick={() => removeComment(comment.id)}>Usuń Komentarz</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
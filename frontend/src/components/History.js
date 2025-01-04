import React, { useState, useEffect } from "react";
import '../styles/History.css';
import '../styles/styles.css';
import Cookies from 'js-cookie';

const History = () => {
  const [history, setHistory] = useState([]); // Stan na dane o historii
  const [likedProducts, setLikedProducts] = useState({}); // Stan na polubienia
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [error, setError] = useState(null); // Stan błędów

 // Pobieranie danych z backendu
useEffect(() => {
  const fetchHistory = async () => {
    try {
      const userId = Cookies.get('user_id'); // Pobieranie user_id z ciasteczek
      if (!userId) {
        throw new Error('Nie znaleziono user_id w ciasteczkach.');
      }

      const response = await fetch(`http://localhost:5000/historia/${userId}`); // Przekazywanie user_id jako parametru
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania historii.');
      }

      const data = await response.json();
      setHistory(data.historia); // Ustawienie danych w stanie
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchHistory();
}, []);

  const handleLikeClick = (productId) => {
    setLikedProducts((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId], // Zmiana stanu kliknięcia (toggle)
    }));
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>Błąd: {error}</div>;
  }

  return (
    <div className="History">
      <h1>Historia</h1>
      <div className="History-list">
        {history.map((item, index) => (
          <div key={index} className="History-card">
            <img
              src={item.image_url || 'https://via.placeholder.com/150'} // Placeholder, jeśli brak obrazka
              alt={item.nazwa_alkoholu}
              className="History-image"
            />
            <div className="History-info">
              <h2>{item.nazwa_alkoholu}</h2>
              <p>{`Data: ${item.data}`}</p>
              <p>{`Ilość wypitego alkoholu: ${item.ilosc_wypitego_ml} ml`}</p>
            </div>
            <button
              className={`like-button ${likedProducts[item.id] ? 'liked' : ''}`}
              onClick={() => handleLikeClick(item.id)}
            >
              {likedProducts[item.id] ? 'Polubiono' : 'Polub'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;

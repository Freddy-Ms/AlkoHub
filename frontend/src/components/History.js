import React, { useState, useEffect } from "react";
import '../styles/History.css';
import '../styles/styles.css';
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";

const History = () => {
  const [history, setHistory] = useState([]); // Stan na dane o historii
  const [likedProducts, setLikedProducts] = useState({}); // Stan na polubienia
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [error, setError] = useState(null); // Stan błędów
  const navigate = useNavigate(); // Hook do nawigacji

  useEffect(() => {
    const userId = Cookies.get('user_id'); // Pobieranie user_id z ciasteczek

    if (!userId) {
      navigate('/login'); // Przekierowanie na stronę logowania, jeśli brak user_id
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/historia/${userId}`); // Przekazywanie user_id jako parametru
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania historii.');
        }

        const data = await response.json();
        setHistory(data.historia); // Ustawienie danych w stanie

        // Fetch ulubione products
        const favResponse = await fetch(`http://localhost:5000/ulubione/${userId}`);
        if (!favResponse.ok) {
          throw new Error('Błąd podczas pobierania ulubionych.');
        }

        const favData = await favResponse.json();
        const likedIds = favData.map(item => item.id);
        const likedProductsMap = {};
        likedIds.forEach(id => {
          likedProductsMap[id] = true; // Zmieniamy stan na polubiony
        });
        setLikedProducts(likedProductsMap); // Ustawiamy ulubione produkty

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]); // Dodajemy `navigate` jako zależność

  const handleLikeClick = async (productId) => {
    try {
      const userId = Cookies.get('user_id'); // Pobieranie user_id z ciasteczek
      if (!userId) {
        navigate('/login'); // Przekierowanie na stronę logowania
        return;
      }

      const isLiked = likedProducts[productId];

      if (isLiked) {
        // Usuń alkohol z ulubionych
        const response = await fetch(`http://localhost:5000/favourite_delete/${userId}/${productId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setLikedProducts((prevState) => ({
            ...prevState,
            [productId]: false, // Ustawienie stanu na "niepolubiony"
          }));
        }
      } else {
        // Dodaj alkohol do ulubionych
        const response = await fetch(`http://localhost:5000/favourite_add/${userId}/${productId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setLikedProducts((prevState) => ({
            ...prevState,
            [productId]: true, // Ustawienie stanu na "polubiony"
          }));
        }
      }
    } catch (error) {
      console.error('Błąd podczas operacji:', error);
    }
  };

  const handleDeleteClick = async (productId, date) => {
    try {
      const userId = Cookies.get('user_id'); // Pobranie user_id z ciasteczek

      const response = await fetch(
        `http://localhost:5000/delete_from_history/${userId}/${productId}?data=${encodeURIComponent(date)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Błąd podczas usuwania wpisu.');
      }

      const result = await response.json();
      console.log(result.message);

      // Usuwanie wpisu z lokalnego stanu
      setHistory((prevHistory) => prevHistory.filter(
        (item) => !(item.id_alkoholu === productId && item.data === date)
      ));
    } catch (err) {
      console.error(err.message);
    }
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
      <Link to="/addToHistory">
        <button className="History_button">Dodaj do historii</button>
      </Link>
      <div className="History-list">
        {history.map((item, index) => (
          <div key={index} className="History-card">
            <img
              src={item.image_url || 'https://via.placeholder.com/150'}
              alt={item.nazwa_alkoholu}
              className="History-image"
            />
            <div className="History-info">
              <h2>{item.nazwa_alkoholu}</h2>
              <p>{`Data: ${item.data}`}</p>
              <p>{`Ilość wypitego alkoholu: ${item.ilosc_wypitego_ml} ml`}</p>
              <p>{`Zawartość procentowa: ${item.zawartosc_procentowa} %`}</p>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteClick(item.id_alkoholu, item.data)}
            >
              Usuń
            </button>
            <button
              className={`like-button ${likedProducts[item.id_alkoholu] ? 'liked' : ''}`}
              onClick={() => handleLikeClick(item.id_alkoholu)}
            >
              {likedProducts[item.id_alkoholu] ? '❤️' : '🖤'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;

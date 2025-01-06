import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Dodajemy obsługę cookies
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false); // Stan ulubionych
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Stan zalogowania użytkownika
  const [showAddOpinion, setShowAddOpinion] = useState(false); // Nowy stan
  const [newOpinion, setNewOpinion] = useState({ ocena: 0, recenzja: '' }); // Nowa opinia
  const [hoverRating, setHoverRating] = useState(null);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get_product_details/${id}`);
        if (!response.ok) throw new Error('Nie udało się pobrać szczegółów produktu');
        const data = await response.json();
        setProductData(data);

        // Sprawdź, czy produkt jest w ulubionych
        const userId = Cookies.get('user_id'); // Pobieranie user_id z cookies
        if (userId) {
          setIsLoggedIn(true);
          const likeResponse = await fetch(`http://localhost:5000/is_favorite/${userId}/${id}`);
          const likeData = await likeResponse.json();
          setLiked(likeData.is_favorite);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const toggleLike = async () => {
    const userId = Cookies.get('user_id');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      if (liked) {
        await fetch(`http://localhost:5000/favourite_delete/${userId}/${id}`, { method: 'POST' });
        setLiked(false);
      } else {
        await fetch(`http://localhost:5000/favourite_add/${userId}/${id}`, { method: 'POST' });
        setLiked(true);
      }
    } catch (error) {
      console.error('Błąd przy zmianie stanu ulubionych:', error);
    }
  };

  if (isLoading) {
    return <p>Ładowanie szczegółów produktu...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  const { alkohol, opinie, srednia_ocena } = productData;

  // Funkcja konwertująca ocenę na gwiazdki
  const renderRatingStars = (rating) => {
    const fullStars = "⭐".repeat(rating); // Tworzymy pełne gwiazdki
    const emptyStars = "☆".repeat(5 - rating); // Tworzymy puste gwiazdki
    return fullStars + emptyStars; // Łączymy pełne i puste gwiazdki
  };

  const handleAddOpinionClick = () => {
    const userId = Cookies.get('user_id');
    if (!userId) {
      navigate('/login');
      return;
    }
    setShowAddOpinion(!showAddOpinion); // Przełącz widoczność formularza
  };

  const handleOpinionChange = (e) => {
    const { name, value } = e.target;
    setNewOpinion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOpinion = async () => {
    const userId = Cookies.get('user_id');
    if (!userId) return;

    try {
      await fetch(`http://localhost:5000/add_opinion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produkt_id: id,
          user_id: userId,
          ocena: newOpinion.ocena,
          recenzja: newOpinion.recenzja,
        }),
      });

      setProductData((prev) => ({
        ...prev,
        opinie: [
          ...prev.opinie,
          { ...newOpinion, znacznik_czasu: 'Teraz', uzytkownik: 'Ty' },
        ],
      }));
      setShowAddOpinion(false); // Ukryj formularz po dodaniu opinii
      setNewOpinion({ ocena: 0, recenzja: '' }); // Zresetuj formularz
    } catch (error) {
      console.error('Błąd przy dodawaniu opinii:', error);
    }
  };

  return (
    <div className="container">
      {/* Górna część - informacje o produkcie */}
      <div className="product-details">
        <div className="product-details-content">
          <img src={alkohol.image_url} alt={alkohol.nazwa} className="product-image" />
          
          <div className="product-info">
            <h2>{alkohol.nazwa}</h2>
            <div className="product-attributes">
              <p className="average-rating"> <strong>
              Średnia ocen: </strong> {srednia_ocena ? `${srednia_ocena} / 5.0` : 'Brak ocen'}
              </p>
              <p><strong>Rodzaj:</strong> {alkohol.rodzaj}</p>
              <p><strong>Zawartość procentowa:</strong> {alkohol.zawartosc_procentowa}%</p>
              <p><strong>Rok produkcji:</strong> {alkohol.rok_produkcji}</p>
            </div>
            <p className="product-description"> {alkohol.opis}</p>
          </div>
        </div>
        {/* Przycisk like */}
        <button
          className={`Product_like-button ${liked ? 'liked' : ''}`}
          onClick={toggleLike}
        >
          {liked ? '❤️' : '🖤'}
        </button>
      </div>

      {/* Dolna część - Opinie */}
      <div className="opinions">
        <div className="opinions-header">
          <h2>Opinie:</h2>
          <button className="add-opinion-button" onClick={handleAddOpinionClick}>
            {showAddOpinion ? 'Anuluj' : 'Dodaj opinię'}
          </button>
        </div>

        {showAddOpinion && (
          <div className="opinion-form">
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${newOpinion.ocena >= star ? 'filled' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setNewOpinion({ ...newOpinion, ocena: star })}
                >
                  {hoverRating >= star || newOpinion.ocena >= star ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <textarea
              name="recenzja"
              value={newOpinion.recenzja}
              onChange={handleOpinionChange}
              placeholder="Napisz swoją opinię..."
            />
            <button onClick={handleSubmitOpinion}>Zatwierdź opinię</button>
          </div>
        )}


        {opinie.length > 0 ? (
          <ul>
            {opinie.map((opinia, index) => (
              <li key={index} className="opinion-item">
                <p><strong>Data:</strong> {opinia.znacznik_czasu}</p>
                <p><strong>Użytkownik:</strong> {opinia.uzytkownik}</p>
                <p><strong>Ocena:</strong> {opinia.ocena}</p>
                <p><strong>Recenzja:</strong> {opinia.recenzja || 'Brak recenzji'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak opinii.</p>
        )}

        
      </div>
    </div>
  );
};

export default ProductDetail;

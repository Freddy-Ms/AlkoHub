import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false); // Stan do przechowywania informacji o polubieniu

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get_product_details/${id}`);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać szczegółów produktu');
        }
        const data = await response.json();
        setProductData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (isLoading) {
    return <p>Ładowanie szczegółów produktu...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  const { alkohol, opinie, srednia_ocena } = productData;

  const toggleLike = () => {
    setLiked((prevLiked) => !prevLiked);
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
              <p><strong>Rodzaj:</strong> {alkohol.rodzaj}</p>
              <p><strong>Zawartość procentowa:</strong> {alkohol.zawartosc_procentowa}%</p>
              <p><strong>Rok produkcji:</strong> {alkohol.rok_produkcji}</p>
            </div>
            <p className="product-description"> {alkohol.opis}</p>
          </div>
        </div>
        {/* Przycisk like w prawym górnym rogu */}
        <button className={`Product_like-button ${liked ? 'liked' : ''}`} onClick={toggleLike}>
          {liked ? '❤️' : '🖤'} {/* Czarny serce, gdy nie polubione, czerwony serce, gdy polubione */}
        </button>
      </div>

      {/* Dolna część - Opinie */}
      <div className="opinions">
        <h2>Opinie:</h2>
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
        <h3>Średnia ocena: {srednia_ocena || 'Brak ocen'}</h3>
      </div>
    </div>
  );
};

export default ProductDetail;

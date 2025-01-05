import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams(); // Pobieramy ID produktu z URL
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div>
      <h1>{alkohol.nazwa}</h1>
      <p>Rodzaj: {alkohol.rodzaj}</p>
      <p>{alkohol.opis}</p>
      <p>Zawartość procentowa: {alkohol.zawartosc_procentowa}%</p>
      <p>Rok produkcji: {alkohol.rok_produkcji}</p>
      <img src={alkohol.image_url} alt={alkohol.nazwa} />
      <h2>Opinie:</h2>
      {opinie.length > 0 ? (
        <ul>
          {opinie.map((opinia, index) => (
            <li key={index}>
              <p>Data: {opinia.znacznik_czasu}</p>
              <p>Użytkownik: {opinia.uzytkownik}</p>
              <p>Ocena: {opinia.ocena}</p>
              <p>Recenzja: {opinia.recenzja || 'Brak recenzji'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak opinii.</p>
      )}
      <h3>Średnia ocena: {srednia_ocena || 'Brak ocen'}</h3>
    </div>
  );
};

export default ProductDetail;

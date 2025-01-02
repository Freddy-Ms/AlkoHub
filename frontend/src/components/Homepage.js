import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import '../styles/Homepage.css';

const Homepage = () => {
  const [products, setProducts] = useState([]);  // Stan dla produktów
  const [visibleProducts, setVisibleProducts] = useState(20);  // Stan dla liczby widocznych produktów
  const [isLoading, setIsLoading] = useState(true);  // Stan ładowania danych
  const [error, setError] = useState(null);  // Stan błędu (jeśli wystąpi)

  useEffect(() => {
    // Funkcja do pobierania danych z backendu
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/getProducts');  // Zmienna URL zależna od Twojego backendu
        if (!response.ok) {
          throw new Error('Nie udało się pobrać produktów');
        }
        const data = await response.json();
        setProducts(data);  // Ustawiamy dane w stanie
      } catch (err) {
        setError(err.message);  // Jeśli wystąpi błąd, zapisujemy go w stanie
      } finally {
        setIsLoading(false);  // Po zakończeniu ładowania danych
      }
    };

    fetchProducts();  // Uruchamiamy funkcję po załadowaniu komponentu
  }, []);  // Pusta tablica oznacza, że funkcja wykona się tylko raz po załadowaniu komponentu

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisible => prevVisible + 20);  // Zwiększamy liczbę wyświetlanych produktów
  };

  if (isLoading) {
    return <p>Ładowanie produktów...</p>;  // Wyświetlamy komunikat ładowania, jeśli dane są pobierane
  }

  if (error) {
    return <p>Błąd: {error}</p>;  // Wyświetlamy błąd, jeśli wystąpił
  }

  return (
    <div className="homepage-container">
      <div className="filter-container">
        <h3>Filtry</h3>
        <div className="filter-item">
          <h4>Rodzaj alkoholu:</h4>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" value="Gin" />
              Gin
            </label>
            <label>
              <input type="checkbox" value="Likier" />
              Likier
            </label>
            <label>
              <input type="checkbox" value="Piwo" />
              Piwo
            </label>
            <label>
              <input type="checkbox" value="Rum" />
              Rum
            </label>
            <label>
              <input type="checkbox" value="Tequila" />
              Tequila
            </label>
            <label>
              <input type="checkbox" value="Wino" />
              Wino
            </label>
            <label>
              <input type="checkbox" value="Whisky" />
              Whisky
            </label>
            <label>
              <input type="checkbox" value="Wódka" />
              Wódka
            </label>
          </div>
        </div>
      </div>

      <div className="product-container">
        <div className="product-list">
          {products.slice(0, visibleProducts).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        {visibleProducts < products.length && (
          <button className="load-more-btn" onClick={loadMoreProducts}>
            Pokaż więcej
          </button>
        )}
      </div>
    </div>
  );
};

export default Homepage;

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';  // Importujemy bibliotekę Cookies
import '../styles/Homepage.css';
import '../styles/styles.css';
import '../styles/Liked.css';

const Liked = () => {
  const [products, setProducts] = useState([]);  // Stan dla produktów
  const [visibleProducts, setVisibleProducts] = useState(18);  // Stan dla liczby widocznych produktów
  const [isLoading, setIsLoading] = useState(true);  // Stan ładowania danych
  const [error, setError] = useState(null);  // Stan błędu (jeśli wystąpi)
  const [selectedCategories, setSelectedCategories] = useState([]);  // Stan dla zaznaczonych kategorii

  useEffect(() => {
    // Funkcja do pobierania danych z backendu
    const fetchProducts = async () => {
      try {
        // Pobranie user_id z ciasteczek
        const userId = Cookies.get('user_id');

        if (!userId) {
          setError('Nie znaleziono użytkownika');
          return;
        }

        // Tworzymy URL z parametrami
        const query = selectedCategories.length
          ? `http://localhost:5000/ulubione/${userId}?categories=${selectedCategories.join(',')}`
          : `http://localhost:5000/ulubione/${userId}`;  // Jeśli brak kategorii, pobieramy wszystkie produkty

        const response = await fetch(query);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać ulubionych alkoholi');
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
  }, [selectedCategories]);  // Hook zależy od `selectedCategories`, więc będzie się uruchamiał za każdym razem, gdy zmienią się kategorie

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisible => prevVisible + 20);  // Zwiększamy liczbę wyświetlanych produktów
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(c => c !== category); // Remove category if already selected
      } else {
        return [...prevCategories, category]; // Add category if not selected
      }
    });
  };

  if (isLoading) {
    return <p>Ładowanie produktów...</p>;  // Wyświetlamy komunikat ładowania, jeśli dane są pobierane
  }

  if (error) {
    return <p>Błąd: {error}</p>;  // Wyświetlamy błąd, jeśli wystąpił
  }

  return (
    <div className="liked-container">
      <div className="favorites-header">
      <h1>Polubione</h1>
      </div>
      <div className="filter-container">
        <h3>Filtry</h3>
        <div className="filter-item">
          <h4>Rodzaj:</h4>
          <div className="category-buttons">
          {['Gin', 'Likier', 'Piwo', 'Rum', 'Tequila', 'Wino', 'Whisky', 'Wódka'].map(category => (
            <button
              key={category}
              className={`category-button ${selectedCategories.includes(category) ? 'selected' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
          </div>
        </div>
      </div>

      <div className="product-container">
        <div className="product-list">
        {products.slice(0, visibleProducts).map((product, index) => (
            <Link key={index} to={`/product/${product.id}`} className="product-link">
              <ProductCard product={product} />
            </Link>
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

export default Liked;

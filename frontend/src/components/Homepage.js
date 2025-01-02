import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import '../styles/Homepage.css';

const Homepage = () => {
  const [products, setProducts] = useState([]);  // Stan dla produktów
  const [visibleProducts, setVisibleProducts] = useState(20);  // Stan dla liczby widocznych produktów
  const [isLoading, setIsLoading] = useState(true);  // Stan ładowania danych
  const [error, setError] = useState(null);  // Stan błędu (jeśli wystąpi)
  const [selectedCategories, setSelectedCategories] = useState([]);  // Stan dla zaznaczonych kategorii

  useEffect(() => {
    // Funkcja do pobierania danych z backendu
    const fetchProducts = async () => {
      try {
        // Tworzymy URL z parametrami
        const query = selectedCategories.length
          ? `http://localhost:5000/getProducts?categories=${selectedCategories.join(',')}`
          : 'http://localhost:5000/getProducts';  // Jeśli brak kategorii, pobieramy wszystkie produkty

        const response = await fetch(query);  // Zmienna URL zależna od Twojego backendu
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
  }, [selectedCategories]);  // Hook zależy od `selectedCategories`, więc będzie się uruchamiał za każdym razem, gdy zmienią się kategorie

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisible => prevVisible + 20);  // Zwiększamy liczbę wyświetlanych produktów
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories(prevCategories => {
      if (checked) {
        // Jeśli checkbox jest zaznaczony, dodajemy kategorię do stanu
        return [...prevCategories, value];
      } else {
        // Jeśli checkbox jest odznaczony, usuwamy kategorię z stanu
        return prevCategories.filter(category => category !== value);
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
    <div className="homepage-container">
      <div className="filter-container">
        <h3>Filtry</h3>
        <div className="filter-item">
          <h4>Rodzaj alkoholu:</h4>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                value="Gin"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes('Gin')}
              />
              Gin
            </label>
            <label>
              <input
                type="checkbox"
                value="Likier"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes('Likier')}
              />
              Likier
            </label>
            <label>
              <input
                type="checkbox"
                value="Piwo"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes('Piwo')}
              />
              Piwo
            </label>
            <label>
              <input
                type="checkbox"
                value="Rum"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes('Rum')}
              />
              Rum
            </label>
            <label>
              <input
                type="checkbox"
                value="Tequila"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes('Tequila')}
              />
              Tequila
            </label>
            <label>
              <input
                type="checkbox"
                value="Wino"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes('Wino')}
              />
              Wino
            </label>
            <label>
              <input
                type="checkbox"
                value="Whisky"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes('Whisky')}
              />
              Whisky
            </label>
            <label>
              <input
                type="checkbox"
                value="Wódka"
                onChange={handleCategoryChange}
                checked={selectedCategories.includes('Wódka')}
              />
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

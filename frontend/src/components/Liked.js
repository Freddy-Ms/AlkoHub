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
  const [categories, setCategories] = useState([]); // State for fetched categories

  useEffect(() => {
    // Fetch favorite products from backend
    const fetchProducts = async () => {
      try {
        const userId = Cookies.get('user_id');
        if (!userId) {
          setError('User not found');
          return;
        }

        const query = selectedCategories.length
          ? `http://localhost:5000/ulubione/${userId}?categories=${selectedCategories.join(',')}`
          : `http://localhost:5000/ulubione/${userId}`;

        const response = await fetch(query);
        if (!response.ok) {
          throw new Error('Failed to fetch favorite products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories]);

  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/alcohol_types');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data); // Set categories from backend
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisible => prevVisible + 20);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(c => c !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="liked-container">
      <div className="favorites-header">
        <h1>Liked</h1>
      </div>
      <div className="filter-container">
        <h3>Filters</h3>
        <div className="filter-item">
          <h4>Type:</h4>
          <div className="category-buttons">
            {categories.map((category, index) => (
              <button
                key={index}
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
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default Liked;

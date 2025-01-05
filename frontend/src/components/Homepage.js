import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css';
import '../styles/styles.css';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(18);
  const [categories, setCategories] = useState([]); // State for fetched categories

  useEffect(() => {
    // Fetch products from backend
    const fetchProducts = async () => {
      try {
        const query = selectedCategories.length
          ? `http://localhost:5000/getProducts?categories=${selectedCategories.join(',')}`
          : 'http://localhost:5000/getProducts';
        const response = await fetch(query);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
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
    <div className="homepage-container">
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

export default Homepage;

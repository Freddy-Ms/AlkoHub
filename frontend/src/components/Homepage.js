import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css';
import '../styles/styles.css';
import Cookies from 'js-cookie';
const role = Cookies.get("role");

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(18);
  const [categories, setCategories] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nazwa: '',
    rodzaj: '',
    opis: '',
    zawartosc_procentowa: '',
    rok_produkcji: '',
    grafika: '',
  });

  useEffect(() => {
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

  const closeModal = () => {
    setIsAddOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const { nazwa, rodzaj, opis, zawartosc_procentowa, rok_produkcji, grafika } = newProduct;

    const productData = {
      nazwa,
      rodzaj,
      opis,
      zawartosc_procentowa: parseFloat(zawartosc_procentowa),
      rok_produkcji: parseInt(rok_produkcji, 10),
      grafika,
    };

    try {
      const response = await fetch('http://localhost:5000/add_alcohol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Alkohol dodany pomyślnie');
        closeModal();
        window.location.reload();
      } else {
        alert(`Błąd: ${result.message}`);
      }
    } catch (err) {
      alert('Wystąpił błąd podczas dodawania alkoholu');
    }
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
        {(role === "Administrator" || role === "Degustator") && (
          <button 
            className="AddProductButton"
            onClick={() => setIsAddOpen(true)}
          >
            Dodaj alkohol
          </button>
        )}
        <h3>Filtry</h3>
        <div className="filter-item">
          <h4>Rodzaj:</h4>
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
            Pokaż więcej
          </button>
        )}
      </div>

      {isAddOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Dodaj Alkohol</h2>
            <form onSubmit={handleAddProduct}>
              <label>
                Nazwa:
                <input 
                  type="text" 
                  name="nazwa" 
                  value={newProduct.nazwa} 
                  onChange={handleInputChange} 
                  required
                />
              </label>
              <label>
                Typ:
                <select 
                  name="rodzaj" 
                  value={newProduct.rodzaj || ""} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="" disabled hidden>Wybierz typ</option> 
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))
                  ) : (
                    <option disabled>Brak dostępnych kategorii</option>
                  )}
                </select>
              </label>
              <label>
                Zawartość procentowa (%):
                <input 
                  type="number" 
                  name="zawartosc_procentowa" 
                  value={newProduct.zawartosc_procentowa} 
                  onChange={handleInputChange} 
                  step="0.1" 
                  min="0" 
                  required
                />
              </label>
              <label>
                Rok produkcji:
                <input 
                  type="number" 
                  name="rok_produkcji" 
                  value={newProduct.rok_produkcji} 
                  onChange={handleInputChange} 
                  required
                />
              </label>
              <label>
                Opis:
                <textarea 
                  name="opis" 
                  rows="4" 
                  value={newProduct.opis} 
                  onChange={handleInputChange} 
                  required
                />
              </label>
              <label>
                Grafika (URL):
                <input 
                  type="url" 
                  name="grafika" 
                  value={newProduct.grafika} 
                  onChange={handleInputChange} 
                  required
                />
              </label>
              <button type="submit">Dodaj</button>
            </form>
            <button onClick={closeModal}>Zamknij</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;

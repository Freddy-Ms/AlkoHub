import React, { useState } from 'react';
import ProductCard from './ProductCard';
import '../styles/Homepage.css';

const Homepage = () => {
  const allProducts = [
    { name: 'Kielecki', description: 'Opis produktu 1', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Żywiec', description: 'Opis produktu 2', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'xd', description: 'Opis produktu 3', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'pyszne', description: 'Opis produktu 4', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 5', description: 'Opis produktu 5', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 6', description: 'Opis produktu 6', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 7', description: 'Opis produktu 7', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 8', description: 'Opis produktu 8', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 9', description: 'Opis produktu 9', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 10', description: 'Opis produktu 10', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 11', description: 'Opis produktu 11', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 12', description: 'Opis produktu 12', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 13', description: 'Opis produktu 13', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 14', description: 'Opis produktu 14', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 15', description: 'Opis produktu 15', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 16', description: 'Opis produktu 16', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 17', description: 'Opis produktu 17', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 18', description: 'Opis produktu 18', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 19', description: 'Opis produktu 19', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 20', description: 'Opis produktu 20', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 21', description: 'Opis produktu 21', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 22', description: 'Opis produktu 22', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 23', description: 'Opis produktu 23', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 24', description: 'Opis produktu 24', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { name: 'Produkt 25', description: 'Opis produktu 25', image: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    
  ];

  const [visibleProducts, setVisibleProducts] = useState(20);

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisible => prevVisible + 20);
  };

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
          {allProducts.slice(0, visibleProducts).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        {visibleProducts < allProducts.length && (
          <button className="load-more-btn" onClick={loadMoreProducts}>
            Pokaż więcej
          </button>
        )}
      </div>
    </div>
  );
};

export default Homepage;

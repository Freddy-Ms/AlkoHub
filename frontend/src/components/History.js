import React from 'react';
import { useState } from "react"; // Importujemy useState
//import { Link, useNavigate } from 'react-router-dom';
import '../styles/History.css';
import '../styles/styles.css';

const products = [
    { id: 1, name: 'Produkt 1', description: 'Opis produktu 1', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png'  },
    { id: 2, name: 'Produkt 2', description: 'Opis produktu 2', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { id: 3, name: 'Produkt 3', description: 'Opis produktu 3', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
    { id: 4, name: 'Produkt 4', description: 'Opis produktu 4', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1775/1775321.png' },
];

const History = () => {
  const [likedProducts, setLikedProducts] = useState({}); // Stan do przechowywania klikniętych przycisków

  const handleLikeClick = (productId) => {
    setLikedProducts((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId], // Zmiana stanu kliknięcia (toggle)
    }));
  };

    return (
        <div className="History">
          <h1>Historia</h1>
          <div className="History-list">
            {products.map((product) => (
              <div key={product.id} className="History-card">
                <img src={product.imageUrl} alt={product.name} className="History-image" />
                <div className="History-info">
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                </div>
                <button
                  className={`like-button ${likedProducts[product.id] ? 'liked' : ''}`}
                  onClick={() => handleLikeClick(product.id)}
                >
                  {likedProducts[product.id] ? 'Polubiono' : 'Polub'}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
};

export default History;

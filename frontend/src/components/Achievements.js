import React from 'react';
import '../styles/History.css';
import '../styles/styles.css';

const products = [
    { id: 1, name: 'Osiągnięcie 1', description: 'Opis Osiągnięcia 1', imageUrl: 'https://img.freepik.com/darmowe-wektory/trofeum_78370-345.jpg'  },
    { id: 2, name: 'Osiągnięcie 2', description: 'Opis Osiągnięcia 2', imageUrl: 'https://img.freepik.com/darmowe-wektory/trofeum_78370-345.jpg' },
    { id: 3, name: 'Osiągnięcie 3', description: 'Opis Osiągnięcia 3', imageUrl: 'https://img.freepik.com/darmowe-wektory/trofeum_78370-345.jpg' },
    { id: 4, name: 'Osiągnięcie 4', description: 'Opis Osiągnięcia 4', imageUrl: 'https://img.freepik.com/darmowe-wektory/trofeum_78370-345.jpg' },
];

const Achievements = () => {
    return (
        <div className="History">
          <h1>Osiągnięcia</h1>
          <div className="History-list">
            {products.map((product) => (
              <div key={product.id} className="History-card">
                <img src={product.imageUrl} alt={product.name} className="History-image" />
                <div className="History-info">
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
};

export default Achievements;

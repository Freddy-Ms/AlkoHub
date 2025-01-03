import React from 'react';
import '../styles/Profil.css'; // Możesz dodać stylizacje w tym pliku

const products = [
    { id: 1, name: 'Osiągnięcie 1', description: 'Opis Osiągnięcia 1', imageUrl: 'https://img.freepik.com/darmowe-wektory/trofeum_78370-345.jpg'  },
    { id: 2, name: 'Osiągnięcie 2', description: 'Opis Osiągnięcia 2', imageUrl: 'https://img.freepik.com/darmowe-wektory/trofeum_78370-345.jpg' },
    { id: 3, name: 'Osiągnięcie 3', description: 'Opis Osiągnięcia 3', imageUrl: 'https://img.freepik.com/darmowe-wektory/trofeum_78370-345.jpg' },
    { id: 4, name: 'Osiągnięcie 4', description: 'Opis Osiągnięcia 4', imageUrl: 'https://img.freepik.com/darmowe-wektory/trofeum_78370-345.jpg' },
];

const Profile = () => {
  return (
    <div className="Profile_container">
        <div className="Profile_header">
        <h1>Profil</h1>
        </div>

        <div className="Profile_content">
            <div className="Profile_section user-data">
                <h2>Dane użytkownika</h2>
                <p>Nazwa uytkownika: </p>
                <p>Waga</p>
                <p>Wzrost</p>
                <p>Płeć</p>
            </div>

            <div className="Profile_section achievements">
                <h2>Osiągnięcia zdobyte</h2>
                <div className="Profile-list compact">
                    {products.map((product) => (
                        <div key={product.id} className="Profile-card compact">
                            <img src={product.imageUrl} alt={product.name} className="Profile-image compact" />
                            <div className="Profile-info compact">
                                <h3>{product.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="Profile_section status">
                <h2>Stan</h2>
                <p>Trzeźwy</p>
                <p>"Ilość promili: "</p>
            </div>
        </div>
    </div>
  );
}

export default Profile;

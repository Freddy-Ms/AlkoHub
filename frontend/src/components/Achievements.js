import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios do wysyłania zapytań HTTP
import Cookies from 'js-cookie'; // Import do obsługi ciasteczek
import { useNavigate } from 'react-router-dom'; // Hook do nawigacji
import '../styles/History.css';
import '../styles/styles.css';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]); // Stan do przechowywania osiągnięć
    const [loading, setLoading] = useState(true); // Dodajemy stan dla ładowania
    const navigate = useNavigate(); // Hook do nawigacji

    useEffect(() => {
        const userId = Cookies.get('user_id'); // Pobieranie user_id z ciasteczek

        if (!userId) {
            navigate('/login'); // Przekierowanie na stronę logowania, jeśli brak user_id
            return;
        }

        const fetchAchievements = async () => {
            try {
                const response = await axios.get('http://localhost:5000/osiagniecia'); // Pobranie danych z API
                setAchievements(response.data); // Ustawienie danych w stanie
                setLoading(false); // Zakończenie ładowania
            } catch (error) {
                console.error('Błąd podczas pobierania danych o osiągnięciach', error);
                setLoading(false); // Zakończenie ładowania, nawet jeśli wystąpił błąd
            }
        };

        fetchAchievements(); // Wywołanie funkcji po załadowaniu komponentu
    }, [navigate]); // Dodajemy `navigate` jako zależność

    if (loading) {
        return <div>Ładowanie...</div>; // Jeśli dane jeszcze się ładują, pokażemy komunikat
    }

    return (
        <div className="History">
            <h1>Osiągnięcia</h1>
            <div className="History-list">
                {achievements.map((achievement) => (
                    <div key={achievement.id_osiagniecia} className="History-card">
                        <img 
                            src={achievement.image_url || 'https://img.freepik.com/darmowe-wektory/trofeum_78370-345.jpg'}  // W przyszłości możliwe dodanie do bazy danych i backendu wyglądu achivki
                            alt={achievement.nazwa_osiagniecia} 
                            className="History-image" 
                        />
                        <div className="History-info">
                            <h2>{achievement.nazwa_osiagniecia}</h2>
                            <p>{achievement.opis_osiagniecia}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Achievements;

import { useState } from "react";
import "../styles/AddToHistory.css";

const AddToHistory = () => {
  const SearchableDropdown = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState(""); // Nazwa wybranego alkoholu
    const [isOpen, setIsOpen] = useState(false); // Czy lista jest otwarta
    const [amount, setAmount] = useState(""); // Ilość w ml
    const [selectedAlcohol, setSelectedAlcohol] = useState(""); // Wybrany alkohol

    // Filtrowanie danych na podstawie wprowadzonego tekstu
    const filteredData = data.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Funkcja obsługująca kliknięcie w element listy
    const handleItemClick = (item) => {
      setSelectedAlcohol(item);
      setSearchTerm(item); // Ustawienie terminu wyszukiwania na wybrany alkohol
      setIsOpen(false); // Zamykanie listy po wybraniu elementu
    };

    // Funkcja do obsługi zmiany wartości w polu ilości (mililitrów)
    const handleAmountChange = (e) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) { // Sprawdzenie, czy wpisana wartość to liczba całkowita
        setAmount(value);
      }
    };

    const handleFocus = () => setIsOpen(true);
    const handleBlur = () => setTimeout(() => setIsOpen(false), 200); // Opóźnienie dla lepszej obsługi kliknięć w przyciski

    // Warunek wyświetlania przycisku "Dodaj"
    const isAddButtonEnabled = selectedAlcohol && amount !== "";

    return (
      <div className="dropdown-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Wyszukaj alkohol..."
        />
        {isOpen && (
          <div className="dropdown-list">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <button
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleItemClick(item)} // Kliknięcie na przycisk
                >
                  {item}
                </button>
              ))
            ) : (
              <div className="dropdown-item">Brak wyników</div>
            )}
          </div>
        )}

        {/* Pokazuje pole do wpisania ilości tylko po wybraniu alkoholu */}
        {selectedAlcohol && (
          <div className="amount-container">
            <label htmlFor="amount">Ilość (ml):</label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Wpisz ilość w ml"
            />
          </div>
        )}

        {/* Przycisk Dodaj - pojawia się dopiero po wybraniu alkoholu i wpisaniu ilości */}
        {isAddButtonEnabled && (
          <button 
            className="add-button"
            onClick={() => alert(`Dodano ${amount} ml ${selectedAlcohol}`)}
          >
            Dodaj
          </button>
        )}
      </div>
    );
  };

  const data = ["Wódka", "Piwo", "Wino", "Tequila", "Rum", "Whisky", "Gin"];

  return (
    <div className="login-container">
      <h1>Dodawanie alkoholu do historii</h1>
      <SearchableDropdown data={data} />
    </div>
  );
};

export default AddToHistory;

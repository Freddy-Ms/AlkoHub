import { useState, useEffect } from "react";
import "../styles/AddToHistory.css";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AddToHistory = () => {
  const [data, setData] = useState([]); // Store fetched products
  const [selectedAlcohol, setSelectedAlcohol] = useState(null); // Store selected alcohol details (name and ID)
  const [searchTerm, setSearchTerm] = useState(""); // Separate search term for dropdown
  const [amount, setAmount] = useState(""); // Amount of alcohol in ml
  const [userId, setUserId] = useState(null); // Initialize as null until fetched from cookies
  const navigate = useNavigate();

  // Fetch user_id from cookies on component mount
  useEffect(() => {
    const storedUserId = Cookies.get('user_id');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10)); // Convert to integer
    } else {
      navigate('/login'); // Redirect to login if user_id is missing
    }
  }, [navigate]);

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5000/getProducts")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleAddToHistory = () => {
    if (!userId) {
      alert("Brak zalogowanego użytkownika.");
      return;
    }

    if (selectedAlcohol && amount) {
      fetch(`http://localhost:5000/add_to_history/${userId}/${selectedAlcohol.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ilosc_wypitego_ml: parseInt(amount, 10),
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.message) {
            alert("Dodano pomyślnie");
            navigate("/history");
          } else {
            alert("Błąd: " + result.error);
          }
        })
        .catch((error) => console.error("Error adding to history:", error));
    } else {
      alert("Wybierz alkohol i podaj ilość.");
    }
  };

  const SearchableDropdown = ({ data, onAlcoholSelect, selectedAlcohol }) => {
    const [searchTerm, setSearchTerm] = useState(""); // Name of selected alcohol
    const [isOpen, setIsOpen] = useState(false); // Is the list open?

    // Filter data based on the entered search term
    const filteredData = data.filter((item) =>
      item.nazwa_alkoholu.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );

    // Handle item click
    const handleItemClick = (item) => {
      onAlcoholSelect(item); // Set selected alcohol in main component
      setSearchTerm(item.nazwa_alkoholu); // Set searchTerm to the selected alcohol name
      setIsOpen(false); // Close the list after selecting an item
    };

    const handleFocus = () => setIsOpen(true);
    const handleBlur = () => setTimeout(() => setIsOpen(false), 200);

    // Allow editing of selected alcohol
    const handleChangeSearchTerm = (e) => {
      const value = e.target.value;
      setSearchTerm(value); 
      // If value is empty, reset the selected alcohol
      if (value === "") {
        onAlcoholSelect(null);
      } else if (!selectedAlcohol || selectedAlcohol.nazwa_alkoholu !== value) {
        onAlcoholSelect(null); // Reset if user types a different name
      }
    };

    return (
      <div className="dropdown-container">
        <input
          type="text"
          value={selectedAlcohol ? selectedAlcohol.nazwa_alkoholu : searchTerm}
          onChange={handleChangeSearchTerm}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={selectedAlcohol ? "" : "Wyszukaj alkohol..."} // Show placeholder only if no alcohol is selected
        />
        {isOpen && !selectedAlcohol && (
          <div className="dropdown-list">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <button
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleItemClick(item)}
                >
                  {item.nazwa_alkoholu}
                </button>
              ))
            ) : (
              <div className="dropdown-item">Brak wyników</div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="login-container">
      <h1>Dodawanie alkoholu do historii</h1>
      <SearchableDropdown
        data={data}
        onAlcoholSelect={(alcohol) => setSelectedAlcohol(alcohol)} // Set selected alcohol
        selectedAlcohol={selectedAlcohol}
      />
      {selectedAlcohol && (
        <div className="amount-container">
          <label htmlFor="amount">Ilość (ml):</label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setAmount(value); // Accept only digits
            }}
            placeholder="Wpisz ilość w ml"
          />
        </div>
      )}
      {selectedAlcohol && amount && (
        <button className="add-button" onClick={handleAddToHistory}>
          Dodaj
        </button>
      )}
    </div>
  );
};

export default AddToHistory;

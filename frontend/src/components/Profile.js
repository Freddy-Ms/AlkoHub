import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import Cookies from "js-cookie";
import {useNavigate } from "react-router-dom"; // Importujemy useNavigate
const role = Cookies.get("role");

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [completedAchievements, setCompletedAchievements] = useState([]);
  const [status, setStatus] = useState("");
  const [bac, setBac] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Stan edycji
  const [editedUserInfo, setEditedUserInfo] = useState({
    waga: userInfo?.waga,
    wiek: userInfo?.wiek,
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // Stan do trzymania zapytania wyszukiwania
  const [filteredUsers, setFilteredUsers] = useState(users); // Przechowuje przefiltrowanych użytkowników
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const userId = Cookies.get("user_id");
    if (!userId) {
      navigate("/login"); // Przekierowanie na stronę logowania, jeśli brak user_id
      return;
    }
    fetchUserInfo(userId);
    fetchCompletedAchievements(userId);
    fetchUserHistory24h(userId);
    fetchUsers();
    fetchRoles();
    fetchFeedback(userId);
  }, [navigate]); // Dodanie `navigate` do zależności

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/getUserInfo/${userId}`
      );
      const data = await response.json();
      if (data.user_info) {
        setUserInfo(data.user_info);
        setEditedUserInfo({
          waga: data.user_info.waga,
          wiek: data.user_info.wiek,
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchCompletedAchievements = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/getCompletedAchievements/${userId}`
      );
      const data = await response.json();
      if (data.completed_achievements) {
        setCompletedAchievements(data.completed_achievements);
      }
    } catch (error) {
      console.error("Error fetching completed achievements:", error);
    }
  };

  const fetchUserHistory24h = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/historia/24h/${userId}`
      );
      const data = await response.json();
      if (data.promile !== undefined && data.stan !== undefined) {
        setBac(data.promile);
        setStatus(data.stan);
      }
    } catch (error) {
      console.error("Error fetching user history:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_all_users");
      const data = await response.json();
      if (data.length > 0) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:5000/roles");
      const data = await response.json();
      if (data.length > 0) {
        setRoles(data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchFeedback = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/get_all_opinions/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Błąd:", errorData.message);
        setFeedbackList([]);
        return;
      }
      const data = await response.json();
      setFeedbackList(data || []);
    } catch (error) {
      console.error("Błąd podczas pobierania opinii:", error);
      setFeedbackList([]);
    }
  };  
  
  const handleEditClick = () => {
    setIsEditing(true); // Włącza tryb edycji
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    const userId = Cookies.get("user_id");
    try {
      const response = await fetch(
        `http://localhost:5000/update_user_info/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUserInfo),
        }
      );
      const data = await response.json();
      if (data.success) {
        setIsEditing(false); // Wyłącza tryb edycji
        fetchUserInfo(userId); // Pobiera zaktualizowane dane
      }
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false); // Anulowanie edycji
    setEditedUserInfo({
      waga: userInfo?.waga,
      wiek: userInfo?.wiek,
    }); // Przywrócenie początkowych danych
  };

  const handleRoleModalToggle = () => {
    setIsRoleModalOpen(!isRoleModalOpen);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role); // Załadowanie aktualnej roli użytkownika
    setIsDropdownOpen(false);
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      const response = await fetch(
        `http://localhost:5000/edit_role/${selectedUser.id}/${selectedRole}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (
        data.message === "Rola użytkownika została pomyślnie zaktualizowana"
      ) {
        alert("Rola została zaktualizowana!");
        handleRoleModalToggle();
        window.location.reload();
      } else {
        alert("Wystąpił problem podczas zmiany roli.");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filtrowanie użytkowników na podstawie zapytania
    const filtered = users.filter((user) =>
      user.nazwa.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);

    if (query.length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleEditOpinionClick = (feedback) => {
    setSelectedFeedback(feedback);
    setIsEditModalOpen(true);
  };
  
  const handleSaveEdit = async () => {
    const userId = Cookies.get("user_id");
    try {
      const response = await fetch(`/update_opinion/${userId}/${selectedFeedback.id_alkoholu}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recenzja: selectedFeedback.recenzja,
        }),
      });

      if (response.ok) {
        // Aktualizowanie stanu i zamknięcie modalu
        setIsEditModalOpen(false);
        window.location.href = 'http://localhost:3000';
      } else {
        console.error('Błąd zapisywania opinii');
      }
    } catch (error) {
      console.error('Błąd zapisu: ', error);
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>; // Wyświetlanie komunikatu "Ładowanie" gdy dane są pobierane
  }

  return (
    <div className="Profile_container">
      <div className="Profile_header">
        <h1>Profil</h1>
      </div>

      <div className="Profile_content">
        <div className="Profile_section user-data">
          <h2>Dane użytkownika</h2>
          {userInfo && (
            <>
              <p>Nazwa użytkownika: {userInfo.nazwa}</p>
              <p>Płeć: {userInfo.plec}</p>
              <p>Email: {userInfo.mail}</p>
              <p>Ranga: {userInfo.ranga}</p>
              <p>
                Waga:{" "}
                {isEditing ? (
                  <input
                    type="number"
                    name="waga"
                    value={editedUserInfo.waga}
                    onChange={handleChange}
                  />
                ) : (
                  userInfo.waga
                )}
              </p>
              <p>
                Wiek:{" "}
                {isEditing ? (
                  <input
                    type="number"
                    name="wiek"
                    value={editedUserInfo.wiek}
                    onChange={handleChange}
                  />
                ) : (
                  userInfo.wiek
                )}
              </p>
              {isEditing && (
                <>
                  <button
                    className="Profile_save-button"
                    onClick={handleSaveClick}
                  >
                    Zapisz zmiany
                  </button>
                  <button
                    className="Profile_primary-button"
                    onClick={handleCancelClick}
                  >
                    Anuluj
                  </button>
                </>
              )}
            </>
          )}
        </div>

        <div className="Profile_section achievements">
          <h2>Osiągnięcia zdobyte</h2>
          <div className="Profile-list compact">
            {completedAchievements.map((achievement, index) => (
              <div key={index} className="Profile-card compact">
                <img
                  src="https://img.freepik.com/darmowe-wektory/trofeum_78370-345.jpg"
                  alt={achievement.nazwa_osiagniecia}
                  className="Profile-image compact"
                />
                <div className="Profile-info compact">
                  <h3>{achievement.nazwa_osiagniecia}</h3>
                  <p>Data ukończenia: {achievement.data_ukonczenia}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="Profile_section status">
          <h2>Stan</h2>
          <p>Stan: {status !== null ? status : "Trzeźwy"}</p>
          <p>Ilość promili: {bac !== null ? bac : "0"}</p>
        </div>
      </div>

      {/* Przycisk Edytuj profil poniżej wszystkich sekcji */}
      <div className="Profile_button-container">
        <button className="Profile_primary-button" onClick={handleEditClick}>
          Edytuj profil
        </button>
        {role === "Administrator" && (
          <button
            className="Profile_primary-button"
            onClick={handleRoleModalToggle}
          >
            Rangi użytkowników
          </button>
        )}
      </div>
      {/* Sekcja z opiniami */}
      <div className="FeedbackSection">
        <h3>Opinie użytkownika:</h3>
        {feedbackList.length > 0 ? (
          feedbackList.map((feedback, index) => (
            <div key={index} className="FeedbackCard">
              <a href={`/product/${feedback.id_alkoholu}`} className="FeedbackImageLink">
                <img 
                  src={feedback.image_url} 
                  alt={feedback.nazwa_alkoholu} 
                  className="FeedbackImage" 
                />
              </a>
              <div className="FeedbackDetails">
                <p><strong>Produkt:</strong> {feedback.nazwa_alkoholu}</p>
                {isEditModalOpen && selectedFeedback?.id === feedback.id ? (
                  <>
                    <p>
                      <strong>Ocena:</strong>
                      <input
                        type="number"
                        name="ocena"
                        value={selectedFeedback?.ocena || ''}
                        onChange={handleChange}
                        min="1"
                        max="10"
                      />
                    </p>
                    <textarea
                      name="recenzja"
                      value={selectedFeedback?.recenzja || ''}
                      onChange={handleChange}
                      className="FeedbackTextArea"
                    />
                  </>
                ) : (
                  <>
                    <p><strong>Ocena:</strong> {feedback.ocena}</p>
                    <p><strong>Komentarz:</strong> {feedback.recenzja}</p>
                  </>
                )}
                <p><strong>Dodano:</strong> {new Date(feedback.znacznik_czasu).toLocaleDateString()}</p>
              </div>
              <button 
                className="EditOpinionButton"
                onClick={() => handleEditOpinionClick(feedback)}
              >
                Edytuj
              </button>
              {isEditModalOpen && (
                <div className="EditModal">
                  <div className="ModalContent">
                    <h4>Edytuj opinię</h4>
                    <textarea 
                      className="EditOpinionTextarea"
                      value={selectedFeedback?.recenzja || ''}
                      onChange={(e) => setSelectedFeedback({...selectedFeedback, recenzja: e.target.value})}
                    />
                    <button className="EditOpinionButton" onClick={handleSaveEdit}>Zapisz</button>
                    <button className="EditOpinionButton" onClick={() => setIsEditModalOpen(false)}>Anuluj</button>
                  </div>
                </div>
              )}

            </div>
          ))
        ) : (
          <p>Użytkownik nie dodał jeszcze żadnych opinii.</p>
        )}
      </div>
      {/* Okienko do edycji ról */}
      {isRoleModalOpen && (
        <div className="RoleModal">
          <div className="RoleModalHeader">
            <button className="closeButton" onClick={handleRoleModalToggle}>Zamknij</button>
          </div>
          <div className="UserList">
            <h3>Wybierz użytkownika do zmiany roli:</h3>
            <input
              type="text"
              placeholder="Wpisz nazwę użytkownika"
              value={searchQuery}
              onChange={handleSearchChange} // Wywołanie funkcji filtrowania
              onClick={() => setIsDropdownOpen(true)}
            />
            {isDropdownOpen && (
              <ul className="dropdown-list">
              {(searchQuery ? filteredUsers : users).length ? (
                (searchQuery ? filteredUsers : users).map((user) => (
                  <li key={user.id} onClick={() => handleUserSelect(user)}>
                    {user.nazwa} ({user.ranga})
                  </li>
                ))
              ) : (
                <li>Brak pasujących użytkowników</li>
              )}
            </ul>
            )}
          </div>

          {selectedUser && (
          <div className="RoleChange">
            <h4>Wybierz rolę dla: {selectedUser.nazwa} ({selectedUser.ranga})</h4>
            <select
              value={selectedRole || ""}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="" disabled>
                Wybierz
              </option>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.ranga}
                  </option>
                ))
              ) : (
                <option disabled>Brak dostępnych ról</option>
              )}
            </select>
            <button className="Profile_primary-button" onClick={handleRoleChange}>Zmień rolę</button>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

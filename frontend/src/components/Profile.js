import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom"; // Importujemy useNavigate
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

  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false); // Stan kontrolujący wyświetlanie okienka do edycji ról
  const [searchQuery, setSearchQuery] = useState(""); // Zapytanie do wyszukiwania
  const [usersList, setUsersList] = useState([]); // Lista użytkowników
  const [selectedUser, setSelectedUser] = useState(null); // Wybrany użytkownik
  const [role, setRole] = useState(Cookies.get("role"));
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Cookies.get("user_id");
    if (!userId) {
      navigate("/login"); // Przekierowanie na stronę logowania, jeśli brak user_id
      return;
    }
    fetchUserInfo(userId);
    fetchCompletedAchievements(userId);
    fetchUserHistory24h(userId);
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

  // Funkcja do wyszukiwania użytkowników
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Funkcja do wyszukiwania użytkowników po nazwie
  const handleSearchSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/searchUsers?query=${searchQuery}`
      );
      const data = await response.json();
      if (data.users) {
        setUsersList(data.users);
      }
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };

  // Funkcja do przypisania roli użytkownikowi
  const handleAssignRole = async (userId, newRole) => {
    try {
      const response = await fetch(
        `http://localhost:5000/assignRole/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert(`Rola dla użytkownika ${userId} została zaktualizowana.`);
      }
    } catch (error) {
      console.error("Error assigning role:", error);
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
        {/* Przycisk dla administratora */}
        {role === "Administrator" && (
          <button
            className="Profile_primary-button"
            onClick={() => setIsRoleModalVisible(!isRoleModalVisible)} // Zmieniamy stan widoczności okna
          >
            Rangi użytkowników
          </button>
        )}
      </div>
      {/* Okienko do edycji ról */}
      {isRoleModalVisible && role === "Administrator" && (
        <div className="RoleModal">
          <h3>Wyszukaj użytkownika</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Wyszukaj użytkownika po nazwie"
          />
          <button onClick={handleSearchSubmit}>Szukaj</button>

          {usersList.length > 0 && (
            <div className="UserList">
              <ul>
                {usersList.map((user) => (
                  <li key={user.id}>
                    {user.nazwa} - 
                    <select
                      onChange={(e) => handleAssignRole(user.id, e.target.value)}
                      defaultValue={user.ranga}
                    >
                      <option value="user">Użytkownik</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

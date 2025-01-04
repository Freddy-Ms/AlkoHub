import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
const role = Cookies.get('role');
const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [completedAchievements, setCompletedAchievements] = useState([]);
  const [status, setStatus] = useState("");
  const [bac, setBac] = useState(null);
  useEffect(() => {
    const userId = Cookies.get("user_id");
    if (userId) {
      // Fetch user data
      fetchUserInfo(userId);
      fetchCompletedAchievements(userId);
      fetchUserHistory24h(userId);
    }
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/getUserInfo/${userId}`
      );
      const data = await response.json();
      if (data.user_info) {
        setUserInfo(data.user_info);
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
              <p>Waga: {userInfo.waga}</p>
              <p>Wiek: {userInfo.wiek}</p>
              <p>Płeć: {userInfo.plec}</p>
              <p>Email: {userInfo.mail}</p>
              <p>Ranga: {userInfo.ranga}</p>
              {role === 'Administrator' && (
                <Link to="/adminPage">
                  <button className="Profile_primary-button">Panel administratora</button>
                </Link>
              )}
              {role === 'Degustator' && (
                <Link to="/testerPage">
                  <button className="Profile_primary-button">Panel degustatora</button>
                </Link>
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
          <p>Stan: {status}</p>
          <p>Ilość promili: {bac !== null ? bac : "Brak danych"}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

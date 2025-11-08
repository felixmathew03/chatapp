import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaUser } from "react-icons/fa";
import axios from "axios";
import route from "../route";
import "./UserProfile.scss";
import Nav from "../Nav/Nav";
import { useNavigate, useParams } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("Auth");
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      const { status, data } = await axios.get(
        `${route()}user/userprofile/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (status === 200) {
        setUserProfile(data);
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("Auth");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="UserProfile">
        <Nav />
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="UserProfile">
      <Nav />
      <div className="profile-card">
        <div className="avatar">
          <div className="img_container">
            <div className="hover-effect"></div>
            <img
              className="avatar-image"
              src={userProfile.profile || "/default-avatar.png"}
              alt="Profile"
            />
          </div>
        </div>

        <div className="headings">
          <FaUser size={20} className="icon" />
          <h2>{userProfile.username || "Unnamed User"}</h2>
        </div>

        <div className="contact-info">
          <ul>
            <li>
              <FaPhoneAlt className="icon" />
              <h2>{userProfile.phone || "No phone added"}</h2>
            </li>
            <li>
              <FaEnvelope className="icon" />
              <h2>{userProfile.email || "No email available"}</h2>
            </li>
          </ul>
        </div>
        <hr className="divider" />
      </div>
    </div>
  );
};

export default UserProfile;

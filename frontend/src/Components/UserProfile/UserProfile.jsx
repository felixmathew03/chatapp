import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaUser } from "react-icons/fa";
import axios from "axios";
import route from "../route";
import './UserProfile.scss';
import Nav from "../Nav/Nav";
import { useNavigate, useParams } from "react-router-dom";

const UserProfile = () => {
    const {id}=useParams();
  const navigate = useNavigate();
  const value = localStorage.getItem("Auth");
  const [userProfile, setUserProfile] = useState({});
  
  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      const { status, data } = await axios.get(`${route()}userprofile/${id}`, {
        headers: { "Authorization": `Bearer ${value}` }
      });
      if (status === 200) {
        setUserProfile(data);
      } else {
        alert(data.msg);
        // navigate('/login');
      }
    } catch (error) {
    //   navigate('/login');
    }
  };

  return (
    <div className="UserProfile">
      <Nav />
      <div className="profile-card">
        <div className="avatar">
          <div className="img_container">
            <div className="hover-effect"></div>
            <img
              className="avatar-image"
              src={userProfile.profile}
              alt="Avatar"
            />
          </div>
        </div>
        <div className="headings">
          <FaUser size={20} className="icon" />
          <h2>{userProfile.username}</h2> {/* Display username as h2 */}
        </div>
        <div className="contact-info">
          <ul>
            <li>
              <FaPhoneAlt className="icon" />
              <h2>{userProfile.phone}</h2> {/* Display phone as h2 */}
            </li>
            <li>
              <FaEnvelope className="icon" />
              <h2>{userProfile.email}</h2> {/* Display email as h2 */}
            </li>
          </ul>
        </div>
        <hr className="divider" />
      </div>
    </div>
  );
};

export default UserProfile;

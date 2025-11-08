import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaCamera, FaUser } from "react-icons/fa";
import { FiCheck, FiX, FiEdit } from "react-icons/fi";
import axios from "axios";
import route from "../route";
import "./Profile.scss";
import { useNavigate } from "react-router-dom";

const Profile = ({ setIsProfileOpen }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("Auth");
  const [profile, setProfile] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isUEdit, setIsUEdit] = useState(false);
  const [isPEdit, setIsPEdit] = useState(false);
  const [isEEdit, setIsEEdit] = useState(false);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      const { status, data } = await axios.get(`${route()}user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (status === 200) {
        setEmail(data.email);
        setUsername(data.username);
        setPhone(data.phone);
        setProfile(data.profile || "/img/default-avatar.png");
      } else {
        alert(data.msg);
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const updateUserDetail = async (payload, successMsg) => {
    try {
      const { status, data } = await axios.put(
        `${route()}user/editdetails`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (status === 201 && data.msg === "success") {
        alert(successMsg);
        getDetails();
      }
    } catch (error) {
      alert("Update failed");
    }
  };

  // Handlers
  const handleImageChange = async (e) => {
    const profile = await convertToBase64(e.target.files[0]);
    setProfile(profile);
    updateUserDetail({ profile }, "Profile photo updated!");
  };

  const handleSaveName = () => {
    updateUserDetail({ username }, "Username updated!");
    setIsUEdit(false);
  };

  const handleSavePhone = () => {
    updateUserDetail({ phone }, "Phone number updated!");
    setIsPEdit(false);
  };

  const handleSaveEmail = () => {
    updateUserDetail({ email }, "Email updated!");
    setIsEEdit(false);
  };

  const handleCancel = () => {
    setIsProfileOpen(false);
  };

  return (
    <div className="Profile">
      <div className="profile-card">
        <img
          src="/img/close_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg"
          className="close"
          alt="close"
          onClick={handleCancel}
        />
        <div className="avatar">
          <div className="img_container">
            <div className="hover-effect"></div>
            <img
              className="avatar-image"
              src={profile}
              alt="Avatar"
              onError={(e) => (e.target.src = "/img/default-avatar.png")}
            />
            <label htmlFor="image-upload" className="edit-icon">
              <FaCamera />
            </label>
            <input
              id="image-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="headings">
          <FaUser size={20} className="icon" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="edit-input"
            disabled={!isUEdit}
          />
          {isUEdit ? (
            <button className="save-btn">
              <FiCheck onClick={handleSaveName} color="green" />{" "}
              <FiX onClick={() => setIsUEdit(false)} color="red" />
            </button>
          ) : (
            <button className="save-btn">
              <FiEdit onClick={() => setIsUEdit(true)} />
            </button>
          )}
        </div>

        <div className="contact-info">
          <ul>
            <li>
              <FaPhoneAlt className="icon" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="edit-input"
                disabled={!isPEdit}
              />
              {isPEdit ? (
                <button className="save-btn">
                  <FiCheck onClick={handleSavePhone} color="green" />{" "}
                  <FiX onClick={() => setIsPEdit(false)} color="red" />
                </button>
              ) : (
                <button className="save-btn">
                  <FiEdit onClick={() => setIsPEdit(true)} />
                </button>
              )}
            </li>

            <li>
              <FaEnvelope className="icon" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="edit-input"
                disabled={!isEEdit}
              />
              {isEEdit ? (
                <button className="save-btn">
                  <FiCheck onClick={handleSaveEmail} color="green" />{" "}
                  <FiX onClick={() => setIsEEdit(false)} color="red" />
                </button>
              ) : (
                <button className="save-btn">
                  <FiEdit onClick={() => setIsEEdit(true)} />
                </button>
              )}
            </li>
          </ul>
        </div>

        <hr className="divider" />
      </div>
    </div>
  );
};

export default Profile;

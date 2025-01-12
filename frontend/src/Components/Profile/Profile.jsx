import React, { useState,useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaCamera, FaSave } from "react-icons/fa"; 
import axios from "axios";
import route from "../route";
import './Profile.scss';
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate=useNavigate();
  const value=localStorage.getItem("Auth")
  const [profile, setProfile] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState(0);
  const [email, setEmail] = useState("");
  useEffect(()=>{
    getDetails();
    },[])
    const getDetails=async()=>{
        try {
        const {status,data}=await axios.get(`${route()}profile`,{headers:{"Authorization":`Bearer ${value}`}})
        if(status==200){
            setEmail(data.email);
            setUsername(data.username);
            setPhone(data.phone);
            setProfile(data.profile)
        }else{
            alert(data.msg);
            navigate('/login')
        }
        } catch (error) {
        navigate('/login')
        }
    }
  // Edit functions
  const handleImageChange = async(e) => {
    const profile=await convertToBase64(e.target.files[0]);
    const {status,data}=await axios.put(`${route()}editdetails`,{profile},{headers:{"Authorization":`Bearer ${value}`}});
    if (status==201) {
        if (data.msg=="success") {
            alert("Photo edited");
            getDetails();
        }
      }
  };
  function convertToBase64(file) {
    return new Promise((resolve,reject)=>{
        const fileReader=new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload=()=>{
            resolve(fileReader.result)
        }
        fileReader.onerror= (error)=>{
            reject(error)
        }
    })
  }
  const handleNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Save changes functions
  const handleSaveName =async () => {
    const {status,data}=await axios.put(`${route()}editdetails`,{username},{headers:{"Authorization":`Bearer ${value}`}});
      if (status==201) {
        if (data.msg=="success") {
            alert("Name edited");
          getDetails();
        }
      }
  };

  const handleSavePhone = async() => {
    const {status,data}=await axios.put(`${route()}editdetails`,{phone},{headers:{"Authorization":`Bearer ${value}`}});
      if (status==201) {
        if (data.msg=="success") {
            alert("Phone edited");
          getDetails();
        }
      }
  };

  const handleSaveEmail = async() => {
    const {status,data}=await axios.put(`${route()}editdetails`,{phone},{headers:{"Authorization":`Bearer ${value}`}});
      if (status==201) {
        if (data.msg=="success") {
            alert("Phone edited");
          getDetails();
        }
      }
  };

  return (
    <div className="Profile">
      <Nav />
      <div className="profile-card">
        <div className="avatar">
          <div className="img_container">
            <div className="hover-effect"></div>
            <img
              className="avatar-image"
              src={profile}
              alt="Avatar"
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
          <input
            type="text"
            value={username}
            onChange={handleNameChange}
            className="edit-input"
          />
          <button className="save-btn" onClick={handleSaveName}>
            <FaSave />
          </button>
        </div>
        <div className="contact-info">
          <ul>
            <li>
              <FaPhoneAlt className="icon" />
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                className="edit-input"
              />
              <button className="save-btn" onClick={handleSavePhone}>
                <FaSave />
              </button>
            </li>
            <li>
              <FaEnvelope  className="icon" />
              <input
                type="text"
                value={email}
                onChange={handleEmailChange}
                className="edit-input"
              />
              <button className="save-btn" onClick={handleSaveEmail}>
                <FaSave />
              </button>
            </li>
          </ul>
        </div>
        <hr className="divider" />
      </div>
    </div>
  );
};

export default Profile;

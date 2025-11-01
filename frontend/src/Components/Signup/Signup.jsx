import React, { useState } from 'react';
import {useNavigate,Link} from 'react-router-dom';
import axios from 'axios';
import route from '../route';
import { AiOutlineUpload, AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlinePhone } from "react-icons/ai";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import './Signup.scss'

const Signup = () => {
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [user,setDetails]=useState({
    email:"",
    password:"",
    cpassword:"",
    username:"",
    phone:"",
    profile:""
  })
  const handleChange=(e)=>{
    setDetails((pre)=>({...pre,[e.target.name]:e.target.value}))
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const {data,status}=await axios.post(`${route()}auth/signup`,user)
    
    if(status===201){
      alert(data.msg);
      navigate('/login');
    }
    else{
      alert(data.msg)
    }
    } catch (error) {
      alert("error occured")
    }
  };
  const handleFile=async(e)=>{
    const profile=await convertToBase64(e.target.files[0])
    setDetails((pre)=>({...pre,profile:profile}))
  }
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
  return (
    <div className="Signup">
        <form className="modern-form">
      <div className="form-title">Sign Up</div>

      <div className="form-body">
        <div className="input-group photo-upload">
            <div className="input-wrapper">
            <label htmlFor="photo-upload" className="photo-label">
                <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="form-input photo-input"
                onChange={handleFile}
                />
                {user.profile ? (
                <img src={user.profile} alt="Profile" className="photo-preview" />
                ) : (
                <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}>Upload Photo <AiOutlineUpload size={18} /> </span>
                )}
            </label>
            </div>
        </div>
        
        <div className="input-group">
          <div className="input-wrapper">
            <AiOutlineMail className="input-icon" />
            <input
            name='email'
                id='email'
              placeholder="Email"
              className="form-input"
              type="email"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <AiOutlineLock className="input-icon" />
            <input
            name='password'
                id='password'
              placeholder="Password"
              className="form-input"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoIosEyeOff className="eye-icon" /> : <IoIosEye className="eye-icon" />}
            </button>
          </div>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <AiOutlineLock className="input-icon" />
            <input
            name='cpassword'
                id='cpassword'
              placeholder="Confirm Password"
              className="form-input"
              type={showCPassword ? "text" : "password"}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowCPassword(!showCPassword)}
            >
              {showCPassword ? <IoIosEyeOff className="eye-icon" /> : <IoIosEye className="eye-icon" />}
            </button>
          </div>
        </div>
        
        <div className="input-group">
          <div className="input-wrapper">
            <AiOutlineUser className="input-icon" />
            <input
                name='username'
                id='username'
              placeholder="Username"
              className="form-input"
              type="text"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <AiOutlinePhone className="input-icon" />
            <input
            name='phone'
                id='phone'
              placeholder="Phone Number"
              className="form-input"
              type="number"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <button className="submit-button" type="submit" onClick={handleSubmit}>
        <span className="button-text">Create Account</span>
        <div className="button-glow"></div>
      </button>

      <div className="form-footer">
        <a className="login-link" href="/login">
          Already have an account? <span>Login</span>
        </a>
      </div>
    </form>
    </div>
  );
};

export default Signup;
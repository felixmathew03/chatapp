import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import route from '../route';
import { FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa'
import './Login.scss';

const Login = () => {
    const navigate = useNavigate();
  const [loginDetails, setDetails] = useState({
    email: "",
    password: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { status, data } = await axios.post(`${route()}signin`, loginDetails, { Headers: { "Content-Type": "application/json" } });
      if (status === 200) {
        localStorage.setItem("Auth", data.token);
        alert(data.msg)
        // notify(data.msg || "Login successful!");
        navigate('/');
      } else { 
        alert(data.msg );
      }
    } catch (error) {
      alert("Wrong password");
    }
  };

  const handleChange = (e) => {
    setDetails((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };
  return (
    <div className='Login'>
        <div class="form-container">
            <p class="title">Login</p> 
            <form class="form" onSubmit={handleSubmit}>
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" onChange={handleChange} placeholder=""/>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" onChange={handleChange} placeholder=""/>
                    <div class="forgot">
                        <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
                    </div>
                </div>
                <button type='submit' class="sign">Sign in</button>
            </form>
            <div class="social-message">
                <div class="line"></div>
                <p class="message">Login with social accounts</p>
                <div class="line"></div>
            </div>
            <div class="social-icons">
            <button aria-label="Log in with Google" className="icon">
                <FaGoogle size={20} color="#fff" />
            </button>
            <button aria-label="Log in with Twitter" className="icon">
                <FaTwitter size={20} color="#fff" />
            </button>
            <button aria-label="Log in with GitHub" className="icon">
                <FaGithub size={20} color="#fff" />
            </button>
            </div>
            <p class="signup">Don't have an account?
                <a rel="noopener noreferrer" href="#" class="">Sign up</a>
            </p>
        </div>
    </div>
  )
}

export default Login

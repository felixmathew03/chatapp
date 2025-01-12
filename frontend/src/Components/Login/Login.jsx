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
        <div className="form-container">
            <p className="title">Login</p> 
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" onChange={handleChange} placeholder=""/>
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" onChange={handleChange} placeholder=""/>
                    <div className="forgot">
                        <a rel="noopener noreferrer" href="/forgotpassword">Forgot Password ?</a>
                    </div>
                </div>
                <button type='submit' className="sign">Sign in</button>
            </form>
            <div className="social-message">
                <div className="line"></div>
                <p className="message">Login with social accounts</p>
                <div className="line"></div>
            </div>
            <div className="social-icons">
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
            <p className="signup">Don't have an account?
                <a rel="noopener noreferrer" href="/signup" className="">Sign up</a>
            </p>
        </div>
    </div>
  )
}

export default Login

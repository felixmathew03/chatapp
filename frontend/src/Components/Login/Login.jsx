import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import route from '../route';
import { FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa';
import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const [loginDetails, setDetails] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginDetails;
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const { status, data } = await axios.post(
        `${route()}auth/signin`,
        loginDetails,
        { headers: { "Content-Type": "application/json" } }
      );

      if (status === 200) {
        localStorage.setItem("Auth", data.token);
        alert(data.msg || "Login successful");
        navigate('/');
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.msg || "Something went wrong. Try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className='Login'>
      <div className="form-container">
        <p className="title">Login</p> 

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              onChange={handleChange} 
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              onChange={handleChange} 
              placeholder="Enter your password"
            />
            <div className="forgot">
              <Link to="/forgotpassword">Forgot Password?</Link>
            </div>
          </div>

          <button type="submit" className="sign" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
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

        <p className="signup">
          Don't have an account?
          <Link to="/signup"> Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


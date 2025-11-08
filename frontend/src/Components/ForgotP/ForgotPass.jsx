import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import route from "../route";
import "./ForgotPass.scss";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      const { status, data } = await axios.post(
        `${route()}auth/forgotpassword`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (status === 200) {
        localStorage.setItem("email", email);
        alert(data.msg);
        navigate("/login");
      } else {
        alert(data.msg || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Server error");
    }
  };

  return (
    <div className="ForgotPass">
      <div className="form-container">
        <div className="logo-container">Forgot Password</div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
            />
          </div>

          <button type="submit">
            <span>Continue</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 74 74"
              height="34"
              width="34"
            >
              <circle strokeWidth="3" stroke="black" r="35.5" cy="37" cx="37" />
              <path
                fill="black"
                d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z"
              ></path>
            </svg>
          </button>
        </form>

        <p className="signup-link">
          Don’t have an account?
          <Link to="/signup" className="signup-link link">
            {" "}
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPass;

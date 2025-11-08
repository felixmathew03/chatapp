import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import route from "../route";
import {
  AiOutlineUpload,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlinePhone,
} from "react-icons/ai";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import "./Signup.scss";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [user, setDetails] = useState({
    email: "",
    password: "",
    cpassword: "",
    username: "",
    phone: "",
    profile: "",
  });

  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = async (e) => {
    const profile = await convertToBase64(e.target.files[0]);
    setDetails((prev) => ({ ...prev, profile }));
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, cpassword, username, phone } = user;

    if (!email || !password || !cpassword || !username || !phone) {
      return alert("All fields are required!");
    }
    if (password !== cpassword) {
      return alert("Passwords do not match!");
    }

    try {
      const { data, status } = await axios.post(
        `${route()}auth/signup`,
        user,
        { headers: { "Content-Type": "application/json" } }
      );

      if (status === 201) {
        alert(data.msg);
        navigate("/login");
      } else {
        alert(data.msg || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.msg || "An unexpected error occurred during signup"
      );
    }
  };

  return (
    <div className="Signup">
      <form className="modern-form" onSubmit={handleSubmit}>
        <div className="form-title">Sign Up</div>

        <div className="form-body">
          {/* ===== Profile Upload ===== */}
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
                  <img
                    src={user.profile}
                    alt="Profile"
                    className="photo-preview"
                  />
                ) : (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    Upload Photo <AiOutlineUpload size={18} />
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* ===== Email ===== */}
          <div className="input-group">
            <div className="input-wrapper">
              <AiOutlineMail className="input-icon" />
              <input
                name="email"
                placeholder="Email"
                className="form-input"
                type="email"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ===== Password ===== */}
          <div className="input-group">
            <div className="input-wrapper">
              <AiOutlineLock className="input-icon" />
              <input
                name="password"
                placeholder="Password"
                className="form-input"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoIosEyeOff className="eye-icon" />
                ) : (
                  <IoIosEye className="eye-icon" />
                )}
              </button>
            </div>
          </div>

          {/* ===== Confirm Password ===== */}
          <div className="input-group">
            <div className="input-wrapper">
              <AiOutlineLock className="input-icon" />
              <input
                name="cpassword"
                placeholder="Confirm Password"
                className="form-input"
                type={showCPassword ? "text" : "password"}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCPassword(!showCPassword)}
              >
                {showCPassword ? (
                  <IoIosEyeOff className="eye-icon" />
                ) : (
                  <IoIosEye className="eye-icon" />
                )}
              </button>
            </div>
          </div>

          {/* ===== Username ===== */}
          <div className="input-group">
            <div className="input-wrapper">
              <AiOutlineUser className="input-icon" />
              <input
                name="username"
                placeholder="Username"
                className="form-input"
                type="text"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ===== Phone ===== */}
          <div className="input-group">
            <div className="input-wrapper">
              <AiOutlinePhone className="input-icon" />
              <input
                name="phone"
                placeholder="Phone Number"
                className="form-input"
                type="tel"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* ===== Submit Button ===== */}
        <button className="submit-button" type="submit">
          <span className="button-text">Create Account</span>
          <div className="button-glow"></div>
        </button>

        <div className="form-footer">
          <Link to="/login" className="login-link">
            Already have an account? <span>Login</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;

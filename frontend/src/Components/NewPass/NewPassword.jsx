import React, { useState } from "react";
import route from "../route";
import axios from "axios";
import "./NewPassword.scss";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const [passwordDetails, setDetails] = useState({
    npassword: "",
    cpassword: "",
  });

  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { npassword, cpassword } = passwordDetails;

    if (!npassword || !cpassword) {
      alert("Please fill in all fields");
      return;
    }

    if (npassword !== cpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { status, data } = await axios.post(
        `${route()}auth/changepassword`,
        { ...passwordDetails, email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (status === 201) {
        localStorage.removeItem("email");
        alert(data.msg);
        navigate("/login");
      } else {
        alert(data.msg || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Password not changed");
    }
  };

  return (
    <div className="NewPassword">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Conversa</p>
        <p className="message">
          Please enter your new password below. Make sure it’s strong and secure!
        </p>

        <input
          name="npassword"
          id="npassword"
          placeholder="New Password"
          type="password"
          className="input"
          onChange={handleChange}
        />

        <input
          name="cpassword"
          id="cpassword"
          placeholder="Confirm Password"
          type="password"
          className="input"
          onChange={handleChange}
        />

        <button className="submit" type="submit">
          Submit
        </button>

        <p className="signin">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </form>
    </div>
  );
};

export default NewPassword;

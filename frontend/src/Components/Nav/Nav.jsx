import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import route from "../route";
import { useNavigate } from "react-router-dom";
import "./Nav.scss";

const Nav = ({ setIsProfileOpen }) => {
  const token = localStorage.getItem("Auth");
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ useCallback to avoid infinite loop warning
  const getUserDetails = useCallback(async () => {
    try {
      const { status, data } = await axios.get(`${route()}user/nav`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (status === 200) setUser(data.user);
      else navigate("/login");
    } catch (error) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("Auth");
      navigate("/login");
    }
  };

  return (
    <>
      {/* ====== Top Navbar ====== */}
      <nav className="nav">
        <img
          src="/img/dehaze_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"
          alt="menu"
          className="menu-icon"
          onClick={() => setIsSidebarOpen(true)}
        />
        <input
          type="search"
          placeholder="Search chats"
          className="search-input"
        />
      </nav>

      {/* ====== Sidebar Overlay ====== */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ====== Sidebar ====== */}
      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <h1 className="sidebar-title">CONVERSA!</h1>

        <div className="sidebar-user">
          <img
            src={user?.profile || "/img/default-avatar.png"}
            alt={user?.username || "User"}
            className="sidebar-profile"
          />
          <h3>{user?.username || "User"}</h3>
        </div>

        <div className="sidebar-actions">
          <button
            onClick={() => {
              setIsProfileOpen(true);
              setIsSidebarOpen(false);
            }}
          >
            Profile
          </button>
          <button
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Nav;

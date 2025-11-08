import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import route from "../route";
import { Link, useNavigate } from "react-router-dom";
import "./ListPeople.scss";

const ListPeople = ({setChatCardId,setIsChatOpen,setIsListPeopleOpen}) => {
  const token = localStorage.getItem("Auth");
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      const res = await axios.get(`${route()}user/listpeople`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setPeople(res.data.people || []);
      } else {
        alert(res.data.msg || "Session expired. Please login again.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching people:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ListPeople">
      <div className="container">
        <h1>Discover People</h1>
        {loading ? (
          <p className="loading">Loading people...</p>
        ) : people.length === 0 ? (
          <p className="no-people">No users found.</p>
        ) : (
          people.map((user) => (
            <button className="content" key={user._id} onClick={() => {
              setChatCardId(user._id);
              setIsChatOpen(true);
              setIsListPeopleOpen(false);
            }}>
              <img
                src={user.profile || "/default-avatar.png"}
                alt={user.username}
                className="profile-img"
              />
              <p>{user.username}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ListPeople;

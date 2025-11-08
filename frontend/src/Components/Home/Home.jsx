import React, { useEffect, useState } from 'react';
import axios from 'axios';
import route from '../route';
import { FaComment } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import './Home.scss';
import Nav from '../Nav/Nav';
import Profile from '../Profile/Profile';
import ChatCard from '../ChatCard/ChatCard';
import ListPeople from '../ListPeople/ListPeople';

const Home = () => {
  const token = localStorage.getItem("Auth");
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [chatCardId, setChatCardId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListPeopleOpen, setIsListPeopleOpen] = useState(false);

  useEffect(() => {
    getChats();
  }, []);

  const getChats = async () => {
    try {
      const { status, data } = await axios.get(`${route()}user/home`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (status === 200) {
        setChats(data.chatmembers);
      } else {
        alert(data.msg);
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const enableChat = (id) => {
    setChatCardId(id);
    setIsChatOpen(!isChatOpen);
  };

  const handleListPeopleClick = () => {
    setIsListPeopleOpen(!isListPeopleOpen);
  }
  return (
    <div className="Home">
      {isProfileOpen && <Profile setIsProfileOpen={setIsProfileOpen} />}
      
      <div className="left">
        <Nav setIsProfileOpen={setIsProfileOpen} />
        
        <div className="container">
          {chats.length === 0 ? (
            <p className="empty">No chats yet.</p>
          ) : (
            chats.map((chat, ind) => (
              <div
                className="content"
                key={chat.user._id}
                onClick={() => enableChat(chat.user._id)}
              >
                <img src={chat.user.profile} alt={chat.user.username} />
                
                <div className="right">
                  <p>
                    {chat.user.username}{" "}
                    {chat.unreadCount > 0 && (
                      <span className="count">({chat.unreadCount})</span>
                    )}
                  </p>

                  <p className="cfoot">
                    {chat.lastMessageSeen ? (
                      <span className="smsg">{chat.lastMessage}</span>
                    ) : (
                      <span className="msg">{chat.lastMessage}</span>
                    )}
                  </p>

                  <small className="time">
                    {new Date(chat.lastMessageAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          className="chatBtn"
          onClick={() => handleListPeopleClick()}
        >
          <FaComment size={30} color="white" /> 
        </button>
      </div>

      <div className="right">
        {isChatOpen && (
          <ChatCard
            id={chatCardId}
            setChatCardId={setChatCardId}
            setIsChatOpen={setIsChatOpen}
          />
        )}
        {isListPeopleOpen && (
          <ListPeople  setChatCardId={setChatCardId} setIsChatOpen={setIsChatOpen} setIsListPeopleOpen={setIsListPeopleOpen}/>
        )}
      </div>
    </div>
  );
};

export default Home;

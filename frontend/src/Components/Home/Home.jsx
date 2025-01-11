import React, { useEffect, useState } from 'react';
import axios from 'axios';
import route from '../route';
import { FaComment } from 'react-icons/fa'; 
import {Link, useNavigate} from 'react-router-dom'
import './Home.scss';

const Home = () => {
    const value=localStorage.getItem("Auth");
    const navigate=useNavigate();
    const [user,setUser]=useState({});
    const [chatMembers,setChatMembers]=useState([{
        profile:"dggg",username:"fgfg"
    },{
        profile:"dggg",username:"fgfg"
    },{
        profile:"dggg",username:"fgfg"
    }])
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    useEffect(()=>{
        // getDetails();
    },[])
    const getDetails=async()=>{
        const {status,data}=await axios.get(`${route()}home`,{headers:{"Authorization":`Bearer ${value}`}})
        if(status==200){
            setUser(data.user);
            setChatMembers(data.chatMembers)
        }else{
            alert(data.msg);
            navigate('/login')
        }
    }
    const togglePopover = () => {
        setIsPopoverVisible(!isPopoverVisible);
    };
    const handleLogout = () => {
        localStorage.removeItem('Auth');
        navigate('/login');
    };
  return (
    <div className='Home'>
      <nav>
        <div className="navbar-logo">
            <img src="/img/logo.jpg" alt="Logo" className="logo-image" />
            <h1 className="website-name">Conversa</h1>
        </div>
        <div className="user">
            <h4>{user.name}</h4>
            {/* Profile Icon & Popover */}
            <div className="profile-containerr">
              <img 
                className="profile-icon" 
                onClick={togglePopover} src={user.profile} alt='user'
              />
              {isPopoverVisible && (
                <div className="profile-popover">
                  <Link to={`/profile`}>
                    <button className="popover-btn">Profile</button>
                  </Link>
                  <button className="popover-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
        </div>
      </nav>
      <div className="container">
        {chatMembers.map((member,ind)=> <div className="content" key={ind}>
                <img src={member.profile} alt={member.username} />
                <p>{member.username}</p>
            </div>
        )}
      </div>
        <button className="chatBtn" onClick={()=>{navigate('/chatcard')}}>
            <FaComment size={30} color="white" />
        </button>
    </div>
  )
}

export default Home

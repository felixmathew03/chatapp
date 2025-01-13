import React,{useState,useEffect} from 'react';
import axios from 'axios';
import route from '../route';
import {Link, useNavigate} from 'react-router-dom';
import './Nav.scss'

const Nav = () => {
    const value=localStorage.getItem("Auth");
    const navigate=useNavigate();
    const [user,setUser]=useState({});
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    useEffect(()=>{
        getDetails();
    },[])
    const getDetails=async()=>{
        try {
          const {status,data}=await axios.get(`${route()}nav`,{headers:{"Authorization":`Bearer ${value}`}})
        if(status==200){
            setUser(data.user);
        }else{
            alert(data.msg);
            navigate('/login')
        }
        } catch (error) {
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
    <nav>
        <Link to={'/'} className="navbar-logo">
                <img src="/img/logo.jpg" alt="Logo" className="logo-image" />
                <h1 className="website-name">CONVERSA !</h1>
        </Link>
        <div className="user">
            <h4>{user.username}</h4>
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
  )
}

export default Nav

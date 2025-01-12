import React, { useEffect, useState } from 'react';
import axios from 'axios';
import route from '../route';
import { FaComment } from 'react-icons/fa'; 
import {Link, useNavigate} from 'react-router-dom'
import './Home.scss';
import Nav from '../Nav/Nav';

const Home = () => {
    const value=localStorage.getItem("Auth");
    const navigate=useNavigate();
    const [chatMembers,setChatMembers]=useState([]);
    useEffect(()=>{
        getDetails();
    },[])
    const getDetails=async()=>{
        try {
          const {status,data}=await axios.get(`${route()}home`,{headers:{"Authorization":`Bearer ${value}`}})
        if(status==200){
            setChatMembers([...new Map(data.chatMembers.map(member => [member._id, member])).values()].reverse());
        }else{
            alert(data.msg);
            navigate('/login')
        }
        } catch (error) {
          navigate('/login')
        }
    }
    
  return (
    <div className='Home'>
      <Nav/>
      <div className="container">
        {chatMembers.map((member,ind)=> <Link to={`/chatcard/${member._id}`} className="content" key={ind}>
                <img src={member.profile} alt={member.username} />
                <p>{member.username}</p>
            </Link>
        )}
      </div>
        <button className="chatBtn" onClick={()=>{navigate('/listpeople')}}>
            <FaComment size={30} color="white" /> 
        </button>
    </div>
  )
}

export default Home

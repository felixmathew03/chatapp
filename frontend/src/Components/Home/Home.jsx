import React, { useEffect, useState } from 'react';
import axios from 'axios';
import route from '../route';
import { FaComment } from 'react-icons/fa'; 
import {Link, useNavigate} from 'react-router-dom'
import './Home.scss';
import Nav from '../Nav/Nav';
import Profile from '../Profile/Profile';
import ChatCard from '../ChatCard/ChatCard';

const Home = () => {
    const value=localStorage.getItem("Auth");
    const navigate=useNavigate();
    const [chatMembers,setChatMembers]=useState([]);
    const [counts,setCounts]=useState([]);
    const [lmessages,setLmessages]=useState([]);
    const [isProfileOpen,setIsProfileOpen]=useState(false);
    const [chatCardId,setChatCardId]=useState(null);  
    const [isChatOpen,setIsChatOpen]=useState(false);
    useEffect(()=>{
        getDetails();
    },[])
    const getDetails=async()=>{
        try {
          const {status,data}=await axios.get(`${route()}user/home`,{headers:{"Authorization":`Bearer ${value}`}})
        if(status==200){
            setChatMembers(data.chatmembers);
            setCounts(data.counts);
            setLmessages(data.lmessages)
        }else{
            alert(data.msg);
            navigate('/login')
        }
        } catch (error) {
          navigate('/login')
        }
    }
    const enableChat=(id)=>{
        setChatCardId(id);
        setIsChatOpen(true);
    }
  return (
    <div className='Home'>
      {isProfileOpen&&<Profile setIsProfileOpen={setIsProfileOpen}/>}
      <div className="left">
        <Nav setIsProfileOpen={setIsProfileOpen}/>
        <div className="container">
          {chatMembers.map((member,ind)=> <div className="content" key={ind} onClick={()=>enableChat(member._id)}>
                  <img src={member.profile} alt={member.username} />
                  <div className="right">
                    <p>{member.username} {counts[ind]>0&&(<span className='count'>({counts[ind]})</span>)}</p>
                    <p className="cfoot">{(lmessages[ind].seen)?<span className='smsg '>{lmessages[ind].message}</span>:<span className='msg'>{lmessages[ind].message}</span>}</p>
                    </div>
              </div>
          )}
        </div>
          <button className="chatBtn" onClick={()=>{navigate('/listpeople')}}>
              <FaComment size={30} color="white" /> 
          </button>
      </div>
      <div className="right">
          {isChatOpen&&<ChatCard id={chatCardId} setChatCardId={setChatCardId} setIsChatOpen={setIsChatOpen}/>}  
      </div>
    </div>
  )
}

export default Home

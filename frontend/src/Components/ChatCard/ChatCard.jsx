import React, { useState,useEffect } from 'react';
import route from '../route';
import axios from 'axios';
import './ChatCard.scss';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'; 
import { AiOutlineSend } from 'react-icons/ai';

const ChatCard = () => {
  const value=localStorage.getItem("Auth")
  const {id}=useParams();
  const [uid,setUid]=useState('')
  const [message, setMessage] = useState('');
  const [receiver, setReceiver] = useState({});
  const [messages, setMessages] = useState([]);
  useEffect(()=>{
    getDetails();
  },[])
  const getDetails=async()=>{
      const {status,data}=await axios.get(`${route()}chat/${id}`,{headers:{"Authorization":`Bearer ${value}`}})
      if(status==200){
          setMessages(data.chats);
          setReceiver(data.receiver);
          setUid(data.uid);
      }else{
          alert(data.msg);
          navigate('/login')
      }
  }
  const handleSend = async() => {
    if (message.trim()) {
      const currentDate = new Date(); 
      const [date,time]=currentDate.toLocaleString().split(', ')
      const {status,data}=await axios.post(`${route()}addmessage/${id}`,{message,date,time},{headers:{"Authorization":`Bearer ${value}`}});
      if (status==201) {
        if (data.msg=="success") {
          getDetails();
        }
      }
      setMessage('');
    }
  }; 
  return (
    <div className="chat-card">
      <div className="chat-header">
        <Link to={'/'} className="h2">
        <FiArrowLeft className="back-icon" /> 
          <img src={receiver.profile} alt="" />
          <p>{receiver.username}</p>
        </Link>
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={(msg.senderId==uid)||(msg.receiver==uid)?`message outgoing`:`message incoming`} >
            <p>{msg.message}</p>
            <p className="foot">{msg.time}</p>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) =>  setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSend}><AiOutlineSend style={{ fontSize: '24px' }} /> </button>
      </div>
    </div>
  );
};

export default ChatCard;

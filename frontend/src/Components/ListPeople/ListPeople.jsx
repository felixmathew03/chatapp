import React,{useState,useEffect} from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import route from '../route';
import {Link, useNavigate} from 'react-router-dom'
import './ListPeople.scss'

const ListPeople = () => {
    const value=localStorage.getItem("Auth");
    const navigate=useNavigate();
    const [people,setPeople]=useState([]);
    useEffect(()=>{
        getDetails();
    },[])
    const getDetails=async()=>{
        try {
          const {status,data}=await axios.get(`${route()}listpeople`,{headers:{"Authorization":`Bearer ${value}`}})
        if(status==200){
            setPeople(data.people)
        }else{
            alert(data.msg);
            navigate('/login')
        }
        } catch (error) {
          navigate('/login')
        }
    }
    
  return (
    <div className='ListPeople'>
      <Nav/>
      <div className="container">
        {people.map((user,ind)=> <Link to={`/chatcard/${user._id}`} className="content" key={ind}>
                <img src={user.profile} alt={user.username} />
                <p>{user.username}</p>
            </Link>
        )}
      </div>
    </div>
  )
}

export default ListPeople

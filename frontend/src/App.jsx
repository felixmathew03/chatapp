import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Login from "./Components/Login/Login";
import ForgotPass from "./Components/ForgotP/ForgotPass";
import Signup from "./Components/Signup/Signup";
import Home from './Components/Home/Home';
import ChatCard from './Components/ChatCard/ChatCard';
import ListPeople from './Components/ListPeople/ListPeople';
import NewPassword from './Components/NewPass/NewPassword';
import Profile from './Components/Profile/Profile';
import UserProfile from './Components/UserProfile/UserProfile';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/login' Component={Login}/>
        <Route path='/signup' Component={Signup}/>
        <Route path='/forgotpassword' Component={ForgotPass}/>
        <Route path='/chatcard/:id' Component={ChatCard}/>
        <Route path='/listpeople' Component={ListPeople}/>
        <Route path='/newpassword' Component={NewPassword}/>
        <Route path='/profile' Component={Profile}/>
        <Route path='/userprofile/:id' Component={UserProfile}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

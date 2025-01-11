import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Login from "./Components/Login/Login";
import ForgotPass from "./Components/ForgotP/ForgotPass";
import Signup from "./Components/Signup/Signup";
import Home from './Components/Home/Home';
import ChatCard from './Components/ChatCard/ChatCard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/login' Component={Login}/>
        <Route path='/signup' Component={Signup}/>
        <Route path='/forgotpassword' Component={ForgotPass}/>
        <Route path='/chatcard' Component={ChatCard}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import React from 'react';
import { FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa'
import './Login.scss';

const Login = () => {
  return (
    <div className='Login'>
        <div class="form-container">
            <p class="title">Login</p>
            <form class="form">
                <div class="input-group">
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" placeholder=""/>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" placeholder=""/>
                    <div class="forgot">
                        <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
                    </div>
                </div>
                <button class="sign">Sign in</button>
            </form>
            <div class="social-message">
                <div class="line"></div>
                <p class="message">Login with social accounts</p>
                <div class="line"></div>
            </div>
            <div class="social-icons">
            <button aria-label="Log in with Google" className="icon">
                <FaGoogle size={20} color="#fff" />
            </button>
            <button aria-label="Log in with Twitter" className="icon">
                <FaTwitter size={20} color="#fff" />
            </button>
            <button aria-label="Log in with GitHub" className="icon">
                <FaGithub size={20} color="#fff" />
            </button>
            </div>
            <p class="signup">Don't have an account?
                <a rel="noopener noreferrer" href="#" class="">Sign up</a>
            </p>
        </div>
    </div>
  )
}

export default Login

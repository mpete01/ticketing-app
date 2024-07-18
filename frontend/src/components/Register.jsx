import React, { useState } from "react";
import '../styles/register.css';
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login'
import axios from "axios";

function Register(){
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(!name || !email || !password) {
            window.alert("Please fill out all the fields")
        }
        if(password.length < 8){ ///\d/.test(password) - checks if a string contains an integer
            window.alert("Password should have at least 8 characters")
        } else {
            console.log("Password is good enough (unlike you lmao)")
        try{
            const sentData = await axios.post('http://localhost:3000/users/register_post', { name, email, password })
        } catch(err){
            console.log(err)
        }}
    }

    return <>
        <div className="register-container">
            <form className="register-form">
                <div className="register-form-title">Register</div>
                <input type="text" className="register-form-username input" value={name} id="register-username" placeholder="Enter a username" onChange={(e) => setName(e.target.value)} /><br />
                <input type="text" className="register-form-email input" value={email} id="register-email" placeholder="Enter an email address" onChange={(e) => setEmail(e.target.value)}/><br />
                <div className="password-input-field">
                    <input type={showPassword ? "text" : "password"} value={password} className="register-form-password input" id="register-password" placeholder="Enter a password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" className="show-password" id="show-password" onClick={togglePasswordVisibility}>
                        {showPassword ? <i >&#128065;</i> : <i >&#128065;</i>}
                    </button>
                </div><br />
                <button type="submit" className="register-form-submitButton" onClick={handleSubmit}>Register</button>
                <p>Already have an acoount?<Link className="register-form-link" to="/Login"> Log in</Link></p>
            </form>
        </div>    
    </>
}

export default Register

//&#128065;
//className="show-password" id="show-password" 

import React, { useState } from "react";
import '../styles/register.css';
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login'

function Register(){
    const [inputType, setInputType] = useState("password")
    const [inputValue, setInputValue] = useState("")

    const changeVisibility = (event) => {
        setInputValue(event.target.value)
    }
    const toggleInputType = () => {
        setInputType(inputType === "password" ? "text" : "password")
    }
    
    const submitRegistration = () => {
        if(inputValue === "" || document.getElementById("register-username").value === ""){
            alert("Enter a username and a password")
        } else {
            console.log(document.getElementById("register-username").value)
            console.log(inputValue)
        }
    }

    return <div>
        <div className="register-form">
            <div className="register-form-title">Register</div>
            <input type="text" className="register-form-username input" id="register-username" placeholder="Enter a username" /><br />
            <div className="password-input-field">
                <input type={inputType} value={inputValue} className="register-form-password input" id="register-password" placeholder="Enter a password" onChange={changeVisibility} />
                <button className="show-password" id="show-password" onClick={toggleInputType}>&#128065;</button>
            </div><br />
            <button type="submit" className="register-form-submitButton" onClick={submitRegistration}>Register</button>
            <p>Already have an acoount?</p><Link to="/Login">Log in</Link>
        </div>    
    </div>
}

export default Register
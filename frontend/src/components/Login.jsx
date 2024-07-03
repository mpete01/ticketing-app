import React, { useState } from "react";
import '../styles/login.css';
import Register from './Register'
import Homepage from "../Home";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Login(){
    const [inputType, setInputType] = useState("password")
    const [inputValue, setInputValue] = useState("")

    const changeVisibility = (event) => {
        setInputValue(event.target.value)
    }
    const toggleInputType = () => {
        setInputType(inputType === "password" ? "text" : "password")
    }
    
    const submitLogin = () => {
        /*if(document.getElementById("username-login").value === "" || inputValue === ""){
            alert("Username or password incorrect")}*/
        if (document.getElementById("username-login").value === "user" && inputValue === "password"){
            localStorage.setItem("username", `${document.getElementById("username-login").value}`)
            localStorage.setItem("password", inputValue)
            console.log(document.getElementById("username-login").value)
            console.log(inputValue)
        }
    }
    return <div>
        <div className="login-form">
            <div className="login-form-title">Login</div>
            <input type="text" className="login-form-username input" id="username-login" placeholder="Enter your username" /><br />
            <div className="password-input-field">
                <input type={inputType} value={inputValue} className="login-form-password input" id="login-password" placeholder="Enter your password" onChange={changeVisibility} />
                <button className="show-password" id="show-password" onClick={toggleInputType}>&#128065;</button>
            </div><br />
            <button type="submit" className="login-form-submitButton" onClick={submitLogin}>Login</button>
            <p>Don't have an account? <Link to="/Register">Register</Link></p>
        </div>    
    </div>
}

export default Login
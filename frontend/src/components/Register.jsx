import React, { useState } from "react";
import '../styles/register.css';
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login'
import axios from "axios";

function Register(){
    const [inputType, setInputType] = useState("password")
    const [inputValue, setInputValue] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

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

    const axiostry = async (e) => {
        e.preventDefault();
        try{
            const sentdata = await axios.post('http://localhost:3000/api/data', { name, email, password })
            console.log(sentdata.data)
        } catch(err){
            console.log(err)
        }
    }

    return <>
        <div className="register-form">
            <div className="register-form-title">Register</div>
            <input type="text" className="register-form-username input" value={name} id="register-username" placeholder="Enter a username" onChange={(e) => setName(e.target.value)} /><br />
            <input type="text" className="register-form-email input" value={email} id="register-email" placeholder="Enter an email address" onChange={(e) => setEmail(e.target.value)}/><br />
            <div className="password-input-field">
                <input type={inputType} value={password} className="register-form-password input" id="register-password" placeholder="Enter a password" onChange={(e) => setPassword(e.target.value)} />
                <button className="show-password" id="show-password" onClick={toggleInputType}>&#128065;</button>
            </div><br />
            <button type="submit" className="register-form-submitButton" onClick={submitRegistration}>Register</button>
            <button type="submit" onClick={axiostry}>axiostry</button>
            <p>Already have an acoount?<Link className="register-form-link" to="/Login"> Log in</Link></p>
        </div>    
    </>
}

export default Register
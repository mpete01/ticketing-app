import React, { useState, useEffect } from "react";
import '../styles/login.css';
import Register from './Register'
import Homepage from "../Home";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from "axios";

function Login(){
    const [inputType, setInputType] = useState("password")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const changeVisibility = (event) => {
        setInputValue(event.target.value)
    }

    const toggleInputType = () => {
        setInputType(inputType === "password" ? "text" : "password")
    }

    const submitLogin = async (e) => {
        e.preventDefault()
        //console.log(email, password)
        if(!email || !password) {
            window.alert("Please fill out all the fields")
        }
        try{
            let sentData = await axios.post('http://localhost:3000/users/login', { email, password })
            //console.log(typeof(sentData.data.token))
            if(sentData.data.token === undefined){
                console.log("No user found")
                localStorage.setItem("token", sentData.data.token)
                localStorage.setItem("test", "balls")
            } else {
                console.log("Captain Asshair")
                localStorage.setItem("token", sentData.data.token)
                
            }
        } catch(err){
            console.log(err)
    }}

    const delLocalStor = () => {
        let tokenLocalStor = localStorage.getItem("token")
        //localStorage.clear()
        localStorage.removeItem("test")
    }

    return <>
        <div className="login-form">
            <div className="login-form-title">Login</div>
            <input type="text" className="login-from-email input" id="email-login" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/><br />
            <div className="password-input-field">
                <input type={inputType} value={password} className="login-form-password input" id="login-password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <button className="show-password" id="show-password" onClick={toggleInputType}>&#128065;</button>
            </div><br />
            <button type="submit" className="login-form-submitButton" onClick={submitLogin}>Login</button>
            <button onClick={delLocalStor}>Deleete local storage</button>
            <p>Don't have an account? <Link to="/Register">Register</Link></p>
        </div>    
    </>
}
export default Login
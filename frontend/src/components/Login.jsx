import React, { useState } from "react";
import '../styles/login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


function Login(){
    const [inputType, setInputType] = useState("password")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const toggleInputType = () => {
        setInputType(inputType === "password" ? "text" : "password")
    }

    const submitLogin = async (e) => {
        e.preventDefault()
        if(!email || !password) {
            alert("Please fill out all the fields")
        }
        try{
            let sentData = await axios.post('http://localhost:3000/users/login', { email, password })
            //user doesn't exist or credentials are incorrect (no jwt is awarded)
            if(sentData.data.token === undefined){
                alert("No user found. Password or email is incorrect")
            }
            //user exists and got jwt from server then user is redirected to home page ("/")
            else {
                console.log(sentData.data)
                sessionStorage.setItem("user", email)
                sessionStorage.setItem("token", sentData.data.token)
                sessionStorage.setItem("is_admin", sentData.data.is_admin)
                if(localStorage.getItem("is_darkmode") === null){
                    localStorage.setItem("is_darkmode", false)
                } else {
                    localStorage.setItem("is_darkmode", true)
                }
                navigate('/')
            }
        } catch(err){
            alert(err)
    }}

    return <>
        <div className="login-form">
            <div className="login-form-title">Login</div>
            <input type="text" className="login-from-email input" id="email-login" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/><br />
            <div className="password-input-field">
                <input type={inputType} value={password} className="login-form-password input" id="login-password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <button className="show-password" id="show-password" onClick={toggleInputType}>&#128065;</button>
            </div>
            <button type="submit" className="login-form-submitButton" onClick={submitLogin}>Login</button>
            <p className="register">Don't have an account? <Link to="/Register" style={{ textDecoration: 'underline' }}>Register</Link></p>
        </div>    
    </>
}
export default Login
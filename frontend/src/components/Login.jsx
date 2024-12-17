import React, { useState, useEffect } from "react";
import '../styles/login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function Login(){
    const [inputType, setInputType] = useState("password")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const root = document.documentElement

    //check the user's color theme preference on loading
    /*useEffect(()=> {
        if(localStorage.getItem("is_darkmode") === null){
            localStorage.setItem("is_darkmode", 'false')
        }
        else if(localStorage.getItem("is_darkmode") === 'true'){
            root.style.setProperty('--color-primary', '#1E201E')
            root.style.setProperty('--color-secondary', 'rgb(244, 247, 254)')
        } else if(localStorage.getItem("is_darkmode") === 'false'){
            root.style.setProperty('--color-primary', 'rgb(244, 247, 254)')
            root.style.setProperty('--color-secondary', 'rgb(48, 60, 115)')
        }
    }, [2])*/


    const toggleInputType = () => {
        setInputType(inputType === "password" ? "text" : "password")
    }

    const submitLogin = async (e) => {
        e.preventDefault()
        if(!email || !password) {
            toast.error("Please fill out all the fields")
        } else {
        try{
            const response = await fetch('http://192.168.3.55:3000/users/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
              });
            const sentData = await response.json();
            //user doesn't exist or credentials are incorrect (no jwt is awarded)
            if(sentData.result === "No user found"){
                toast.error("No user found. Password or email is incorrect")
            } else if (sentData.result === "Password is incorrect"){
                toast.error("No user found. Password or email is incorrect")
            }
            //user exists and got jwt from server then user is redirected to home page ("/")
            else if(sentData.result === "Successful authenitcation, email and password are correct") {
                sessionStorage.setItem("user", email)
                sessionStorage.setItem("token", sentData.token)
                sessionStorage.setItem("is_admin", sentData.is_admin)
                sessionStorage.setItem("department", sentData.department)
                toast.success("Login successful. Redirecting to the home page. Just a few seconds", {
                    hideProgressBar:true
                    });
                setTimeout(() => {
                    navigate('/')
                }, 3000);
                
            }
        } catch(err){
            alert(err)
        }
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
        </div>
        <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover={false}
            theme= "colored"
            transition: Bounce
        />
    </>
}
export default Login
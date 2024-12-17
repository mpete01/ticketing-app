import React, { useState, useEffect } from "react";
import '../styles/register.css';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function Register({ onClosePopup }){
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [department, setDepartment] = useState("Select your department")
    const [showPassword, setShowPassword] = useState(false)
    const [failedPopup, setFailedPopup] = useState(false)

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
    }, [])*/

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        //checks if any of the fields are empty, if yes alerts the user that they need to be filled
        if(!name.trim() || !email.trim() || !password.trim()) {
            toast.warn("Please fill out all the fields")
        }
        //checks if the pssword is at least 8 characters and contains numbers
        if(password.length >= 8 && /\d/.test(password)){
            //sending the user's data to the server to register it in the database
            try{
                if(department === "Select your department"){
                    toast.error("No department was chosen")
                } else{
                    // let sentData = await axios.post('http://localhost:3000/users/register', { name, email, password, department })
                    const response = await fetch('http://192.168.3.55:3000/users/register', {
                        method: 'POST',
                        headers: {
                            'Context-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, email, password, department })
                    })
                    const sentData = await response.json()
                    console.log(sentData)
                    if(sentData === "User already registered"){
                        toast.error("User already registered")
                    } else {
                        toast.success("User successfully registered")
                    }
                }
            } catch(err){
                console.log(err)
            }
        }
        //ask the user to enter valid email and password
        else {
            toast.error()
            setFailedPopup(!failedPopup)
            setEmail("")
            setPassword("")
            setName("")
        }
    }

    
    return <>
        <div className="modal">
                <form className="register-form">
                    <div className="register-form-title modal-content_header">Register<button onClick={onClosePopup}>X</button></div>
                    <input type="text" className="register-form-username input" value={name} id="register-username" placeholder="Enter a username" onChange={(e) => setName(e.target.value)} /><br />
                    <input type="text" className="register-form-email input" value={email.trim()} id="register-email" placeholder="Enter an email address" onChange={(e) => setEmail(e.target.value)}/><br />
                    <select name="departments" className="register-form-department">
                        <option  className="register-form-department_option" value="Select your department" onClick={(e) => setDepartment(e.target.value)}>Select your department</option>
                        <option className="register-form-department_option" value="IT" onClick={(e) => setDepartment(e.target.value)}>IT</option>
                        <option className="register-form-department_option" value="Maintanence" onClick={(e) => setDepartment(e.target.value)}>Maintainence</option>
                        <option className="register-form-department_option" value="HR" onClick={(e) => setDepartment(e.target.value)}>HR</option>
                        <option className="register-form-department_option" value="Marketing" onClick={(e) => setDepartment(e.target.value)}>Marketing</option>
                        <option className="register-form-department_option" value="Finance" onClick={(e) => setDepartment(e.target.value)}>Finance</option>
                        <option className="register-form-department_option" value="Open Office" onClick={(e) => setDepartment(e.target.value)}>Open Office</option>
                        option
                    </select>
                    <div className="password-input-field">
                        <input type={showPassword ? "text" : "password"} value={password.trim()} className="register-form-password input" id="register-password" placeholder="Enter a password" onChange={(e) => setPassword(e.target.value)} />
                        <button type="button" className="show-password" id="show-password" onClick={togglePasswordVisibility}>
                            {showPassword ? <i >&#128065;</i> : <i >&#128065;</i>}
                        </button>
                    </div>
                    <button type="submit" className="register-form-submitButton" onClick={handleSubmit}>Register</button>
                </form>
        </div>    
    </>
}

export default Register

import React, { useState, useEffect } from "react";
import '../styles/register.css';
import { Link,  useNavigate } from "react-router-dom";
import axios from "axios";

function Register(){
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [department, setDepartment] = useState("Select your department")
    const [showPassword, setShowPassword] = useState(false)
    const [failedPopup, setFailedPopup] = useState(false)

    //check the user's color theme preference on loading
    useEffect(()=> {
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
    }, [])

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        //checks if any of the fields are empty, if yes alerts the user that they need to be filled
        if(!name.trim() || !email.trim() || !password.trim()) {
            setFailedPopup(!failedPopup)
        }
        //checks if the pssword is at least 8 characters and contains numbers
        if(password.length >= 8 && /\d/.test(password)){
            //sending the user's data to the server to register it in the database
            try{
                if(department === "Select your department"){
                    alert("Choose your department")
                } else{
                    let sentData = await axios.post('http://localhost:3000/users/register', { name, email, password, department })
                    console.log(sentData)
                    if(sentData.data === "User already registered"){
                        alert("User already registered")
                    } else {
                        alert("You have been registered successfully. Please Log in")
                    }
                }
            } catch(err){
                console.log(err)
            }
        }
        //ask the user to enter valid email and password
        else {
            setFailedPopup(!failedPopup)
            setEmail("")
            setPassword("")
            setName("")
        }
    }

    return <>
               

        <div className="modal">
            <div className="overlay"></div>
            <form className="register-form modal-content">
                <div className="register-form-title modal-content_header">Register</div>
                <input type="text" className="register-form-username input" value={name.trim()} id="register-username" placeholder="Enter a username" onChange={(e) => setName(e.target.value)} /><br />
                <input type="text" className="register-form-email input" value={email.trim()} id="register-email" placeholder="Enter an email address" onChange={(e) => setEmail(e.target.value)}/><br />
                <select name="departments" className="register-form-department input">
                    <option  className="register-form-department_option" value="Select your department" onClick={(e) => setDepartment(e.target.value)}>Select your department</option>
                    <option className="register-form-department_option" value="IT" onClick={(e) => setDepartment(e.target.value)}>IT</option>
                    <option className="register-form-department_option" value="Maintanence" onClick={(e) => setDepartment(e.target.value)}>Maintanence</option>
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
                <p>Already have an acoount?<Link className="register-form-link" to="/Login" style={{ textDecoration: 'underline' }}> Log in</Link></p>
            </form>
        </div>    
    </>
}

export default Register

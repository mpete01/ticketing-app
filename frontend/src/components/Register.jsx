import React, { useState } from "react";
import '../styles/register.css';
import { Link } from "react-router-dom";
import axios from "axios";

function Register(){
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [popup, setPopup] = useState(false)
    const [failedPopup, setFailedPopup] = useState(false)
    const [alreadyRegistered, setAlreadyRegisterd] = useState(false)

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
            //console.log(email, password)
            //sending the user's data to the server to register it in the database
            try{
                let sentData = await axios.post('http://localhost:3000/users/register', { name, email, password })
                if(sentData.data === "User already registered"){
                    setAlreadyRegisterd(!alreadyRegistered)
                } else {
                    setPopup(!popup)
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

    const togglePopup = () => {
        setPopup(!popup)
    }

    const toggleFailedPopup = () => {
        setFailedPopup(!failedPopup)
    }

    const toggleAlreadyRegistered = () => {
        setAlreadyRegisterd(!alreadyRegistered)
    }

    if(popup || failedPopup) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }
    //<button className="close-modal" onClick={togglePopup}>Close</button>
    return <>
        <div className="register-container">
            <form className="register-form">
                <div className="register-form-title">Register</div>
                <input type="text" className="register-form-username input" value={name.trim()} id="register-username" placeholder="Enter a username" onChange={(e) => setName(e.target.value)} /><br />
                <input type="text" className="register-form-email input" value={email.trim()} id="register-email" placeholder="Enter an email address" onChange={(e) => setEmail(e.target.value)}/><br />
                <div className="password-input-field">
                    <input type={showPassword ? "text" : "password"} value={password.trim()} className="register-form-password input" id="register-password" placeholder="Enter a password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" className="show-password" id="show-password" onClick={togglePasswordVisibility}>
                        {showPassword ? <i >&#128065;</i> : <i >&#128065;</i>}
                    </button>
                </div>
                <button type="submit" className="register-form-submitButton" onClick={handleSubmit}>Register</button>
                <p>Already have an acoount?<Link className="register-form-link" to="/Login" style={{ textDecoration: 'underline' }}> Log in</Link></p>
            </form>
            {popup && (
                <div className="modal">
                    <div onClick={togglePopup} className="overlay"></div>
                    <div className="modal-content">
                        <h2>Your account has been registered</h2>
                        <p>Please <Link to='/login' style={{ textDecoration: 'underline' }}>Log in</Link> to your account</p>
                        
                    </div>
                </div>
            )}
            {failedPopup && (
                <div className="modal">
                    <div onClick={toggleFailedPopup} className="overlay"></div>
                    <div className="modal-content">
                        <h2>Invalid email or password</h2>
                        <p>Email address must be a valid address<br />Password should be at lest 8 characters and contain numbers</p>
                        <button className="close-modal" onClick={toggleFailedPopup}>Close</button>
                    </div>
                </div>
            )}
            {alreadyRegistered && (
                <div className="modal">
                    <div onClick={toggleAlreadyRegistered} className="overlay"></div>
                    <div className="modal-content">
                        <h2>User already registered</h2>
                        <button className="close-modal" onClick={toggleAlreadyRegistered}>Close</button>
                    </div>
                </div>
            )}
        </div>    
    </>
}

export default Register

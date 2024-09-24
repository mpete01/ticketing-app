import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css'
import axios from 'axios'
import { Navigate, redirect, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()


  const handleSubmit = () => {
    if(email === "email" && password === "password"){
      toast.success("Login Successful. Redirecting")
      setTimeout(() => {
        navigate('/')
      }, 5000);
    } else {
      toast.error("Wrong email or pssword")
      
    }
  };

  return (
    <>
      <input type="email" placeholder='email' onChange={(e) => setEmail(e.target.value)}/>
      <input type="password" placeholder='password' onChange={(e) => setPassword(e.target.value)}/>
      <button onClick={handleSubmit}>Login</button>
      <ToastContainer />
    </>
  )
}

export default App

import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [query, setQuery] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/data', { name, email, password });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const redirectTo = () => {
    navigate('/')
  }

  return (
    <>
       <div className="password-toggle">
        <input
          type={showPassword ? "text" : "password"}
        />
        <button type="button" onClick={togglePasswordVisibility}>balls
          {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
        </button>
      </div>
      <p>-------------------------------------------</p>
      <button onClick={redirectTo}>Redirect</button>
    </>
  )
}

export default App

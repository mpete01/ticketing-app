import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [queryRes, setqueryRes] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/data', { name, email, password });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const dbQuery = async (e) => {
    try {
      const response = axios.get('http:localhost:3000/api/query')
      console.log(response)
      setqueryRes(response)
    } catch (err) {
      console.log(err)
    }
  }
 
  return (
    <>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}/> <br />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/> <br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/> <br />
      <button type='submit' onClick={handleSubmit}>Submit</button> <br />
      <button type='submit' onClick={dbQuery}>Query</button>
      <div>{queryRes}</div>

    </>
  )
}

export default App

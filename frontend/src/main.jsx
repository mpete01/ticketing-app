import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Register from './components/Register'
import Login from './components/Login'
import Homepage from './Home.jsx'


//  <React.StrictMode>  </React.StrictMode>
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path="/Register" element={<Register />} />
      <Route path='/Login' element={<Login />}/>
      <Route path='/App' element={<App />} />
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
)
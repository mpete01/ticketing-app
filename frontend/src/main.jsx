import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Register from './components/Register'
import Login from './components/Login'
import Homepage from './Home.jsx'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'
import NoRoute from './components/Noroute.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>        
        <Route path='/Login' element={<Login />}/>
        <Route path="/Register" element={<Register />} />
        <Route path='*' element={<NoRoute />}/>
        
       
        <Route element={<ProtectedRoutes />}>
          <Route path='/App' element={<App />} />
          <Route path='/' element={<Homepage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)


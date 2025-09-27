import React from 'react';
import { Route, Routes } from "react-router-dom";
import Login from './authFolder/Login';
import Signup from './authFolder/Signup';
import Forgot from './authFolder/Forgot';
import Reset from './authFolder/Reset';
import Verify from './authFolder/verify';
import Home from './homeFolder/Home';
import Create from './blogFolder/Create';
import NotVerified from './authFolder/NotVerified';

// Ye nayi file hai jo App.jsx ke bagal mein hai
import Dashboard from './Dashboard.jsx'; 

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/forgot' element={<Forgot />} />
      <Route path='/reset-password/:token' element={<Reset />} />
      <Route path='/verify/:token' element={<Verify />} />
      <Route path='/create-blog' element={<Create />} />
      <Route path='/not-verified' element={<NotVerified />} />
      
      {/* Ab ye route nayi Dashboard file use kar raha hai */}
      <Route path='/homeblog' element={<Dashboard />} /> 
    </Routes>
  );
}

export default App;


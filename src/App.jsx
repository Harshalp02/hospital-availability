import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Doctor from './components/Doctors';
import Hospitals from './components/Hospitals'; // Assuming Hospitals is a component in your app
import { AuthProvider } from './context/AuthContext';
import Bed from './components/Bed';

const App = () => {
  return (
    <AuthProvider>

      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/beds" element={<Bed />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

    </AuthProvider>
  );
};

export default App;

import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


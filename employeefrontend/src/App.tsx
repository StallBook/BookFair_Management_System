import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Signup />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


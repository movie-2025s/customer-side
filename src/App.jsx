import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* We'll add these routes later */}
          {/* <Route path="/movie/:id" element={<MovieDetails />} /> */}
          {/* <Route path="/book/:showtimeId" element={<Booking />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
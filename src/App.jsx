import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import SeatSelection from './pages/SeatSelection';
import Confirmation from './pages/Confirmation'; // Add this import
import BookingSuccess from './pages/BookingSuccess'; // Add this import
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/book/:id" element={<Booking />} />
          <Route path="/seats/:showtimeId" element={<SeatSelection />} />
          <Route path="/confirmation/:showtimeId" element={<Confirmation />} /> {/* Add this */}
          <Route path="/booking-success" element={<BookingSuccess />} /> {/* Add this */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
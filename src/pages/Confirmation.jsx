import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Confirmation.css';

const Confirmation = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { movie, theatre, showtime, selectedSeats, totalAmount } = location.state || {};
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmBooking = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all customer details');
      return;
    }

    setIsSubmitting(true);

    try {
      const resp = await axios.post('/api/bookings', {
        showtimeId,
        seatIds: selectedSeats.map(s => s.id),
        customer: customerInfo,
        movie: { id: movie?.id, title: movie?.title }
      });
      const booking = resp.data;
      navigate('/booking-success', { state: { booking } });
    } catch (error) {
      console.error('Booking failed:', error);
      const msg = error?.response?.data?.message || 'Booking failed. Please try again.';
      if (error?.response?.status === 409 && error?.response?.data?.seats) {
        alert(`${msg} Unavailable: ${error.response.data.seats.join(', ')}`);
      } else {
        alert(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!movie || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="error-container">
        <div className="error-message">Invalid booking session</div>
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="confirmation">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="booking-header">
        <div className="movie-info-small">
          <img 
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
            alt={movie.title}
            className="movie-poster-small"
          />
          <div className="movie-details-small">
            <h1>{movie.title}</h1>
            <p><strong>{theatre.name}</strong></p>
            <p>{showtime.time} • {selectedSeats.length} seat(s)</p>
          </div>
        </div>
      </div>

      <div className="booking-steps">
        <div className="step completed">
          <span className="step-number">✓</span>
          <span className="step-text">Select Theatre & Time</span>
        </div>
        <div className="step completed">
          <span className="step-number">✓</span>
          <span className="step-text">Choose Seats</span>
        </div>
        <div className="step active">
          <span className="step-number">3</span>
          <span className="step-text">Confirm Booking</span>
        </div>
      </div>

      <div className="confirmation-content">
        <div className="booking-summary">
          <h2>Booking Summary</h2>
          
          <div className="summary-card">
            <div className="summary-row">
              <span>Movie:</span>
              <span>{movie.title}</span>
            </div>
            <div className="summary-row">
              <span>Theatre:</span>
              <span>{theatre.name}</span>
            </div>
            <div className="summary-row">
              <span>Showtime:</span>
              <span>{showtime.time}</span>
            </div>
            <div className="summary-row">
              <span>Seats:</span>
              <span>{selectedSeats.map(seat => seat.id).join(', ')}</span>
            </div>
            <div className="summary-row">
              <span>Seat Types:</span>
              <span>
                {selectedSeats.filter(s => s.type === 'regular').length} Regular,
                {selectedSeats.filter(s => s.type === 'premium').length} Premium
              </span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span className="amount">€{Number(totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="customer-info">
          <h2>Customer Information</h2>
          
          <div className="form-card">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="booking-terms">
              <p>By confirming this booking, you agree to our terms and conditions.</p>
              <p>Seats will be held for 10 minutes to complete the booking.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button 
          onClick={() => navigate(-1)}
          className="back-to-seats-btn"
        >
          ← Back to Seats
        </button>
        <button 
          onClick={handleConfirmBooking}
          className="confirm-booking-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            `Confirm Booking - €${Number(totalAmount).toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
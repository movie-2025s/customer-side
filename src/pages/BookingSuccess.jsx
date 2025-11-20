import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = location.state || {};

  if (!booking) {
    return (
      <div className="error-container">
        <div className="error-message">No booking information found</div>
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="booking-success">
      <div className="success-container">
        <div className="success-icon">🎉</div>
        <h1>Booking Confirmed!</h1>
        <p className="success-message">Your movie tickets have been booked successfully</p>
        
        <div className="booking-details">
          <div className="detail-card">
            <h2>Booking Information</h2>
            
            <div className="detail-row">
              <span>Booking ID:</span>
              <span className="booking-id">{booking.bookingId}</span>
            </div>
            
            <div className="detail-row">
              <span>Movie:</span>
              <span>{booking.movie.title}</span>
            </div>
            
            <div className="detail-row">
              <span>Theatre:</span>
              <span>{booking.theatre.name}</span>
            </div>
            
            <div className="detail-row">
              <span>Showtime:</span>
              <span>{booking.showtime.time}</span>
            </div>
            
            <div className="detail-row">
              <span>Seats:</span>
              <span>{booking.seats.map(seat => seat.id).join(', ')}</span>
            </div>
            
            <div className="detail-row">
              <span>Total Amount:</span>
              <span className="amount">₹{booking.totalAmount}</span>
            </div>
          </div>

          <div className="customer-card">
            <h2>Customer Details</h2>
            
            <div className="detail-row">
              <span>Name:</span>
              <span>{booking.customerInfo.name}</span>
            </div>
            
            <div className="detail-row">
              <span>Email:</span>
              <span>{booking.customerInfo.email}</span>
            </div>
            
            <div className="detail-row">
              <span>Phone:</span>
              <span>{booking.customerInfo.phone}</span>
            </div>
          </div>
        </div>

        <div className="instructions">
          <h3>Important Instructions</h3>
          <ul>
            <li>Please arrive at the theatre 30 minutes before the showtime</li>
            <li>Carry a valid ID proof for verification</li>
            <li>Show this booking confirmation at the ticket counter</li>
            <li>Tickets are non-refundable and non-transferable</li>
          </ul>
        </div>

        <div className="success-actions">
          <button 
            onClick={() => navigate('/')}
            className="home-btn"
          >
            🎬 Book More Movies
          </button>
          <button 
            onClick={() => window.print()}
            className="print-btn"
          >
            🖨️ Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
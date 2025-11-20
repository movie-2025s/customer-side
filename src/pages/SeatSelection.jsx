import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './SeatSelection.css';

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { movie, theatre, showtime } = location.state || {};
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock seat data - we'll replace this with real data later
  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const seatsPerRow = 10;
    const seatLayout = [];

    rows.forEach(row => {
      const rowSeats = [];
      for (let i = 1; i <= seatsPerRow; i++) {
        // Randomly mark some seats as occupied
        const isOccupied = Math.random() < 0.2; // 20% chance
        const seatType = row === 'A' || row === 'B' ? 'premium' : 'regular';
        
        rowSeats.push({
          id: `${row}${i}`,
          row: row,
          number: i,
          type: seatType,
          price: seatType === 'premium' ? showtime?.price + 50 : showtime?.price,
          occupied: isOccupied,
          selected: false
        });
      }
      seatLayout.push(rowSeats);
    });

    return seatLayout;
  };

  useEffect(() => {
    // Simulate loading seats data
    setTimeout(() => {
      setSeats(generateSeats());
      setLoading(false);
    }, 1000);
  }, [showtimeId]);

  const handleSeatClick = (seat) => {
    if (seat.occupied) return;

    if (selectedSeats.find(s => s.id === seat.id)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      // Select seat (max 8 seats)
      if (selectedSeats.length < 8) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        alert('Maximum 8 seats can be selected at a time');
      }
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const proceedToConfirmation = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    navigate(`/confirmation/${showtimeId}`, {
      state: {
        movie,
        theatre,
        showtime,
        selectedSeats,
        totalAmount: calculateTotal()
      }
    });
  };

  if (loading) {
    return <div className="loading">Loading seat layout...</div>;
  }

  if (!movie || !theatre || !showtime) {
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
    <div className="seat-selection">
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
            <p>{showtime.time} • {selectedSeats.length} seat(s) selected</p>
          </div>
        </div>
      </div>

      <div className="booking-steps">
        <div className="step completed">
          <span className="step-number">✓</span>
          <span className="step-text">Select Theatre & Time</span>
        </div>
        <div className="step active">
          <span className="step-number">2</span>
          <span className="step-text">Choose Seats</span>
        </div>
        <div className="step">
          <span className="step-number">3</span>
          <span className="step-text">Confirm Booking</span>
        </div>
      </div>

      <div className="seat-selection-container">
        <div className="screen-indicator">
          <div className="screen">SCREEN</div>
        </div>

        <div className="seats-layout">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              <div className="row-label">{row[0].row}</div>
              {row.map(seat => (
                <button
                  key={seat.id}
                  className={`seat ${seat.type} ${
                    seat.occupied ? 'occupied' : ''
                  } ${
                    selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.occupied}
                  title={`${seat.id} - ₹${seat.price}`}
                >
                  {seat.number}
                </button>
              ))}
              <div className="row-label">{row[0].row}</div>
            </div>
          ))}
        </div>

        <div className="seat-legend">
          <div className="legend-item">
            <div className="seat available"></div>
            <span>Available (₹{showtime.price})</span>
          </div>
          <div className="legend-item">
            <div className="seat premium available"></div>
            <span>Premium (₹{showtime.price + 50})</span>
          </div>
          <div className="legend-item">
            <div className="seat occupied"></div>
            <span>Occupied</span>
          </div>
          <div className="legend-item">
            <div className="seat selected"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>

      <div className="selection-summary">
        <div className="summary-details">
          <h3>Selected Seats</h3>
          {selectedSeats.length > 0 ? (
            <div>
              <p><strong>Seats: </strong>{selectedSeats.map(seat => seat.id).join(', ')}</p>
              <p><strong>Total: </strong>₹{calculateTotal()}</p>
            </div>
          ) : (
            <p>No seats selected</p>
          )}
        </div>
        <button 
          onClick={proceedToConfirmation}
          className="proceed-btn"
          disabled={selectedSeats.length === 0}
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
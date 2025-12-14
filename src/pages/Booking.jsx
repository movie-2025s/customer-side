import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [dateYMD, setDateYMD] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovieAndTheatres();
  }, [id, dateYMD]);

  const fetchMovieAndTheatres = async () => {
    try {
      setLoading(true);
      setError('');

      // Get movie details
      const movieResponse = await axios.get(`/api/tmdb/movie/${id}`);
      setMovie(movieResponse.data);

      // Load theatres and showtimes from backend (Finland)
      const thResp = await axios.get(`/api/booking/options`, { params: { movieId: id, date: dateYMD } });
      setTheatres(thResp.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load booking information.');
    } finally {
      setLoading(false);
    }
  };

  const handleTheatreSelect = (theatre) => {
    setSelectedTheatre(theatre);
    setSelectedShowtime(null);
  };

  const handleShowtimeSelect = (showtime) => {
    if (showtime.available) {
      setSelectedShowtime(showtime);
    }
  };

  const proceedToSeatSelection = () => {
    if (selectedTheatre && selectedShowtime) {
      navigate(`/seats/${selectedShowtime.id}`, {
        state: {
          movie: movie,
          theatre: selectedTheatre,
          showtime: selectedShowtime
        }
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading booking information...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="booking">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      {movie && (
        <div className="booking-header">
          <div className="movie-info-small">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster-small"
            />
            <div className="movie-details-small">
              <h1>{movie.title}</h1>
              <p>{movie.runtime} min • {new Date(movie.release_date).getFullYear()}</p>
              <div className="genres">
                {movie.genres?.map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="booking-steps">
        <div className="step active">
          <span className="step-number">1</span>
          <span className="step-text">Select Theatre & Time</span>
        </div>
        <div className="step">
          <span className="step-number">2</span>
          <span className="step-text">Choose Seats</span>
        </div>
        <div className="step">
          <span className="step-number">3</span>
          <span className="step-text">Confirm Booking</span>
        </div>
      </div>

      <div className="theatre-selection">
        <h2>Select Theatre & Showtime</h2>

        <div className="date-selector">
          <label htmlFor="booking-date">Date</label>
          <input
            id="booking-date"
            type="date"
            value={dateYMD}
            min={new Date().toISOString().slice(0,10)}
            max={new Date(Date.now() + 6*24*60*60*1000).toISOString().slice(0,10)}
            onChange={(e) => setDateYMD(e.target.value)}
          />
        </div>

        <div className="theatres-list">
          {theatres.map(theatre => (
            <div
              key={theatre.id}
              className={`theatre-card ${selectedTheatre?.id === theatre.id ? 'selected' : ''}`}
              onClick={() => handleTheatreSelect(theatre)}
            >
              <div className="theatre-info">
                <h3>{theatre.name}</h3>
                <p className="theatre-location">{theatre.location}</p>
              </div>

              <div className="showtimes">
                {theatre.showtimes.map(showtime => (
                  <button
                    key={showtime.id}
                    className={`showtime-btn ${selectedShowtime?.id === showtime.id ? 'selected' : ''
                      } ${!showtime.available ? 'unavailable' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowtimeSelect(showtime);
                    }}
                    disabled={!showtime.available}
                  >
                    <span className="time">{showtime.time}</span>
                    <span className="price">€{showtime.price.toFixed ? showtime.price.toFixed(2) : showtime.price}</span>
                    {!showtime.available && (
                      <span className="sold-out">Sold Out</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedTheatre && selectedShowtime && (
          <div className="selection-summary">
            <div className="summary-details">
              <h3>Selected Show</h3>
              <p><strong>{selectedTheatre.name}</strong></p>
              <p>{selectedShowtime.time} • €{selectedShowtime.price.toFixed ? selectedShowtime.price.toFixed(2) : selectedShowtime.price}</p>
            </div>
            <button
              onClick={proceedToSeatSelection}
              className="proceed-btn"
            >
              Select Seats →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booki
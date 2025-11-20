import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get movie details from TMDB
      const response = await axios.get(`/api/tmdb/movie/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to load movie details.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate(`/book/${id}`);
  };

  if (loading) {
    return <div className="loading">Loading movie details...</div>;
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

  if (!movie) {
    return (
      <div className="error-container">
        <div className="error-message">Movie not found</div>
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="movie-details">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Movies
      </button>

      <div className="movie-hero">
        <div className="movie-poster">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x600/1a1a1a/666666?text=No+Poster';
            }}
          />
        </div>
        
        <div className="movie-info">
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-meta">
            <span className="rating">⭐ {movie.vote_average?.toFixed(1)}/10</span>
            <span className="year">{new Date(movie.release_date).getFullYear()}</span>
            <span className="runtime">{movie.runtime} min</span>
            <span className="language">{movie.original_language?.toUpperCase()}</span>
          </div>
          
          <div className="genres">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="genre-tag">{genre.name}</span>
            ))}
          </div>

          <p className="overview">{movie.overview}</p>

          <div className="action-buttons">
            <button onClick={handleBookNow} className="book-btn">
              🎫 Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
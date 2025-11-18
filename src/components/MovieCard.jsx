import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Use tmdb_id if available, otherwise use id
    const movieId = movie.tmdb_id || movie.id;
    navigate(`/movie/${movieId}`);
  };

  // Handle both TMDB and local movie data structures
  const getPosterUrl = () => {
    if (movie.poster_url) return movie.poster_url;
    if (movie.poster_path) return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    return 'https://via.placeholder.com/300x450/333/666?text=No+Poster';
  };

  const getTitle = () => movie.title || movie.original_title;
  const getRating = () => movie.rating || movie.vote_average || 'N/A';
  const getGenre = () => movie.genre || (movie.genre_ids ? 'Multiple' : 'Unknown');

  return (
    <div className="movie-card" onClick={handleClick}>
      <img 
        src={getPosterUrl()} 
        alt={getTitle()}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{getTitle()}</h3>
        <p className="movie-genre">{getGenre()}</p>
        <p className="movie-rating">⭐ {getRating()}/10</p>
        <p className="movie-language">
          {movie.language?.toUpperCase() || movie.original_language?.toUpperCase()}
        </p>
        {movie.release_date && (
          <p className="movie-year">{new Date(movie.release_date).getFullYear()}</p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
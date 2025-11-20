import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTMDBPopular();
  }, []);

  const fetchTMDBPopular = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/tmdb/popular');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching TMDB movies:', error);
      setError('Failed to fetch movies from TMDB. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async () => {
    if (!searchQuery.trim()) {
      fetchTMDBPopular();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/api/search/movies?q=${searchQuery}`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error searching movies:', error);
      setError('Search failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMovies();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchTMDBPopular();
  };

  if (loading) {
    return (
      <div className="loading">
        Loading popular movies...
      </div>
    );
  }

  return (
    <div className="home">
      <h1 className="page-title">🎬 Popular Movies</h1>
      <p className="page-subtitle">
        Discover the latest and most popular movies from The Movie Database
      </p>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for movies by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={searchMovies} disabled={!searchQuery.trim()}>
          🔍 Search
        </button>
        {searchQuery && (
          <button onClick={clearSearch} className="clear-btn">
            ✕ Clear
        </button>
        )}
        <button onClick={fetchTMDBPopular} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {movies.length > 0 && (
        <div className="movies-count">
          Found {movies.length} movie{movies.length !== 1 ? 's' : ''}
          {searchQuery && ` for "${searchQuery}"`}
        </div>
      )}

      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
          />
        ))}
      </div>

      {movies.length === 0 && !error && !loading && (
        <div className="no-movies">
          {searchQuery ? (
            <>
              <h3>No movies found for "{searchQuery}"</h3>
              <p>Try searching with different keywords or browse popular movies.</p>
              <button onClick={clearSearch}>
                Browse Popular Movies
              </button>
            </>
          ) : (
            <>
              <h3>No movies available</h3>
              <p>Unable to load popular movies at the moment.</p>
              <button onClick={fetchTMDBPopular}>
                Try Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
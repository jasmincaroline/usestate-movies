import React, { useState, useMemo, useCallback } from 'react';
import './App.css';

const initialMovies = [
  { id: 1, titulo: "Interestellar", imagem: "https://upload.wikimedia.org/wikipedia/pt/thumb/3/3a/Interstellar_Filme.png/250px-Interstellar_Filme.png", visto: false, favorito: false },
  { id: 2, titulo: "About Time", imagem: "https://m.media-amazon.com/images/I/61t9DbA-R5L._UF1000,1000_QL80_.jpg", visto: true, favorito: false },
  { id: 3, titulo: "I'm Still Here", imagem: "https://m.media-amazon.com/images/M/MV5BYzg2ODkzZTktNTY2Ni00Yjg0LTk4OWEtMTlhNTVlZTQ4NTdkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", visto: false, favorito: true },
  { id: 4, titulo: "La La Land", imagem: "https://upload.wikimedia.org/wikipedia/pt/c/c0/La_La_Land_%28filme%29.png", visto: false, favorito: false },
  { id: 5, titulo: "Star Wars", imagem: "https://d14d9vp3wdof84.cloudfront.net/image/589816272436/image_3p8l67l7u1787chn6tuabla211/-S897-FWEBP", visto: true, favorito: true },
];

const FilterButton = ({ activeFilter, current, label, onClick }) => (
  <button
    onClick={() => onClick(current)}
    className={`filter-button ${activeFilter === current ? 'active' : ''}`}
  >
    {label}
  </button>
);

const MovieCard = React.memo(({ movie, toggleWatched, toggleFavorite, removeMovie}) => (
  <div className="movie-card">
    <div className="movie-image-container">
      <img
        src={movie.imagem}
        alt={`Capa do filme ${movie.titulo}`}
        className={`movie-image ${movie.visto ? 'watched' : ''}`}
        onError={(e) => { e.target.onerror = null; e.target.src = movie.imagem; }}
      />
    </div>
    <div className="movie-info">
      <h3 className="movie-title" title={movie.titulo}>{movie.titulo}</h3>
      <div className="movie-actions">
        <button
          onClick={() => toggleFavorite(movie.id)}
          className={`icon-button favorite-button ${movie.favorito ? 'active' : ''}`}
          title={movie.favorito ? "Unfavorite" : "Favorite"}
        >⭐</button>

        <button
          onClick={() => toggleWatched(movie.id)}
          className={`action-button watch-button ${movie.visto ? 'watched' : ''}`}
          title={movie.visto ? "Mark as Unwatched" : "Mark as Watched"}
        >
          <span className="emoji-icon">👁️</span>
          <span className="hide-on-mobile">{movie.visto ? 'Watched' : 'Watch'}</span>
        </button>
      </div>
    </div>
  </div>
));

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [filter, setFilter] = useState('all');

  const toggleWatched = useCallback((id) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, visto: !m.visto } : m));
  }, []);
  const toggleFavorite = useCallback((id) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, favorito: !m.favorito } : m));
  }, []);

  const filteredMovies = useMemo(() => {
    if (filter === 'watched') return movies.filter(m => m.visto);
    if (filter === 'favorites') return movies.filter(m => m.favorito);
    return movies;
  }, [movies, filter]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="main-title">
          <span className="main-title-icon">🎬</span> Mini Letterboxd
        </h1>
        <p className="app-subtitle">
          Manage your movies easily!
        </p>
      </header>

      <section className="filter-section">
      <FilterButton activeFilter={filter} current="all" label={`All (${movies.length})`} onClick={setFilter} />
      <FilterButton activeFilter={filter} current="watched" label={`Seen (${movies.filter(m => m.visto).length})`} onClick={setFilter} />
      <FilterButton activeFilter={filter} current="favorites" label={`Favorites (${movies.filter(m => m.favorito).length})`} onClick={setFilter} />
      </section>

      <main>
        {filteredMovies.length > 0 ? (
          <div className="movie-grid">
            {filteredMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                toggleWatched={toggleWatched}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon"></span>
            <p>
              {filter === 'all' ? 'No movies in the list. Add some!' : `No movies found in the "${filter === 'watched' ? 'Watched' : 'Favorites'}" filter.`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

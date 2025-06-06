import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PLACEHOLDER_SRC = 'https://via.placeholder.com/150x198?text=No+Image';

export default function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
    : PLACEHOLDER_SRC;

  const overlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Link
      to={`/movies/${movie.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        width: '150px',
        height: '198px',
        position: 'relative',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: 4,
        overflow: 'hidden',
        flex: '0 0 auto',
      }}
    >
      <img
        src={posterUrl}
        alt={movie.title || 'No poster available'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {hovered && (
        <div style={overlayStyle}>
          <span
            style={{
              color: '#fff',
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '90%', 
              textAlign: 'center',
            }}
          >
            {movie.title}
          </span>
        </div>
      )}
    </Link>
  );
}

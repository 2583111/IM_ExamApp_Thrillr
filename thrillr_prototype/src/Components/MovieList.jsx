import React from 'react';
import MovieCard from './MovieCards';

export default function MovieList({ title, movies }) {
  // show up to 20 cards
  const display = movies.slice(0, 20);

  return (
    <section style={{ margin: '2rem 0' }}>
      <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{title}</h2>
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '2rem',             
          paddingRight: '6rem',   
          marginRight: '-6rem',   

        }}
      >
        {display.map(m => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}

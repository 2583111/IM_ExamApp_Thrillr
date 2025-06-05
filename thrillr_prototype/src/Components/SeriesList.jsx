import React from 'react';
import SeriesCard from './SeriesCard';

export default function SeriesList({ title, series }) {
  // show up to 20 cards
  const display = series.slice(0, 20);

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
        {display.map(s => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>
    </section>
  );
}

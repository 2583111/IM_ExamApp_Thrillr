import React, { useEffect, useState } from 'react';
import MovieCard      from '../Components/MovieCards';
import SeriesCard     from '../Components/SeriesCard';
import { getList }    from '../Utility/ListUtility';
import { fetchItemDetails } from '../Utility/GetItemDetails';
import '../Styling/ListsPages.css';

export default function CompletedListPage() {
  const [movieItems, setMovieItems]   = useState([]);
  const [seriesItems, setSeriesItems] = useState([]);

  useEffect(() => {
    const mIDs = getList('completed-movie');
    const sIDs = getList('completed-series');

    Promise.all(mIDs.map(id => fetchItemDetails('movie', id)))
      .then(results => setMovieItems(results.filter(Boolean)));

    Promise.all(sIDs.map(id => fetchItemDetails('series', id)))
      .then(results => setSeriesItems(results.filter(Boolean)));
  }, []);

  return (
    <div className="lists-container">
      <div className="list-title-wrapper">
        <h2 className="list-title">Your Completed List</h2>
      </div>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Movies</h2>
        {movieItems.length === 0 ? (
          <p className="empty-text">No completed movies.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {movieItems.map(m => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Series</h2>
        {seriesItems.length === 0 ? (
          <p className="empty-text">No completed series.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '1rem',
            }}
          >
            {seriesItems.map(s => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

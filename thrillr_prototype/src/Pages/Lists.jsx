import React, { useState, useEffect } from 'react';
import { Link }     from 'react-router-dom';
import MovieCard    from '../Components/MovieCards';
import SeriesCard   from '../Components/SeriesCard';
import { getList }  from '../Utility/ListUtility';
import { fetchItemDetails } from '../Utility/GetItemDetails';
import '../Styling/ListsPages.css';

export default function ListsPage() {
  const [watchlistMovies, setWatchlistMovies]   = useState([]);
  const [watchlistSeries, setWatchlistSeries]   = useState([]);
  const [completedMovies, setCompletedMovies]   = useState([]);
  const [completedSeries, setCompletedSeries]   = useState([]);

  useEffect(() => {
    const wMoviesIDs = getList('watchlist-movie').slice(0, 3);
    const wSeriesIDs = getList('watchlist-series').slice(0, 3);
    const cMoviesIDs = getList('completed-movie').slice(0, 3);
    const cSeriesIDs = getList('completed-series').slice(0, 3);

    Promise.all(wMoviesIDs.map(id => fetchItemDetails('movie', id)))
      .then(setWatchlistMovies);
    Promise.all(wSeriesIDs.map(id => fetchItemDetails('series', id)))
      .then(setWatchlistSeries);
    Promise.all(cMoviesIDs.map(id => fetchItemDetails('movie', id)))
      .then(setCompletedMovies);
    Promise.all(cSeriesIDs.map(id => fetchItemDetails('series', id)))
      .then(setCompletedSeries);
  }, []);

  return (
    <div className="lists-container">
      {/* Watchlist Preview */}
      <section className="list-section">
        <div className="list-title-wrapper">
          <h2 className="list-title">Watchlist</h2>
        </div>
        {watchlistMovies.length === 0 && watchlistSeries.length === 0 ? (
          <p className="empty-text">Nothing in your watchlist yet.</p>
        ) : (
          <div className="horizontal-scroll">
            {watchlistMovies.map(m => m && <MovieCard key={m.id} movie={m} />)}
            {watchlistSeries.map(s => s && <SeriesCard key={s.id} series={s} />)}
          </div>
        )}
        <div className="button-container">
          <Link to="/watchlist">
            <button className="view-button">View Full Watchlist</button>
          </Link>
        </div>
      </section>

      {/* Completed Preview */}
      <section className="list-section">
        <div className="list-title-wrapper">
          <h2 className="list-title">Completed</h2>
        </div>
        {completedMovies.length === 0 && completedSeries.length === 0 ? (
          <p className="empty-text">Nothing marked as completed yet.</p>
        ) : (
          <div className="horizontal-scroll">
            {completedMovies.map(m => m && <MovieCard key={m.id} movie={m} />)}
            {completedSeries.map(s => s && <SeriesCard key={s.id} series={s} />)}
          </div>
        )}
        <div className="button-container">
          <Link to="/completed">
            <button className="view-button">View Full Completed</button>
          </Link>
        </div>
      </section>

      {/* Reviews & Discussions Preview */}
      <section className="list-section">
        <div className="list-title-wrapper">
          <h2 className="list-title">Reviews &amp; Discussions</h2>
        </div>
        <p className="subtext">
          See all your posted reviews, comments, and discussions here.
        </p>
        <div className="button-container">
          <Link to="/my-reviews">
            <button className="view-button">Go to Reviews &amp; Comments</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

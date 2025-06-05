import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authorization/AuthContext';
import { useReviews } from '../Authorization/ReviewContext';
import ReviewForm from '../Components/ReviewForm';
import ReviewList from '../Components/ReviewList';
import '../Styling/DescriptionPage.css';

const API_KEY  = '680c759ca5b3d7e7b323f7c6c646367b';
const BASE_URL = 'https://api.themoviedb.org/3';

export default function SeriesDescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { getReviewsForItem } = useReviews();
  const reviews = getReviewsForItem('series', id);

  const [series, setSeries]         = useState(null);
  const [cast, setCast]             = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  const [inWatchlist, setInWatchlist] = useState(false);
  const [inCompleted, setInCompleted] = useState(false);

  // Fetch series details
  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setCast(data.credits.cast.slice(0, 5));
        const yt = data.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
        if (yt) setTrailerKey(yt.key);

        const creators = data.created_by?.map(c => c.name).join(', ') || 'Unknown';

        setSeries({
          id:            data.id,
          name:          data.name,
          overview:      data.overview,
          first_air_date: data.first_air_date,
          first_year:    data.first_air_date?.slice(0, 4) || '',
          genres:        data.genres.map(g => g.name),
          creators,
          vote_average:  data.vote_average,
          poster_path:   data.poster_path
        });
      } catch (e) {
        console.error(e);
        setError('Could not load series details.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  // Check if already in watchlist/completed
  useEffect(() => {
    if (!currentUser || !series) return;
    try {
      const wlRaw   = localStorage.getItem(`watchlist-series::username`) || '[]';
      const compRaw = localStorage.getItem(`completed-series::${currentUser}`) || '[]';
      const wl   = JSON.parse(wlRaw);
      const comp = JSON.parse(compRaw);
      setInWatchlist(wl.some(i => i.id === series.id));
      setInCompleted(comp.some(i => i.id === series.id));
    } catch {
      setInWatchlist(false);
      setInCompleted(false);
    }
  }, [currentUser, series]);

  // Add to watchlist
  const handleAddToWatchlist = () => {
    if (!isAuthenticated) {
      alert('You must be logged in to add to your watchlist.');
      return;
    }
    const key = `watchlist-series::${currentUser}`;
    const raw = localStorage.getItem(key) || '[]';
    let arr;
    try {
      arr = JSON.parse(raw);
    } catch {
      arr = [];
    }
    if (arr.some(i => i.id === series.id)) {
      alert('Already in your watchlist.');
      return;
    }
    const newItem = {
      id:           series.id,
      type:         'series',
      poster_path:  series.poster_path,
      name:         series.name,
    };
    arr.unshift(newItem);
    localStorage.setItem(key, JSON.stringify(arr));
    setInWatchlist(true);
  };

  // Mark as completed
  const handleMarkCompleted = () => {
    if (!isAuthenticated) {
      alert('You must be logged in to mark as completed.');
      return;
    }
    const key = `completed-series::${currentUser}`;
    const raw = localStorage.getItem(key) || '[]';
    let arr;
    try {
      arr = JSON.parse(raw);
    } catch {
      arr = [];
    }
    if (arr.some(i => i.id === series.id)) {
      alert('Already in your completed list.');
      return;
    }
    const newItem = {
      id:           series.id,
      type:         'series',
      poster_path:  series.poster_path,
      name:         series.name,
    };
    arr.unshift(newItem);
    localStorage.setItem(key, JSON.stringify(arr));
    setInCompleted(true);
  };

  if (loading)  return <p style={{ padding: '1rem' }}>Loading…</p>;
  if (error)    return <p style={{ padding: '1rem', color: 'red' }}>{error}</p>;
  if (!series)  return <p style={{ padding: '1rem' }}>Series not found.</p>;

  return (
    <div>
      <div className="description-container">
        {/* Poster */}
        <div className="description-poster">
          {series.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${series.poster_path}`}
              alt={series.name}
            />
          ) : (
            <div style={{
              width: '200px',
              height: '300px',
              background: '#eee',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa'
            }}>
              No Image
            </div>
          )}
        </div>

        {/* Details + Buttons */}
        <div className="description-details">
          <div>
            <div className="description-title">
              {series.name} {series.first_year && `(${series.first_year})`}
            </div>
            <div className="details-row">
              <div className="detail-item">Creators: {series.creators}</div>
              <div className="detail-item">Genres: {series.genres.join(', ')}</div>
              <div className="detail-item">⭐ {series.vote_average.toFixed(1)}</div>
            </div>
          </div>

          <div className="description-text">{series.overview}</div>

          <div className="buttons-row">
            {inWatchlist ? (
              <button onClick={() => navigate('/watchlist')}>Go to Watchlist</button>
            ) : (
              <button onClick={handleAddToWatchlist}>Add to Watchlist</button>
            )}

            {inCompleted ? (
              <button onClick={() => navigate('/completed')}>Completed List</button>
            ) : (
              <button onClick={handleMarkCompleted}>Mark as Completed</button>
            )}
          </div>
        </div>

        {/* Trailer  */}
        {trailerKey && (
          <div className="trailer-container">
            <iframe
              title="Trailer"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              allow="autoplay; encrypted-media"
            />
          </div>
        )}
      </div>

      {/* Cast section */}
      <div className="cast-section">
        <h2>Top Cast</h2>
        <div className="cast-list">
          {cast.map(c => (
            <div key={c.cast_id} className="actor-card">
              {c.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                  alt={c.name}
                />
              ) : (
                <div style={{
                  width: '120px',
                  height: '160px',
                  background: '#ccc',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666'
                }}>
                  No Photo
                </div>
              )}
              <div className="actor-name">{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="red-divider" />

      {/* Reviews section */}
      <div className="review-section">
        <h2>Reviews</h2>
        <div className="review-form">
          <ReviewForm parentType="series" parentId={id} />
        </div>
        <div className="review-list">
          <ReviewList parentType="series" parentId={id} reviews={reviews} />
        </div>
      </div>
    </div>
  );
}

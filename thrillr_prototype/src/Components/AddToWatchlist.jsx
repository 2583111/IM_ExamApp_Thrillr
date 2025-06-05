import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../Authorization/AuthContext';


export default function AddToWatchlistButton({
  parentType,
  itemId,
  posterPath,
  titleOrName,
}) {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist]   = useState(false);

  // ─── Build the exact key including currentUser ─
  const storageKey = currentUser
    ? (parentType === 'movie'
      ? `watchlist-movie::${currentUser}`
      : `watchlist-series::${currentUser}`)
    : null;

  // On mount (and whenever currentUser/itemId changes), check if already in list
  useEffect(() => {
    if (!storageKey) {
      setInWatchlist(false);
      return;
    }
    try {
      const raw    = localStorage.getItem(storageKey) || '[]';
      const parsed = JSON.parse(raw);
      const exists = Array.isArray(parsed) && parsed.some(i => i.id === itemId);
      setInWatchlist(exists);
    } catch {
      setInWatchlist(false);
    }
  }, [currentUser, itemId, storageKey]);

  const handleClick = () => {
    if (!isAuthenticated) {
      alert('You must be logged in to add to your watchlist.');
      return;
    }
    if (!storageKey) return;

    // If already in watchlist, navigate to the watchlist page
    if (inWatchlist) {
      navigate('/watchlist');
      return;
    }

    // Otherwise, read the existing array (or create a new one)
    let arr;
    try {
      arr = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(arr)) arr = [];
    } catch {
      arr = [];
    }

    // Prevent duplicates
    if (arr.some(i => i.id === itemId)) {
      setInWatchlist(true);
      navigate('/watchlist');
      return;
    }

    // Build the new item object
    const newItem = {
      id:          itemId,
      type:        parentType,
      poster_path: posterPath || null,
      title:       titleOrName,
    };
    arr.unshift(newItem);
    localStorage.setItem(storageKey, JSON.stringify(arr));
    setInWatchlist(true);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding:      '0.5rem 1rem',
        borderRadius: 4,
        background:   inWatchlist ? '#007bff' : '#333',
        color:        '#fff',
        border:       'none',
        cursor:       'pointer',
      }}
    >
      {inWatchlist ? 'Go to Watchlist' : 'Add to Watchlist'}
    </button>
  );
}

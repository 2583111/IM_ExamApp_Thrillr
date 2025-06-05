import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../Authorization/AuthContext';

export default function WatchlistButton() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (!isAuthenticated) {
      alert('You must be logged in to view your watchlist.');
      return;
    }
    navigate('/watchlist');
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding:      '0.5rem 1rem',
        borderRadius: 4,
        background:   '#007bff',
        color:        '#fff',
        border:       'none',
        cursor:       'pointer',
      }}
    >
      Go to Watchlist
    </button>
  );
}

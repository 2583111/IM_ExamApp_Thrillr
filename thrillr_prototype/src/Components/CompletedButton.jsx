import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }     from '../Authorization/AuthContext';

export default function MarkCompletedButton({
  parentType,
  itemId,
  posterPath,
  titleOrName,
}) {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [inCompleted, setInCompleted]   = useState(false);

  // ─── Build the exact key including currentUser 
  const storageKey = currentUser
    ? (parentType === 'movie'
      ? `completed-movie::${currentUser}`
      : `completed-series::${currentUser}`)
    : null;

  // On mount (and whenever currentUser/itemId changes), check if already in list
  useEffect(() => {
    if (!storageKey) {
      setInCompleted(false);
      return;
    }
    try {
      const raw    = localStorage.getItem(storageKey) || '[]';
      const parsed = JSON.parse(raw);
      const exists = Array.isArray(parsed) && parsed.some(i => i.id === itemId);
      setInCompleted(exists);
    } catch {
      setInCompleted(false);
    }
  }, [currentUser, itemId, storageKey]);

  const handleClick = () => {
    if (!isAuthenticated) {
      alert('You must be logged in to mark as completed.');
      return;
    }
    if (!storageKey) return;

    // If already marked completed, navigate to the completed list page
    if (inCompleted) {
      navigate('/completed');
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
      setInCompleted(true);
      navigate('/completed');
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
    setInCompleted(true);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding:      '0.5rem 1rem',
        borderRadius: 4,
        background:   inCompleted ? '#007bff' : '#333',
        color:        '#fff',
        border:       'none',
        cursor:       'pointer',
      }}
    >
      {inCompleted ? 'Go to Completed List' : 'Mark as Completed'}
    </button>
  );
}

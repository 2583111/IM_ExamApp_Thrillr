import React, { createContext, useContext, useState, useEffect } from 'react';

const AchievementsContext = createContext({
  unlocked: {},
  unlock: (id) => {},
  isUnlocked: (id) => false,
  listAll: () => [],
});

const ALL_ACHIEVEMENTS = [
  { id: 'watchlist_movie',  label: 'First Movie Added to Watchlist' },
  { id: 'completed_movie',  label: 'First Movie Marked Completed' },
  { id: 'leave_review',     label: 'First Review Left' },
  { id: 'start_discussion', label: 'First Discussion Started' },
  { id: 'subgenre_watch',   label: 'Watched a Horror Sub-Genre Movie' },
  { id: 'added_series',     label: 'First Series Added to Watchlist' },
  { id: 'completed_series', label: 'First Series Marked Completed' },

];

export function AchievementsProvider({ children }) {
  const STORAGE_KEY = 'thrillrAchievements';
  const [unlocked, setUnlocked] = useState({});

  // Load saved achievements on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUnlocked(JSON.parse(raw));
      } catch {
        setUnlocked({});
      }
    }
  }, []);

  // Persist whenever `unlocked` changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
  }, [unlocked]);

  function unlock(id) {
    // Only unlock if it exists in ALL_ACHIEVEMENTS
    if (!ALL_ACHIEVEMENTS.find((a) => a.id === id)) return;
    setUnlocked((prev) => {
      if (prev[id]) return prev; 
      return { ...prev, [id]: true };
    });
  }

  function isUnlocked(id) {
    return !!unlocked[id];
  }

  function listAll() {
    return ALL_ACHIEVEMENTS.map((a) => ({
      id: a.id,
      label: a.label,
      unlocked: !!unlocked[a.id],
    }));
  }

  return (
    <AchievementsContext.Provider value={{ unlocked, unlock, isUnlocked, listAll }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  return useContext(AchievementsContext);
}

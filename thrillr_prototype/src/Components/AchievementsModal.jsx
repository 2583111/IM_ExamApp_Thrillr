import React, { useState, useEffect } from 'react';
import { useAchievements } from '../Authorization/AchievementsContext';

export default function AchievementModal() {
  const [visible, setVisible] = useState(false);
  const { listAll } = useAchievements();

  useEffect(() => {
    function handler() {
      setVisible(true);
    }
    window.addEventListener('open-achievements', handler);
    return () => window.removeEventListener('open-achievements', handler);
  }, []);

  const all = listAll();

  if (!visible) return null;

  return (
    <>

      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)', 
          zIndex: 2000,
        }}
        onClick={() => setVisible(false)}
      />

      {/* Modal container */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#000',           
          color: '#fff',                
          padding: '1.5rem 2rem',
          borderRadius: '8px',
          maxWidth: '90%',
          maxHeight: '80%',
          overflowY: 'auto',
          zIndex: 2001,
          boxShadow: '0 2px 12px rgba(0,0,0,0.7)',
        }}
      >
        <h2 style={{ marginTop: 0, color: '#fff' }}>Achievements</h2>
        <button
          onClick={() => setVisible(false)}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          {all.map((a) => (
            <li
              key={a.id}
              style={{
                marginBottom: '0.75rem',
                opacity: a.unlocked ? 1 : 0.4,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {a.unlocked ? '🏅' : '⛔'} <span>{a.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
